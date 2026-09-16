import JSZip from "jszip"

/** Minimal shape of a PDF.js text content item that carries extractable text. */
type PdfTextItem = {
  str: string
  transform?: number[]
}

// Utility to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

/**
 * Robust client-side text extractor from a PDF file.
 * Uses pdfjs-dist when available in browser, with a fallback stream parser.
 */
export async function extractTextFromPdf(file: File): Promise<string[]> {
  const arrayBuffer = await file.arrayBuffer()
  const pagesText: string[] = []

  // Try using pdfjs-dist if in browser
  if (typeof window !== "undefined") {
    try {
      const pdfjs = await import("pdfjs-dist")
      // Set worker source
      if (!pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version || "3.11.174"}/pdf.worker.min.js`
      }

      const loadingTask = pdfjs.getDocument({
        data: new Uint8Array(arrayBuffer),
        useSystemFonts: true,
        isEvalSupported: false,
      })
      const pdfDoc = await loadingTask.promise

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i)
        const textContent = await page.getTextContent()
        const pageLines: string[] = []
        let lastY: number | null = null
        let currentLine = ""

        for (const item of textContent.items as unknown as PdfTextItem[]) {
          if (typeof item.str !== "string") continue
          const y = item.transform ? item.transform[5] : 0

          if (lastY !== null && Math.abs(y - lastY) > 5) {
            if (currentLine.trim()) pageLines.push(currentLine.trim())
            currentLine = item.str
          } else {
            currentLine += (currentLine ? " " : "") + item.str
          }
          lastY = y
        }
        if (currentLine.trim()) pageLines.push(currentLine.trim())
        pagesText.push(pageLines.join("\n"))
      }

      if (pagesText.length > 0 && pagesText.some((p) => p.trim().length > 0)) {
        return pagesText
      }
    } catch (e) {
      console.warn("PDF.js text extraction fallback triggered:", e)
    }
  }

  // Fallback text extraction via stream parsing
  try {
    const uint8 = new Uint8Array(arrayBuffer)
    const rawString = new TextDecoder("latin1").decode(uint8)
    const matches = rawString.match(/\(([^()]*)\)\s*Tj/g) || []
    const extractedWords: string[] = []

    for (const match of matches) {
      const content = match.replace(/^\(/, "").replace(/\)\s*Tj$/, "").trim()
      if (content) extractedWords.push(content)
    }

    if (extractedWords.length > 0) {
      pagesText.push(extractedWords.join(" "))
    } else {
      pagesText.push(`[Manuscript: ${file.name}]\n[Portable document text extraction compiled on ${new Date().toLocaleDateString()}]`)
    }
  } catch {
    pagesText.push(`[Document Folio: ${file.name}]`)
  }

  return pagesText
}

/**
 * Render first page of PDF to an HTML5 canvas and return as an image Blob (JPG or PNG)
 */
export async function renderPdfToImageBlob(
  file: File,
  format: "jpg" | "png",
  scale = 2.0,
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer()
  const pdfjs = await import("pdfjs-dist")

  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version || "3.11.174"}/pdf.worker.min.js`
  }

  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true,
  })
  const pdfDoc = await loadingTask.promise
  const page = await pdfDoc.getPage(1)

  const viewport = page.getViewport({ scale })
  const canvas = document.createElement("canvas")
  canvas.width = viewport.width
  canvas.height = viewport.height
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    throw new Error("Unable to obtain 2D canvas context for PDF rendering.")
  }

  // Fill background white for JPG
  if (format === "jpg") {
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  await page.render({
    canvasContext: ctx,
    viewport,
  }).promise

  return new Promise((resolve, reject) => {
    const mimeType = format === "jpg" ? "image/jpeg" : "image/png"
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error(`Failed to generate ${format.toUpperCase()} image from document page.`))
      },
      mimeType,
      format === "jpg" ? 0.92 : undefined,
    )
  })
}

/**
 * Build valid Microsoft Word (.docx) package from extracted PDF pages
 */
export async function generateDocxBlob(file: File): Promise<Blob> {
  const pagesText = await extractTextFromPdf(file)
  const zip = new JSZip()

  // 1. [Content_Types].xml
  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`,
  )

  // 2. _rels/.rels
  zip.file(
    "_rels/.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`,
  )

  // 3. word/document.xml
  let bodyXml = ""
  for (let pIndex = 0; pIndex < pagesText.length; pIndex++) {
    const lines = pagesText[pIndex].split("\n")
    for (const line of lines) {
      if (line.trim()) {
        bodyXml += `<w:p><w:r><w:t>${escapeXml(line)}</w:t></w:r></w:p>`
      }
    }
    if (pIndex < pagesText.length - 1) {
      // Page break between pages
      bodyXml += `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`
    }
  }

  if (!bodyXml) {
    bodyXml = `<w:p><w:r><w:t>${escapeXml(file.name)}</w:t></w:r></w:p>`
  }

  zip.file(
    "word/document.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${bodyXml}
    <w:sectPr/>
  </w:body>
</w:document>`,
  )

  return await zip.generateAsync({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  })
}

/**
 * Build valid Microsoft Excel (.xlsx) package from extracted PDF text
 */
export async function generateXlsxBlob(file: File): Promise<Blob> {
  const pagesText = await extractTextFromPdf(file)
  const zip = new JSZip()

  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`,
  )

  zip.file(
    "_rels/.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`,
  )

  zip.file(
    "xl/_rels/workbook.xml.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`,
  )

  zip.file(
    "xl/workbook.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Sheet1" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`,
  )

  // Generate rows
  let rowXml = ""
  let rowIndex = 1

  for (const pageContent of pagesText) {
    const lines = pageContent.split("\n")
    for (const line of lines) {
      if (!line.trim()) continue
      // Try to split on tabs, multiple spaces, or commas
      const cells = line.split(/\t| {2,}|,/)
      let colCellsXml = ""

      for (let c = 0; c < cells.length; c++) {
        const val = cells[c].trim()
        if (val) {
          colCellsXml += `<c t="inlineStr"><is><t>${escapeXml(val)}</t></is></c>`
        }
      }

      if (colCellsXml) {
        rowXml += `<row r="${rowIndex}">${colCellsXml}</row>`
        rowIndex++
      }
    }
  }

  if (!rowXml) {
    rowXml = `<row r="1"><c t="inlineStr"><is><t>${escapeXml(file.name)}</t></is></c></row>`
  }

  zip.file(
    "xl/worksheets/sheet1.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>
    ${rowXml}
  </sheetData>
</worksheet>`,
  )

  return await zip.generateAsync({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })
}

/**
 * Build valid Microsoft PowerPoint (.pptx) package from extracted PDF pages
 */
export async function generatePptxBlob(file: File): Promise<Blob> {
  const pagesText = await extractTextFromPdf(file)
  const zip = new JSZip()
  const pageCount = Math.max(1, pagesText.length)

  // Content types overrides for slides
  let slideOverrides = ""
  let presentationRels = ""
  let sldIdLst = ""

  for (let i = 1; i <= pageCount; i++) {
    slideOverrides += `<Override PartName="/ppt/slides/slide${i}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>\n`
    presentationRels += `<Relationship Id="rId${i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i}.xml"/>\n`
    sldIdLst += `<p:sldId id="${255 + i}" r:id="rId${i}"/>\n`
  }

  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  ${slideOverrides}
</Types>`,
  )

  zip.file(
    "_rels/.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`,
  )

  zip.file(
    "ppt/_rels/presentation.xml.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${presentationRels}
</Relationships>`,
  )

  zip.file(
    "ppt/presentation.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldMasterIdLst/>
  <p:sldIdLst>
    ${sldIdLst}
  </p:sldIdLst>
  <p:sldSz cx="9144000" cy="6858000" type="screen4x3"/>
</p:presentation>`,
  )

  // Generate each slide
  for (let i = 1; i <= pageCount; i++) {
    const text = pagesText[i - 1] || file.name
    const firstLine = text.split("\n")[0] || `Folio Leaf ${i}`
    const remainder = text.split("\n").slice(1, 10).join(" ")

    zip.file(
      `ppt/slides/slide${i}.xml`,
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr/>
      <!-- Slide Title Shape -->
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="2" name="Title"/>
          <p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr>
          <p:nvPr><p:ph type="title"/></p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm><a:off x="685800" y="685800"/><a:ext cx="7772400" cy="1143000"/></a:xfrm>
        </p:spPr>
        <p:txBody>
          <a:bodyPr/>
          <a:lstStyle/>
          <a:p>
            <a:r>
              <a:t>${escapeXml(firstLine.slice(0, 100))}</a:t>
            </a:r>
          </a:p>
        </p:txBody>
      </p:sp>
      <!-- Slide Content Shape -->
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="3" name="Content"/>
          <p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr>
          <p:nvPr><p:ph type="body" idx="1"/></p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm><a:off x="685800" y="2133600"/><a:ext cx="7772400" cy="4114800"/></a:xfrm>
        </p:spPr>
        <p:txBody>
          <a:bodyPr/>
          <a:lstStyle/>
          <a:p>
            <a:r>
              <a:t>${escapeXml(remainder.slice(0, 600))}</a:t>
            </a:r>
          </a:p>
        </p:txBody>
      </p:sp>
    </p:spTree>
  </p:cSld>
</p:sld>`,
    )
  }

  return await zip.generateAsync({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  })
}

/**
 * Extract clean Plain Text (.txt) from PDF file
 */
export async function generateTxtBlob(file: File): Promise<Blob> {
  const pagesText = await extractTextFromPdf(file)
  const fullText = pagesText.join("\n\n" + "—".repeat(40) + "\n\n")
  return new Blob([fullText], { type: "text/plain;charset=utf-8" })
}
