"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import PdfUploader from "./pdf-uploader"
import { downloadFile, createDownloadURL } from "@/lib/pdf-utils"
import {
  generateDocxBlob,
  generateXlsxBlob,
  generatePptxBlob,
  generateTxtBlob,
  renderPdfToImageBlob,
} from "@/lib/pdf-converter-service"

interface FormatOption {
  id: string
  label: string
  extension: string
  mimeType: string
  description: string
  badge: string
}

const SUPPORTED_FORMATS: FormatOption[] = [
  {
    id: "docx",
    label: "Microsoft Word Document",
    extension: "docx",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    description: "Converts text, headings, and paragraph blocks into an editable .docx manuscript.",
    badge: "Word Processing",
  },
  {
    id: "xlsx",
    label: "Microsoft Excel Spreadsheet",
    extension: "xlsx",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    description: "Extracts tabular rows, ledgers, and delimited values into standard .xlsx cells.",
    badge: "Spreadsheet",
  },
  {
    id: "pptx",
    label: "Microsoft PowerPoint Presentation",
    extension: "pptx",
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    description: "Transforms document folios into structured presentation slides with titles and body text.",
    badge: "Slides",
  },
  {
    id: "png",
    label: "PNG Image Plate (High Resolution)",
    extension: "png",
    mimeType: "image/png",
    description: "Renders crisp 2x vector rasterization with lossless photographic clarity.",
    badge: "Lossless Image",
  },
  {
    id: "jpg",
    label: "JPEG Image Plate",
    extension: "jpg",
    mimeType: "image/jpeg",
    description: "Renders standard high-fidelity photographic plate suitable for web and archival distribution.",
    badge: "Compressed Image",
  },
  {
    id: "txt",
    label: "Plain Text Document",
    extension: "txt",
    mimeType: "text/plain",
    description: "Extracts pure unadorned UTF-8 typographic text matter preserving leaf breaks.",
    badge: "Raw Transcript",
  },
]

export default function PdfConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [convertTo, setConvertTo] = useState<string>("docx")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [lastConvertedFormat, setLastConvertedFormat] = useState<string>("docx")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl)
      }
    }
  }, [downloadUrl])

  const handleFileSelected = (files: File[]) => {
    setError(null)
    setIsComplete(false)

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl)
      setDownloadUrl(null)
    }

    if (files.length > 0) {
      setFile(files[0])
    } else {
      setFile(null)
    }
  }

  const resetFile = () => {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl)
      setDownloadUrl(null)
    }
    setFile(null)
    setIsComplete(false)
    setError(null)
  }

  const convertPdf = async () => {
    if (!file) {
      setError("Please deposit a PDF manuscript first.")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      let outputBlob: Blob

      switch (convertTo) {
        case "docx":
          outputBlob = await generateDocxBlob(file)
          break
        case "xlsx":
          outputBlob = await generateXlsxBlob(file)
          break
        case "pptx":
          outputBlob = await generatePptxBlob(file)
          break
        case "png":
          outputBlob = await renderPdfToImageBlob(file, "png", 2.0)
          break
        case "jpg":
          outputBlob = await renderPdfToImageBlob(file, "jpg", 2.0)
          break
        case "txt":
          outputBlob = await generateTxtBlob(file)
          break
        default:
          throw new Error(`The chosen medium format '${convertTo}' is not supported.`)
      }

      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl)
      }

      const url = createDownloadURL(outputBlob)
      setDownloadUrl(url)
      setLastConvertedFormat(convertTo)
      setIsComplete(true)
    } catch (err) {
      console.error("Error converting PDF:", err)
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during transmutation. Please verify document formatting.",
      )
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadConvertedFile = () => {
    if (downloadUrl && file) {
      const sanitizedName = file.name.replace(/\.[^/.]+$/, "")
      downloadFile(downloadUrl, `${sanitizedName}.${lastConvertedFormat}`)
    }
  }

  const activeOption = SUPPORTED_FORMATS.find((f) => f.id === lastConvertedFormat)

  return (
    <div className="space-y-6">
      <div>
        <div className="editorial-tag text-muted-foreground mb-1">Instrument IV · Medium Transmutation</div>
        <h2 className="text-xl md:text-2xl font-serif font-medium text-foreground">Format Transmuter</h2>
        <p className="text-xs md:text-sm text-muted-foreground font-sans mt-1">
          Transmute PDF manuscripts into editable documents, spreadsheets, presentation slides, or high-res images. The source manuscript stays loaded for repeated conversions.
        </p>
      </div>

      {!file && <PdfUploader onFilesSelected={handleFileSelected} multiple={false} />}

      {file && (
        <div className="p-4 bg-muted/40 border border-border rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-serif font-medium text-foreground">{file.name}</div>
            <div className="text-[0.7rem] text-muted-foreground font-mono">
              Source: {(file.size / 1024 / 1024).toFixed(2)} MB · Ready for conversion to any format below
            </div>
          </div>
          <button
            type="button"
            onClick={resetFile}
            className="text-xs font-sans uppercase tracking-wider py-1 px-2.5 border border-border bg-background hover:bg-muted rounded-sm transition-colors text-foreground self-start sm:self-auto"
          >
            Deposit Different File
          </button>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="rounded-sm">
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      {file && (
        <div className="space-y-6 pt-2">
          {/* Format Radio Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-serif font-medium text-foreground">Target Medium Format</h3>

            <RadioGroup
              value={convertTo}
              onValueChange={(val) => {
                setConvertTo(val)
                setError(null)
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              {SUPPORTED_FORMATS.map((format) => (
                <div
                  key={format.id}
                  className={`flex items-start space-x-3 p-3.5 border rounded-sm transition-colors cursor-pointer ${
                    convertTo === format.id
                      ? "border-foreground bg-muted/40"
                      : "border-border bg-card hover:border-foreground/40"
                  }`}
                  onClick={() => {
                    setConvertTo(format.id)
                    setError(null)
                  }}
                >
                  <RadioGroupItem value={format.id} id={format.id} className="mt-1" />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={format.id} className="font-serif text-sm font-medium cursor-pointer">
                        {format.label}
                      </Label>
                      <span className="editorial-tag text-[0.6rem] text-muted-foreground">
                        .{format.extension}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                      {format.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Success Download Banner */}
          {isComplete && downloadUrl && (
            <div className="p-4 bg-muted/50 border border-foreground/20 rounded-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-serif font-medium text-foreground">
                  ✓ Transmutation Complete: Ready as .{lastConvertedFormat} ({activeOption?.badge})
                </div>
                <span className="text-[0.7rem] font-mono text-muted-foreground">Original source remains loaded</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={downloadConvertedFile}
                  className="px-6 py-2 bg-foreground text-background text-xs uppercase tracking-wider font-semibold rounded-sm hover:opacity-90"
                >
                  Download {activeOption?.extension.toUpperCase()} File
                </Button>
                <span className="text-xs text-muted-foreground">
                  Select any other format above and click &ldquo;Convert Again&rdquo; to generate another format.
                </span>
              </div>
            </div>
          )}

          {/* Primary Action Button */}
          <Button
            onClick={convertPdf}
            disabled={isProcessing}
            className="w-full py-2.5 bg-foreground text-background text-xs uppercase tracking-wider font-semibold rounded-sm hover:opacity-90 transition-opacity"
          >
            {isProcessing
              ? "Transmuting Manuscript..."
              : isComplete
              ? `Convert Again to ${convertTo.toUpperCase()} from Same Source`
              : `Convert to ${convertTo.toUpperCase()}`}
          </Button>
        </div>
      )}
    </div>
  )
}
