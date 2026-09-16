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

    return await mergedPdf.save({ useObjectStreams: true })
  } catch (error) {
    console.error("Error merging PDFs:", error)
    throw new Error("Failed to merge PDF files. Please verify that files are valid, unencrypted PDFs.")
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
      const pageIndices: number[] = []

      // Adjust for 0-based indexing
      const start = Math.max(0, range.start - 1)
      const end = Math.min(totalPages - 1, range.end - 1)

      for (let i = start; i <= end; i++) {
        pageIndices.push(i)
      }

      if (pageIndices.length > 0) {
        const copiedPages = await newPdf.copyPages(pdf, pageIndices)
        copiedPages.forEach((page) => {
          newPdf.addPage(page)
        })
        splitPdfs.push(await newPdf.save({ useObjectStreams: true }))
      }
    }

    return splitPdfs
  } catch (error) {
    console.error("Error splitting PDF:", error)
    throw new Error("Failed to split PDF file.")
  }
}

/**
 * Extracts specific pages from a PDF
 */
export async function extractPages(pdfFile: File, pageNumbers: number[]): Promise<Uint8Array> {
  try {
    const fileBuffer = await pdfFile.arrayBuffer()
    const pdf = await PDFDocument.load(fileBuffer)
    const totalPages = pdf.getPageCount()
    const newPdf = await PDFDocument.create()

    // Adjust for 0-based indexing and filter within bounds
    const pageIndices = pageNumbers
      .map((num) => num - 1)
      .filter((idx) => idx >= 0 && idx < totalPages)

    if (pageIndices.length === 0) {
      throw new Error("No valid page numbers selected for extraction.")
    }

    const copiedPages = await newPdf.copyPages(pdf, pageIndices)
    copiedPages.forEach((page) => {
      newPdf.addPage(page)
    })

    return await newPdf.save({ useObjectStreams: true })
  } catch (error) {
    console.error("Error extracting pages:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to extract pages from PDF")
  }
}

/**
 * Compresses a PDF file by stripping unneeded metadata and applying stream compression
 */
export async function compressPDF(pdfFile: File, quality: number): Promise<Uint8Array> {
  try {
    const fileBuffer = await pdfFile.arrayBuffer()
    const pdf = await PDFDocument.load(fileBuffer, {
      ignoreEncryption: true,
      updateMetadata: false,
    })

    // Clean redundant metadata
    pdf.setTitle("")
    pdf.setAuthor("")
    pdf.setSubject("")
    pdf.setKeywords([])
    pdf.setProducer("PDFlyer Digital Atelier")
    pdf.setCreator("PDFlyer Volume Compressor")

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
    const font = await pdf.embedFont(StandardFonts.HelveticaBold)

    const normalizedOpacity = Math.max(0.05, Math.min(1, opacity / 100))
    const textColor = rgb(0.35, 0.35, 0.35)

    for (const page of pages) {
      const { width, height } = page.getSize()
      const fontSize = Math.max(16, Math.min(width, height) * 0.055)
      const textWidth = font.widthOfTextAtSize(text, fontSize)
      const textHeight = font.heightAtSize(fontSize)

      let x = (width - textWidth) / 2
      let y = (height - textHeight) / 2

      switch (position) {
        case "center":
          // Center watermark rotated at 45 degrees
          x = (width - textWidth * 0.7) / 2
          y = (height - textHeight * 0.7) / 2
          page.drawText(text, {
            x,
            y,
            font,
            size: fontSize,
            color: textColor,
            opacity: normalizedOpacity,
            rotate: degrees(45),
          })
          break

        case "top-left":
          x = 24
          y = height - textHeight - 24
          page.drawText(text, { x, y, font, size: fontSize * 0.7, color: textColor, opacity: normalizedOpacity })
          break

        case "top-right":
          x = width - textWidth * 0.7 - 24
          y = height - textHeight - 24
          page.drawText(text, { x, y, font, size: fontSize * 0.7, color: textColor, opacity: normalizedOpacity })
          break

        case "bottom-left":
          x = 24
          y = 24
          page.drawText(text, { x, y, font, size: fontSize * 0.7, color: textColor, opacity: normalizedOpacity })
          break

        case "bottom-right":
          x = width - textWidth * 0.7 - 24
          y = 24
          page.drawText(text, { x, y, font, size: fontSize * 0.7, color: textColor, opacity: normalizedOpacity })
          break

        case "tile":
          const tileSizeX = Math.max(120, width * 0.35)
          const tileSizeY = Math.max(100, height * 0.3)
          for (let tileX = 20; tileX < width; tileX += tileSizeX) {
            for (let tileY = 20; tileY < height; tileY += tileSizeY) {
              page.drawText(text, {
                x: tileX,
                y: tileY,
                font,
                size: fontSize * 0.5,
                color: textColor,
                opacity: normalizedOpacity * 0.75,
                rotate: degrees(45),
              })
            }
          }
          break
      }
    }

    return await pdf.save({ useObjectStreams: true })
  } catch (error) {
    console.error("Error adding text watermark:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to add text watermark to PDF")
  }
}

/**
 * Adds an image watermark to a PDF
 */
export async function addImageWatermark(
  pdfFile: File,
  imageFile: File,
  opacity: number,
  position: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "tile",
): Promise<Uint8Array> {
  try {
    const fileBuffer = await pdfFile.arrayBuffer()
    const pdf = await PDFDocument.load(fileBuffer)
    const imageBuffer = await imageFile.arrayBuffer()

    const isPng = imageFile.type === "image/png" || imageFile.name.toLowerCase().endsWith(".png")
    const image = isPng
      ? await pdf.embedPng(imageBuffer)
      : await pdf.embedJpg(imageBuffer)

    const pages = pdf.getPages()
    const alpha = Math.max(0.05, Math.min(1, opacity / 100))

    for (const page of pages) {
      const { width, height } = page.getSize()
      const maxDim = Math.min(width, height) * 0.35
      const scale = Math.min(maxDim / image.width, maxDim / image.height, 1)
      const imgWidth = image.width * scale
      const imgHeight = image.height * scale

      let x = (width - imgWidth) / 2
      let y = (height - imgHeight) / 2

      switch (position) {
        case "center":
          page.drawImage(image, { x, y, width: imgWidth, height: imgHeight, opacity: alpha })
          break
        case "top-left":
          x = 24
          y = height - imgHeight - 24
          page.drawImage(image, { x, y, width: imgWidth, height: imgHeight, opacity: alpha })
          break
        case "top-right":
          x = width - imgWidth - 24
          y = height - imgHeight - 24
          page.drawImage(image, { x, y, width: imgWidth, height: imgHeight, opacity: alpha })
          break
        case "bottom-left":
          x = 24
          y = 24
          page.drawImage(image, { x, y, width: imgWidth, height: imgHeight, opacity: alpha })
          break
        case "bottom-right":
          x = width - imgWidth - 24
          y = 24
          page.drawImage(image, { x, y, width: imgWidth, height: imgHeight, opacity: alpha })
          break
        case "tile":
          const stepX = imgWidth * 1.6
          const stepY = imgHeight * 1.6
          for (let tx = 20; tx < width; tx += stepX) {
            for (let ty = 20; ty < height; ty += stepY) {
              page.drawImage(image, {
                x: tx,
                y: ty,
                width: imgWidth * 0.6,
                height: imgHeight * 0.6,
                opacity: alpha * 0.8,
              })
            }
          }
          break
      }
    }

    return await pdf.save({ useObjectStreams: true })
  } catch (error) {
    console.error("Error adding image watermark:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to add image watermark to PDF")
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
      pageNumbers.forEach((pageNum) => {
        const index = pageNum - 1
        if (index >= 0 && index < pages.length) {
          pages[index].setRotation(degrees(rotation))
        }
      })
    }

    return await pdf.save({ useObjectStreams: true })
  } catch (error) {
    console.error("Error rotating PDF:", error)
    throw new Error("Failed to rotate PDF pages")
  }
}

/**
 * Converts a Uint8Array to a Blob with the specified MIME type
 */
export function uint8ArrayToBlob(data: Uint8Array, mimeType = "application/pdf"): Blob {
  // Copy into a fresh ArrayBuffer-backed view: `BlobPart` does not accept the
  // `ArrayBufferLike` (possibly shared) buffer that `Uint8Array` may wrap.
  return new Blob([new Uint8Array(data)], { type: mimeType })
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
      const [startStr, endStr] = range.split("-").map((s) => s.trim())
      const start = Number(startStr)
      const end = Number(endStr)
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let i = Math.max(1, start); i <= Math.min(end, totalPages); i++) {
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

  return [...new Set(pageNumbers)].sort((a, b) => a - b)
}

/**
 * Gets the number of pages in a PDF file
 */
export async function getPdfPageCount(pdfFile: File): Promise<number> {
  try {
    const fileBuffer = await pdfFile.arrayBuffer()
    const pdf = await PDFDocument.load(fileBuffer, { ignoreEncryption: true })
    return pdf.getPageCount()
  } catch (error) {
    console.error("Error getting PDF page count:", error)
    throw new Error("Failed to read PDF page count")
  }
}
