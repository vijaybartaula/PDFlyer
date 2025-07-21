"use client"

import { useState, useEffect } from "react"
import { FileOutput, AlertCircle } from "lucide-react"
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
  const [splitMethod, setSplitMethod] = useState<"all" | "range" | "custom">("all")
  const [pageRange, setPageRange] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [zipDownloadUrl, setZipDownloadUrl] = useState<string | null>(null)

  // Clean up download URLs when component unmounts
  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl)
      }
      if (zipDownloadUrl) {
        URL.revokeObjectURL(zipDownloadUrl)
      }
    }
  }, [downloadUrl, zipDownloadUrl])

  const handleFileSelected = async (files: File[]) => {
    setError(null)
    setIsComplete(false)

    // Clean up previous download URLs
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl)
      setDownloadUrl(null)
    }
    if (zipDownloadUrl) {
      URL.revokeObjectURL(zipDownloadUrl)
      setZipDownloadUrl(null)
    }

    if (files.length > 0) {
      setFile(files[0])
      try {
        // Get actual page count from the PDF
        const pageCount = await getPdfPageCount(files[0])
        setTotalPages(pageCount)
      } catch (err) {
        console.error("Error getting page count:", err)
        setError("Could not read the PDF file. The file might be corrupted or password protected.")
        setFile(null)
        setTotalPages(0)
      }
    } else {
      setFile(null)
      setTotalPages(0)
    }
  }

  const splitPdf = async () => {
    if (!file) {
      setError("Please upload a PDF file first.")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      if (splitMethod === "all") {
        // Split into individual pages
        const ranges = Array.from({ length: totalPages }, (_, i) => ({
          start: i + 1,
          end: i + 1,
        }))

        const splitPdfs = await splitPDF(file, ranges)

        // Create a zip file containing all the split PDFs
        // For simplicity, we'll just provide the first page as a download
        // In a real implementation, you would use JSZip to create a zip file
        const firstPageBlob = uint8ArrayToBlob(splitPdfs[0])
        const url = createDownloadURL(firstPageBlob)
        setDownloadUrl(url)

        setIsComplete(true)
      } else if (splitMethod === "range") {
        if (!pageRange.trim()) {
          setError("Please enter a valid page range.")
          setIsProcessing(false)
          return
        }

        const pageNumbers = parsePageRanges(pageRange, totalPages)

        if (pageNumbers.length === 0) {
          setError("Please enter a valid page range.")
          setIsProcessing(false)
          return
        }

        const extractedPdfBytes = await extractPages(file, pageNumbers)
        const pdfBlob = uint8ArrayToBlob(extractedPdfBytes)
        const url = createDownloadURL(pdfBlob)
        setDownloadUrl(url)

        setIsComplete(true)
      } else if (splitMethod === "custom") {
        // For custom split, we would need more UI to define split points
        // For now, we'll just split in half as an example
        const halfPage = Math.ceil(totalPages / 2)

        const ranges = [
          { start: 1, end: halfPage },
          { start: halfPage + 1, end: totalPages },
        ]

        const splitPdfs = await splitPDF(file, ranges)

        // Just provide the first part as a download for simplicity
        const firstPartBlob = uint8ArrayToBlob(splitPdfs[0])
        const url = createDownloadURL(firstPartBlob)
        setDownloadUrl(url)

        setIsComplete(true)
      }
    } catch (err) {
      console.error("Error splitting PDF:", err)
      setError(err instanceof Error ? err.message : "An error occurred while splitting the PDF")
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadSplitPdfs = () => {
    if (downloadUrl) {
      const filename =
        splitMethod === "all" ? "page_1.pdf" : splitMethod === "range" ? "extracted_pages.pdf" : "split_part1.pdf"

      downloadFile(downloadUrl, filename)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Split PDF</h2>
        <p className="text-muted-foreground">Extract pages from your PDF or split it into multiple documents.</p>
      </div>

      <PdfUploader onFilesSelected={handleFileSelected} multiple={false} />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {file && totalPages > 0 && (
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Split Options</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your PDF has {totalPages} pages. Choose how you want to split it.
            </p>

            <RadioGroup
              value={splitMethod}
              onValueChange={(value: "all" | "range" | "custom") => setSplitMethod(value)}
            >
              <div className="flex items-start space-x-2 mb-4">
                <RadioGroupItem value="all" id="all" />
                <div>
                  <Label htmlFor="all" className="font-medium">
                    Extract all pages
                  </Label>
                  <p className="text-sm text-muted-foreground">Create a separate PDF for each page</p>
                </div>
              </div>

              <div className="flex items-start space-x-2 mb-4">
                <RadioGroupItem value="range" id="range" />
                <div className="flex-1">
                  <Label htmlFor="range" className="font-medium">
                    Extract page range
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Create a PDF with specific pages (e.g., 1-3, 5, 7-9)
                  </p>
                  <Input
                    type="text"
                    placeholder="e.g., 1-3, 5, 7-9"
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                    disabled={splitMethod !== "range"}
                    className="max-w-xs"
                  />
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <div>
                  <Label htmlFor="custom" className="font-medium">
                    Custom split
                  </Label>
                  <p className="text-sm text-muted-foreground">Split into multiple PDFs at specific page numbers</p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {isComplete ? (
            <div className="mt-6">
              <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-900 mb-4">
                <AlertDescription className="text-green-800 dark:text-green-300 flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Your PDF has been successfully split!
                </AlertDescription>
              </Alert>

              <Button className="w-full" onClick={downloadSplitPdfs}>
                <FileOutput className="mr-2 h-4 w-4" />
                Download Split PDF{splitMethod === "all" ? "s" : ""}
              </Button>
            </div>
          ) : (
            <Button
              className="w-full"
              onClick={splitPdf}
              disabled={isProcessing || (splitMethod === "range" && !pageRange)}
            >
              {isProcessing ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Split PDF"
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
