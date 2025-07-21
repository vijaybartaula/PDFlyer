import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib"

/**
 * Merges multiple PDF files into a single PDF
 */
export async function mergePDFs(pdfFiles: File[]): Promise<Uint8Array> {
  try {
    const mergedPdf = await PDFDocument.create()

    for (const pdfFile of pdfFiles) {
      const fileBuffer = await pdfFile.arrayBuffer()
      const pdf = await PDFDocument.load(fileBuffer)
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page)
      })
    }

    return await mergedPdf.save()
  } catch (error) {
    console.error("Error merging PDFs:", error)
    throw new Error("Failed to merge PDF files")
  }
}

/**
 * Splits a PDF file into multiple PDFs based on page ranges
 */
export async function splitPDF(pdfFile: File, ranges: { start: number; end: number }[]): Promise<Uint8Array[]> {
  try {
    const fileBuffer = await pdfFile.arrayBuffer()
    const pdf = await PDFDocument.load(fileBuffer)
    const totalPages = pdf.getPageCount()

    const splitPdfs: Uint8Array[] = []

    for (const range of ranges) {
      const newPdf = await PDFDocument.create()
      const pageIndices = []

      // Adjust for 0-based indexing
      const start = Math.max(0, range.start - 1)
      const end = Math.min(totalPages - 1, range.end - 1)

      for (let i = start; i <= end; i++) {
        pageIndices.push(i)
      }

      const copiedPages = await newPdf.copyPages(pdf, pageIndices)
      copiedPages.forEach((page) => {
        newPdf.addPage(page)
      })

      splitPdfs.push(await newPdf.save())
    }

    return splitPdfs
  } catch (error) {
    console.error("Error splitting PDF:", error)
    throw new Error("Failed to split PDF file")
  }
}

/**
 * Extracts specific pages from a PDF
 */
export async function extractPages(pdfFile: File, pageNumbers: number[]): Promise<Uint8Array> {
  try {
    const fileBuffer = await pdfFile.arrayBuffer()
    const pdf = await PDFDocument.load(fileBuffer)
    const newPdf = await PDFDocument.create()

    // Adjust for 0-based indexing
    const pageIndices = pageNumbers.map((num) => num - 1)

    const copiedPages = await newPdf.copyPages(pdf, pageIndices)
    copiedPages.forEach((page) => {
      newPdf.addPage(page)
    })

    return await newPdf.save()
  } catch (error) {
    console.error("Error extracting pages:", error)
    throw new Error("Failed to extract pages from PDF")
  }
}

/**
 * Compresses a PDF file (basic implementation)
 * Note: Full compression would require more advanced techniques
 */
export async function compressPDF(pdfFile: File, quality: number): Promise<Uint8Array> {
  try {
    const fileBuffer = await pdfFile.arrayBuffer()
    const pdf = await PDFDocument.load(fileBuffer, {
      ignoreEncryption: true,
      updateMetadata: false,
    })

    // Basic compression by removing metadata
    pdf.setTitle("")
    pdf.setAuthor("")
    pdf.setSubject("")
    pdf.setKeywords([])
    pdf.setProducer("")
    pdf.setCreator("")

    // More advanced compression would require image processing
    // which is beyond the scope of pdf-lib alone

    return await pdf.save({
      useObjectStreams: true,
      addDefaultPage: false,
    })
  } catch (error) {
    console.error("Error compressing PDF:", error)
    throw new Error("Failed to compress PDF file")
  }
}

/**
 * Adds a text watermark to a PDF
 */
export async function addTextWatermark(
  pdfFile: File,
  text: string,
  opacity: number,
  position: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "tile",
): Promise<Uint8Array> {
  try {
    const fileBuffer = await pdfFile.arrayBuffer()
    const pdf = await PDFDocument.load(fileBuffer)
    const pages = pdf.getPages()
    const font = await pdf.embedFont(StandardFonts.Helvetica)

    const color = rgb(0.5, 0.5, 0.5).setAlpha(opacity / 100)

    for (const page of pages) {
      const { width, height } = page.getSize()
      const fontSize = Math.min(width, height) * 0.05
      const textWidth = font.widthOfTextAtSize(text, fontSize)
      const textHeight = font.heightAtSize(fontSize)

      let x = 0
      let y = 0

      switch (position) {
        case "center":
          x = (width - textWidth) / 2
          y = (height - textHeight) / 2
          page.drawText(text, { x, y, font, size: fontSize, color, opacity: opacity / 100, rotate: degrees(45) })
          break

        case "top-left":
          x = 20
          y = height - 20 - textHeight
          page.drawText(text, { x, y, font, size: fontSize, color })
          break

        case "top-right":
          x = width - textWidth - 20
          y = height - 20 - textHeight
          page.drawText(text, { x, y, font, size: fontSize, color })
          break

        case "bottom-left":
          x = 20
          y = 20
          page.drawText(text, { x, y, font, size: fontSize, color })
          break

        case "bottom-right":
          x = width - textWidth - 20
          y = 20
          page.drawText(text, { x, y, font, size: fontSize, color })
          break

        case "tile":
          const tileSize = Math.min(width, height) * 0.2
          for (let tileX = 0; tileX < width; tileX += tileSize) {
            for (let tileY = 0; tileY < height; tileY += tileSize) {
              page.drawText(text, {
                x: tileX,
                y: tileY,
                font,
                size: fontSize / 2,
                color,
                opacity: opacity / 100,
                rotate: degrees(45),
              })
            }
          }
          break
      }
    }

    return await pdf.save()
  } catch (error) {
    console.error("Error adding watermark:", error)
    throw new Error("Failed to add watermark to PDF")
  }
}

/**
 * Rotates pages in a PDF
 */
export async function rotatePDF(
  pdfFile: File,
  rotation: 90 | 180 | 270,
  pageNumbers: number[] | "all",
): Promise<Uint8Array> {
  try {
    const fileBuffer = await pdfFile.arrayBuffer()
    const pdf = await PDFDocument.load(fileBuffer)
    const pages = pdf.getPages()

    if (pageNumbers === "all") {
      pages.forEach((page) => {
        page.setRotation(degrees(rotation))
      })
    } else {
      // Adjust for 0-based indexing
      pageNumbers.forEach((pageNum) => {
        const index = pageNum - 1
        if (index >= 0 && index < pages.length) {
          pages[index].setRotation(degrees(rotation))
        }
      })
    }

    return await pdf.save()
  } catch (error) {
    console.error("Error rotating PDF:", error)
    throw new Error("Failed to rotate PDF pages")
  }
}

/**
 * Converts a Uint8Array to a Blob with the specified MIME type
 */
export function uint8ArrayToBlob(data: Uint8Array, mimeType = "application/pdf"): Blob {
  return new Blob([data], { type: mimeType })
}

/**
 * Creates a download URL for a Blob
 */
export function createDownloadURL(blob: Blob): string {
  return URL.createObjectURL(blob)
}

/**
 * Triggers a file download
 */
export function downloadFile(url: string, filename: string): void {
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

  // Clean up the URL object after a delay
  setTimeout(() => URL.revokeObjectURL(url), 100)
}

/**
 * Parses a page range string (e.g., "1-3, 5, 7-9") into an array of page numbers
 */
export function parsePageRanges(rangeStr: string, totalPages: number): number[] {
  const pageNumbers: number[] = []

  if (!rangeStr.trim()) {
    return pageNumbers
  }

  const ranges = rangeStr.split(",").map((r) => r.trim())

  for (const range of ranges) {
    if (range.includes("-")) {
      const [start, end] = range.split("-").map(Number)
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let i = start; i <= Math.min(end, totalPages); i++) {
          pageNumbers.push(i)
        }
      }
    } else {
      const pageNum = Number(range)
      if (!isNaN(pageNum) && pageNum <= totalPages && pageNum > 0) {
        pageNumbers.push(pageNum)
      }
    }
  }

  // Remove duplicates and sort
  return [...new Set(pageNumbers)].sort((a, b) => a - b)
}

/**
 * Gets the number of pages in a PDF file
 */
export async function getPdfPageCount(pdfFile: File): Promise<number> {
  try {
    const fileBuffer = await pdfFile.arrayBuffer()
    const pdf = await PDFDocument.load(fileBuffer)
    return pdf.getPageCount()
  } catch (error) {
    console.error("Error getting PDF page count:", error)
    throw new Error("Failed to get PDF page count")
  }
}
