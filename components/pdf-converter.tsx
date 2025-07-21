"use client"

import { useState, useEffect } from "react"
import { FileOutput, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import PdfUploader from "./pdf-uploader"
import { createDownloadURL, downloadFile } from "@/lib/pdf-utils"

// Note: Full PDF conversion to other formats would require server-side processing
// This is a simplified version that demonstrates the UI flow

export default function PdfConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [convertTo, setConvertTo] = useState<string>("docx")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
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
    } else {
      setFile(null)
    }
  }

  const convertPdf = async () => {
    if (!file) {
      setError("Please upload a PDF file first.")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // In a real implementation, this would use a PDF conversion library or API
      // For this demo, we'll simulate the process by just returning the original PDF
      // with a different extension

      // Read the file as an ArrayBuffer
      const fileBuffer = await file.arrayBuffer()

      // Create a Blob from the ArrayBuffer
      const blob = new Blob([fileBuffer], { type: getMimeType(convertTo) })

      // Create a download URL for the Blob
      const url = createDownloadURL(blob)

      setDownloadUrl(url)
      setIsComplete(true)
    } catch (err) {
      console.error("Error converting PDF:", err)
      setError(err instanceof Error ? err.message : "An error occurred while converting the PDF")
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadConvertedFile = () => {
    if (downloadUrl && file) {
      const filename = file.name.replace(".pdf", `.${convertTo}`)
      downloadFile(downloadUrl, filename)
    }
  }

  const getMimeType = (format: string): string => {
    switch (format) {
      case "docx":
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      case "xlsx":
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      case "pptx":
        return "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      case "jpg":
        return "image/jpeg"
      case "png":
        return "image/png"
      case "txt":
        return "text/plain"
      case "html":
        return "text/html"
      default:
        return "application/octet-stream"
    }
  }

  const getFileExtensionLabel = () => {
    switch (convertTo) {
      case "docx":
        return "Word Document (.docx)"
      case "xlsx":
        return "Excel Spreadsheet (.xlsx)"
      case "pptx":
        return "PowerPoint Presentation (.pptx)"
      case "jpg":
        return "JPEG Image (.jpg)"
      case "png":
        return "PNG Image (.png)"
      case "txt":
        return "Text File (.txt)"
      case "html":
        return "HTML File (.html)"
      default:
        return convertTo.toUpperCase()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Convert PDF</h2>
        <p className="text-muted-foreground">Transform your PDF into other file formats.</p>
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
            <h3 className="font-medium mb-2">Convert To</h3>
            <p className="text-sm text-muted-foreground mb-4">Select the format you want to convert your PDF to.</p>

            <RadioGroup
              value={convertTo}
              onValueChange={setConvertTo}
              className="grid grid-cols-1 md:grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="docx" id="docx" />
                <Label htmlFor="docx">Word Document (.docx)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="xlsx" id="xlsx" />
                <Label htmlFor="xlsx">Excel Spreadsheet (.xlsx)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pptx" id="pptx" />
                <Label htmlFor="pptx">PowerPoint (.pptx)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="jpg" id="jpg" />
                <Label htmlFor="jpg">JPEG Image (.jpg)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="png" id="png" />
                <Label htmlFor="png">PNG Image (.png)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="txt" id="txt" />
                <Label htmlFor="txt">Text File (.txt)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="html" id="html" />
                <Label htmlFor="html">HTML File (.html)</Label>
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
                  Your PDF has been successfully converted to {getFileExtensionLabel()}!
                </AlertDescription>
              </Alert>

              <Button className="w-full" onClick={downloadConvertedFile}>
                <FileOutput className="mr-2 h-4 w-4" />
                Download Converted File
              </Button>
            </div>
          ) : (
            <Button className="w-full" onClick={convertPdf} disabled={isProcessing}>
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
                "Convert PDF"
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
