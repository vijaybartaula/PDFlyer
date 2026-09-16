"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import PdfUploader from "./pdf-uploader"
import {
  rotatePDF,
  parsePageRanges,
  getPdfPageCount,
  uint8ArrayToBlob,
  createDownloadURL,
  downloadFile,
} from "@/lib/pdf-utils"

export default function PdfRotate() {
  const [file, setFile] = useState<File | null>(null)
  const [rotateOption, setRotateOption] = useState<"all" | "specific">("all")
  const [rotateAngle, setRotateAngle] = useState<90 | 180 | 270>(90)
  const [pageRange, setPageRange] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [lastRotatedAngle, setLastRotatedAngle] = useState<number>(90)
  const [error, setError] = useState<string | null>(null)

  // Clean up download URL when component unmounts
  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl)
      }
    }
  }, [downloadUrl])

  const handleFileSelected = async (files: File[]) => {
    setError(null)
    setIsComplete(false)

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl)
      setDownloadUrl(null)
    }

    if (files.length > 0) {
      setFile(files[0])
      try {
        const pageCount = await getPdfPageCount(files[0])
        setTotalPages(pageCount)
      } catch (err) {
        console.error("Error reading PDF:", err)
        setError("Could not parse the PDF manuscript. Please verify it is not encrypted.")
        setFile(null)
        setTotalPages(0)
      }
    } else {
      setFile(null)
      setTotalPages(0)
    }
  }

  const resetFile = () => {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl)
      setDownloadUrl(null)
    }
    setFile(null)
    setTotalPages(0)
    setIsComplete(false)
    setError(null)
  }

  const rotatePdf = async () => {
    if (!file) {
      setError("Please deposit a PDF manuscript first.")
      return
    }

    if (rotateOption === "specific" && !pageRange.trim()) {
      setError("Please specify page numbers to rectify (e.g. 1, 3, 5).")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      let rotatedPdfBytes: Uint8Array

      if (rotateOption === "all") {
        rotatedPdfBytes = await rotatePDF(file, rotateAngle, "all")
      } else {
        const pageNumbers = parsePageRanges(pageRange, totalPages)
        if (pageNumbers.length === 0) {
          throw new Error("No valid page numbers found in the specified range.")
        }
        rotatedPdfBytes = await rotatePDF(file, rotateAngle, pageNumbers)
      }

      const pdfBlob = uint8ArrayToBlob(rotatedPdfBytes)
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl)
      }
      const url = createDownloadURL(pdfBlob)

      setDownloadUrl(url)
      setLastRotatedAngle(rotateAngle)
      setIsComplete(true)
    } catch (err) {
      console.error("Error rotating PDF:", err)
      setError(err instanceof Error ? err.message : "An error occurred while rotating the folios.")
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadRotatedPdf = () => {
    if (downloadUrl && file) {
      const sanitizedName = file.name.replace(/\.[^/.]+$/, "")
      downloadFile(downloadUrl, `${sanitizedName}_rotated${lastRotatedAngle}.pdf`)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="editorial-tag text-muted-foreground mb-1">Instrument VI · Orientation Alignment</div>
        <h2 className="text-xl md:text-2xl font-serif font-medium text-foreground">Orientation Corrector</h2>
        <p className="text-xs md:text-sm text-muted-foreground font-sans mt-1">
          Rectify inverted leaves or landscape folios. The original source manuscript remains available in memory for repeated corrections.
        </p>
      </div>

      {!file && <PdfUploader onFilesSelected={handleFileSelected} multiple={false} />}

      {file && (
        <div className="p-4 bg-muted/40 border border-border rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-serif font-medium text-foreground">{file.name}</div>
            <div className="text-[0.7rem] text-muted-foreground font-mono">
              Total Leaves: {totalPages} pages · {(file.size / 1024 / 1024).toFixed(2)} MB · Persistent in state
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

      {file && totalPages > 0 && (
        <div className="space-y-6 pt-2">
          <div className="space-y-4 p-5 border border-border bg-card rounded-sm">
            <h3 className="text-sm font-serif font-medium text-foreground">Scope of Orientation</h3>

            <RadioGroup
              value={rotateOption}
              onValueChange={(val: "all" | "specific") => {
                setRotateOption(val)
                setError(null)
              }}
              className="space-y-3"
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="all" id="rotate-all-option" className="mt-1" />
                <div>
                  <Label htmlFor="rotate-all-option" className="font-serif text-sm cursor-pointer">
                    Apply to Entire Volume ({totalPages} Leaves)
                  </Label>
                  <p className="text-xs text-muted-foreground font-sans">
                    Rotate every leaf in the manuscript simultaneously.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <RadioGroupItem value="specific" id="rotate-specific-option" className="mt-1" />
                <div className="flex-1 space-y-1">
                  <Label htmlFor="rotate-specific-option" className="font-serif text-sm cursor-pointer">
                    Apply Only to Designated Pages
                  </Label>
                  <p className="text-xs text-muted-foreground font-sans">
                    Specify comma-separated leaves or ranges (e.g. 1, 3, 5-8).
                  </p>
                  {rotateOption === "specific" && (
                    <Input
                      type="text"
                      placeholder="e.g. 1, 3, 5-7"
                      value={pageRange}
                      onChange={(e) => setPageRange(e.target.value)}
                      className="max-w-xs text-sm rounded-sm bg-background border-border mt-2"
                    />
                  )}
                </div>
              </div>
            </RadioGroup>

            <div className="pt-3 border-t border-border/60 space-y-2">
              <Label className="text-xs uppercase tracking-wider font-sans text-muted-foreground block">
                Rotation Angle
              </Label>
              <div className="grid grid-cols-3 gap-2 max-w-md">
                <button
                  type="button"
                  onClick={() => setRotateAngle(90)}
                  className={`py-2 px-3 text-xs uppercase tracking-wider font-medium rounded-sm border transition-colors ${
                    rotateAngle === 90
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-foreground border-border hover:bg-muted"
                  }`}
                >
                  90° Clockwise
                </button>
                <button
                  type="button"
                  onClick={() => setRotateAngle(180)}
                  className={`py-2 px-3 text-xs uppercase tracking-wider font-medium rounded-sm border transition-colors ${
                    rotateAngle === 180
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-foreground border-border hover:bg-muted"
                  }`}
                >
                  180° Inversion
                </button>
                <button
                  type="button"
                  onClick={() => setRotateAngle(270)}
                  className={`py-2 px-3 text-xs uppercase tracking-wider font-medium rounded-sm border transition-colors ${
                    rotateAngle === 270
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-foreground border-border hover:bg-muted"
                  }`}
                >
                  90° Counter-CW
                </button>
              </div>
            </div>
          </div>

          {/* Download and Success Area */}
          {isComplete && downloadUrl && (
            <div className="p-4 bg-muted/50 border border-foreground/20 rounded-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-serif font-medium text-foreground">
                  ✓ Rotation Applied ({lastRotatedAngle}° {rotateOption === "all" ? "all leaves" : `leaves ${pageRange}`})
                </div>
                <span className="text-[0.7rem] font-mono text-muted-foreground">Original source remains loaded</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={downloadRotatedPdf}
                  className="px-6 py-2 bg-foreground text-background text-xs uppercase tracking-wider font-semibold rounded-sm hover:opacity-90"
                >
                  Download Rotated PDF
                </Button>
                <span className="text-xs text-muted-foreground">
                  Select a different angle or page set above and rotate again.
                </span>
              </div>
            </div>
          )}

          <Button
            onClick={rotatePdf}
            disabled={isProcessing || (rotateOption === "specific" && !pageRange.trim())}
            className="w-full py-2.5 bg-foreground text-background text-xs uppercase tracking-wider font-semibold rounded-sm hover:opacity-90 transition-opacity"
          >
            {isProcessing ? "Rectifying Folios..." : isComplete ? "Rotate Again From Original Manuscript" : "Execute Rotation"}
          </Button>
        </div>
      )}
    </div>
  )
}
