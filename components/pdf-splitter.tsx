"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import PdfUploader from "./pdf-uploader"
import {
  splitPDF,
  extractPages,
  parsePageRanges,
  getPdfPageCount,
  uint8ArrayToBlob,
  createDownloadURL,
  downloadFile,
} from "@/lib/pdf-utils"

export default function PdfSplitter() {
  const [file, setFile] = useState<File | null>(null)
  const [splitMethod, setSplitMethod] = useState<"all" | "range" | "custom">("range")
  const [pageRange, setPageRange] = useState<string>("1-2")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [completedSummary, setCompletedSummary] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  // Clean up download URLs when component unmounts
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
      const selected = files[0]
      setFile(selected)
      try {
        const pageCount = await getPdfPageCount(selected)
        setTotalPages(pageCount)
        // Default reasonable range
        if (pageCount > 1) {
          setPageRange(`1-${Math.min(pageCount, 2)}`)
        } else {
          setPageRange("1")
        }
      } catch (err) {
        console.error("Error reading PDF:", err)
        setError("Could not parse the PDF manuscript. Please verify it is not password-protected.")
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

  const splitPdf = async () => {
    if (!file) {
      setError("Please deposit a PDF manuscript first.")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      if (splitMethod === "range") {
        if (!pageRange.trim()) {
          throw new Error("Please specify a page range (e.g. 2-7 or 8-11).")
        }

        const pageNumbers = parsePageRanges(pageRange, totalPages)
        if (pageNumbers.length === 0) {
          throw new Error(`The specified range '${pageRange}' contains no pages within the 1–${totalPages} boundary.`)
        }

        const extractedBytes = await extractPages(file, pageNumbers)
        const pdfBlob = uint8ArrayToBlob(extractedBytes)

        if (downloadUrl) {
          URL.revokeObjectURL(downloadUrl)
        }
        const url = createDownloadURL(pdfBlob)
        setDownloadUrl(url)
        setCompletedSummary(`Pages ${pageNumbers.join(", ")} extracted (${pageNumbers.length} pages)`)
        setIsComplete(true)
      } else if (splitMethod === "all") {
        const ranges = Array.from({ length: totalPages }, (_, i) => ({
          start: i + 1,
          end: i + 1,
        }))
        const splitPdfs = await splitPDF(file, ranges)
        const firstPageBlob = uint8ArrayToBlob(splitPdfs[0])

        if (downloadUrl) {
          URL.revokeObjectURL(downloadUrl)
        }
        const url = createDownloadURL(firstPageBlob)
        setDownloadUrl(url)
        setCompletedSummary(`All ${totalPages} pages separated (Page 1 compiled for download)`)
        setIsComplete(true)
      } else if (splitMethod === "custom") {
        const half = Math.ceil(totalPages / 2)
        const ranges = [
          { start: 1, end: half },
          { start: half + 1, end: totalPages },
        ]
        const splitPdfs = await splitPDF(file, ranges)
        const firstPartBlob = uint8ArrayToBlob(splitPdfs[0])

        if (downloadUrl) {
          URL.revokeObjectURL(downloadUrl)
        }
        const url = createDownloadURL(firstPartBlob)
        setDownloadUrl(url)
        setCompletedSummary(`Partitioned at leaf ${half} (Gathering 1: pages 1–${half})`)
        setIsComplete(true)
      }
    } catch (err) {
      console.error("Error splitting PDF:", err)
      setError(err instanceof Error ? err.message : "An error occurred during folio partitioning.")
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadSplitResult = () => {
    if (downloadUrl && file) {
      const sanitizedName = file.name.replace(/\.[^/.]+$/, "")
      const rangeTag = splitMethod === "range" ? `_pages_${pageRange.replace(/[\s,]+/g, "_")}` : "_split"
      downloadFile(downloadUrl, `${sanitizedName}${rangeTag}.pdf`)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="editorial-tag text-muted-foreground mb-1">Instrument II · Folio Extraction</div>
        <h2 className="text-xl md:text-2xl font-serif font-medium text-foreground">Folio Partition (Split)</h2>
        <p className="text-xs md:text-sm text-muted-foreground font-sans mt-1">
          Extract specific gatherings, pages, or chapters. The source manuscript remains active in memory for repeated extractions.
        </p>
      </div>

      {!file && <PdfUploader onFilesSelected={handleFileSelected} multiple={false} />}

      {file && (
        <div className="p-4 bg-muted/40 border border-border rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-serif font-medium text-foreground">{file.name}</div>
            <div className="text-[0.7rem] text-muted-foreground font-mono">
              Total Leaves: {totalPages} pages · {(file.size / 1024 / 1024).toFixed(2)} MB · Ready for repeated operations
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
          <div className="space-y-4">
            <h3 className="text-sm font-serif font-medium text-foreground">Partition Methodology</h3>

            <RadioGroup
              value={splitMethod}
              onValueChange={(val: "all" | "range" | "custom") => {
                setSplitMethod(val)
                setError(null)
              }}
              className="space-y-3"
            >
              <div className="flex items-start space-x-3 p-3 border border-border bg-card rounded-sm">
                <RadioGroupItem value="range" id="split-range" className="mt-1" />
                <div className="flex-1 space-y-2">
                  <Label htmlFor="split-range" className="font-serif text-sm font-medium cursor-pointer">
                    Extract Specific Leaf Range (Recommended)
                  </Label>
                  <p className="text-xs text-muted-foreground font-sans">
                    Specify exact pages to assemble into a new document (e.g. &ldquo;2-7&rdquo; or &ldquo;8-11&rdquo; or &ldquo;1, 3, 5-8&rdquo;).
                  </p>
                  {splitMethod === "range" && (
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <Input
                        type="text"
                        placeholder={`e.g. 2-7 (Max: ${totalPages})`}
                        value={pageRange}
                        onChange={(e) => {
                          setPageRange(e.target.value)
                          setError(null)
                        }}
                        className="max-w-xs text-sm rounded-sm bg-background border-border"
                      />
                      <span className="text-[0.7rem] text-muted-foreground font-mono">
                        Valid leaves: 1 to {totalPages}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 border border-border bg-card rounded-sm">
                <RadioGroupItem value="all" id="split-all" className="mt-1" />
                <div>
                  <Label htmlFor="split-all" className="font-serif text-sm font-medium cursor-pointer">
                    Individual Leaf Extraction (All Pages)
                  </Label>
                  <p className="text-xs text-muted-foreground font-sans">
                    Partition each leaf of the manuscript into its own separate folio.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 border border-border bg-card rounded-sm">
                <RadioGroupItem value="custom" id="split-custom" className="mt-1" />
                <div>
                  <Label htmlFor="split-custom" className="font-serif text-sm font-medium cursor-pointer">
                    Halve Volume at Midpoint
                  </Label>
                  <p className="text-xs text-muted-foreground font-sans">
                    Divide the manuscript into two equal halves (Pages 1–{Math.ceil(totalPages / 2)} and {Math.ceil(totalPages / 2) + 1}–{totalPages}).
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Action and Download Area */}
          <div className="pt-2 space-y-4">
            {isComplete && downloadUrl && (
              <div className="p-4 bg-muted/50 border border-foreground/20 rounded-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-serif font-medium text-foreground">
                    ✓ Partition Complete: {completedSummary}
                  </div>
                  <span className="text-[0.7rem] font-mono text-muted-foreground">Original file remains loaded</span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    onClick={downloadSplitResult}
                    className="px-6 py-2 bg-foreground text-background text-xs uppercase tracking-wider font-semibold rounded-sm hover:opacity-90"
                  >
                    Download Partitioned PDF
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Or adjust page range above and click &ldquo;Execute Partition&rdquo; again.
                  </span>
                </div>
              </div>
            )}

            <Button
              onClick={splitPdf}
              disabled={isProcessing || (splitMethod === "range" && !pageRange.trim())}
              className="w-full py-2.5 bg-foreground text-background text-xs uppercase tracking-wider font-semibold rounded-sm hover:opacity-90 transition-opacity"
            >
              {isProcessing ? "Partitioning Folios..." : isComplete ? "Execute New Partition From Same PDF" : "Execute Folio Partition"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
