"use client"

import { useState, useEffect } from "react"
import { FileOutput, RotateCw, RotateCcw, AlertCircle } from "lucide-react"
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

    // Clean up previous download URL
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl)
      setDownloadUrl(null)
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

  const rotatePdf = async () => {
    if (!file) {
      setError("Please upload a PDF file first.")
      return
    }

    if (rotateOption === "specific" && !pageRange.trim()) {
      setError("Please enter page numbers to rotate.")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      let rotatedPdfBytes: Uint8Array

      if (rotateOption === "all") {
        // Rotate all pages
        rotatedPdfBytes = await rotatePDF(file, rotateAngle, "all")
      } else {
        // Rotate specific pages
        const pageNumbers = parsePageRanges(pageRange, totalPages)

        if (pageNumbers.length === 0) {
          setError("Please enter valid page numbers.")
          setIsProcessing(false)
          return
        }

        rotatedPdfBytes = await rotatePDF(file, rotateAngle, pageNumbers)
      }

      // Convert to blob and create download URL
      const pdfBlob = uint8ArrayToBlob(rotatedPdfBytes)
      const url = createDownloadURL(pdfBlob)

      setDownloadUrl(url)
      setIsComplete(true)
    } catch (err) {
      console.error("Error rotating PDF:", err)
      setError(err instanceof Error ? err.message : "An error occurred while rotating the PDF")
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadRotatedPdf = () => {
    if (downloadUrl && file) {
      const filename = file.name.replace(".pdf", "_rotated.pdf")
      downloadFile(downloadUrl, filename)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Rotate PDF</h2>
        <p className="text-muted-foreground">Adjust the orientation of pages in your PDF document.</p>
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
            <h3 className="font-medium mb-2">Rotation Options</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your PDF has {totalPages} pages. Choose how you want to rotate it.
            </p>

            <div className="space-y-4">
              <RadioGroup value={rotateOption} onValueChange={(value: "all" | "specific") => setRotateOption(value)}>
                <div className="flex items-start space-x-2 mb-4">
                  <RadioGroupItem value="all" id="rotate-all" />
                  <div>
                    <Label htmlFor="rotate-all" className="font-medium">
                      Rotate all pages
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Apply the same rotation to all pages in the document
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="specific" id="rotate-specific" />
                  <div className="flex-1">
                    <Label htmlFor="rotate-specific" className="font-medium">
                      Rotate specific pages
                    </Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Apply rotation only to selected pages (e.g., 1-3, 5, 7-9)
                    </p>
                    <Input
                      type="text"
                      placeholder="e.g., 1-3, 5, 7-9"
                      value={pageRange}
                      onChange={(e) => setPageRange(e.target.value)}
                      disabled={rotateOption !== "specific"}
                      className="max-w-xs"
                    />
                  </div>
                </div>
              </RadioGroup>

              <div>
                <Label className="mb-2 block">Rotation Angle</Label>
                <div className="flex gap-2">
                  <Button
                    variant={rotateAngle === 90 ? "default" : "outline"}
                    onClick={() => setRotateAngle(90)}
                    className="flex-1"
                  >
                    <RotateCw className="mr-2 h-4 w-4" />
                    90° Clockwise
                  </Button>
                  <Button
                    variant={rotateAngle === 180 ? "default" : "outline"}
                    onClick={() => setRotateAngle(180)}
                    className="flex-1"
                  >
                    <RotateCw className="mr-2 h-4 w-4" />
                    180°
                  </Button>
                  <Button
                    variant={rotateAngle === 270 ? "default" : "outline"}
                    onClick={() => setRotateAngle(270)}
                    className="flex-1"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    90° Counter-clockwise
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {isComplete ? (
            <div className="mt-6">
              <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-900 mb-4">
                <AlertDescription className="text-green-800 dark:text-green-300 flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Your PDF has been successfully rotated!
                </AlertDescription>
              </Alert>

              <Button className="w-full" onClick={downloadRotatedPdf}>
                <FileOutput className="mr-2 h-4 w-4" />
                Download Rotated PDF
              </Button>
            </div>
          ) : (
            <Button
              className="w-full"
              onClick={rotatePdf}
              disabled={isProcessing || (rotateOption === "specific" && !pageRange)}
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
                "Rotate PDF"
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
