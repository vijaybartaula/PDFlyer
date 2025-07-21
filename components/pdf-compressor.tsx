"use client"

import { useState, useEffect } from "react"
import { FileOutput, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import PdfUploader from "./pdf-uploader"
import { compressPDF, uint8ArrayToBlob, createDownloadURL, downloadFile } from "@/lib/pdf-utils"

export default function PdfCompressor() {
  const [file, setFile] = useState<File | null>(null)
  const [compressionLevel, setCompressionLevel] = useState<number>(70)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [originalSize, setOriginalSize] = useState<number>(0)
  const [compressedSize, setCompressedSize] = useState<number>(0)
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

  const handleFileSelected = (files: File[]) => {
    setError(null)
    setIsComplete(false)

    // Clean up previous download URL
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl)
      setDownloadUrl(null)
    }

    if (files.length > 0) {
      setFile(files[0])
      setOriginalSize(files[0].size)
    } else {
      setFile(null)
      setOriginalSize(0)
      setCompressedSize(0)
    }
  }

  const compressPdf = async () => {
    if (!file) {
      setError("Please upload a PDF file first.")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Perform the actual PDF compression
      const compressedPdfBytes = await compressPDF(file, compressionLevel)

      // Convert to blob and create download URL
      const pdfBlob = uint8ArrayToBlob(compressedPdfBytes)
      const url = createDownloadURL(pdfBlob)

      setDownloadUrl(url)
      setCompressedSize(pdfBlob.size)
      setIsComplete(true)
    } catch (err) {
      console.error("Error compressing PDF:", err)
      setError(err instanceof Error ? err.message : "An error occurred while compressing the PDF")
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadCompressedPdf = () => {
    if (downloadUrl && file) {
      const filename = file.name.replace(".pdf", "_compressed.pdf")
      downloadFile(downloadUrl, filename)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getCompressionQualityLabel = () => {
    if (compressionLevel >= 90) return "Highest Quality (Minimal Compression)"
    if (compressionLevel >= 70) return "High Quality"
    if (compressionLevel >= 40) return "Medium Quality"
    if (compressionLevel >= 20) return "Low Quality"
    return "Lowest Quality (Maximum Compression)"
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Compress PDF</h2>
        <p className="text-muted-foreground">Reduce the file size of your PDF while maintaining quality.</p>
      </div>

      <PdfUploader onFilesSelected={handleFileSelected} multiple={false} />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {file && (
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Compression Level</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Adjust the slider to set your preferred balance between file size and quality.
            </p>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Maximum Compression</span>
                  <span className="text-sm">Highest Quality</span>
                </div>
                <Slider
                  value={[compressionLevel]}
                  onValueChange={(value) => setCompressionLevel(value[0])}
                  min={10}
                  max={100}
                  step={10}
                  disabled={isProcessing}
                />
              </div>

              <div className="bg-muted p-4 rounded-md">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Quality Setting:</span>
                  <span>{getCompressionQualityLabel()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Original Size:</span>
                  <span>{formatFileSize(originalSize)}</span>
                </div>
                {isComplete && (
                  <>
                    <div className="flex justify-between">
                      <span className="font-medium">Compressed Size:</span>
                      <span>{formatFileSize(compressedSize)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Reduction:</span>
                      <span>{Math.round((1 - compressedSize / originalSize) * 100)}%</span>
                    </div>
                  </>
                )}
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
                  Your PDF has been successfully compressed!
                </AlertDescription>
              </Alert>

              <Button className="w-full" onClick={downloadCompressedPdf}>
                <FileOutput className="mr-2 h-4 w-4" />
                Download Compressed PDF
              </Button>
            </div>
          ) : (
            <Button className="w-full" onClick={compressPdf} disabled={isProcessing}>
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
                "Compress PDF"
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
