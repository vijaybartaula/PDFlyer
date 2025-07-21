"use client"

import { useState, useEffect } from "react"
import { MoveUp, MoveDown, Trash2, FileOutput, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import PdfUploader from "./pdf-uploader"
import { mergePDFs, uint8ArrayToBlob, createDownloadURL, downloadFile } from "@/lib/pdf-utils"

export default function PdfMerger() {
  const [files, setFiles] = useState<File[]>([])
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

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles)
    setIsComplete(false)
    setError(null)

    // Clean up previous download URL if it exists
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl)
      setDownloadUrl(null)
    }
  }

  const moveFile = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === files.length - 1)) {
      return
    }

    const newFiles = [...files]
    const newIndex = direction === "up" ? index - 1 : index + 1
    const temp = newFiles[index]
    newFiles[index] = newFiles[newIndex]
    newFiles[newIndex] = temp
    setFiles(newFiles)
  }

  const removeFile = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  const mergePdfs = async () => {
    if (files.length < 2) {
      setError("You need at least 2 PDF files to merge.")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Perform the actual PDF merging
      const mergedPdfBytes = await mergePDFs(files)

      // Convert to blob and create download URL
      const pdfBlob = uint8ArrayToBlob(mergedPdfBytes)
      const url = createDownloadURL(pdfBlob)

      setDownloadUrl(url)
      setIsComplete(true)
    } catch (err) {
      console.error("Error merging PDFs:", err)
      setError(err instanceof Error ? err.message : "An error occurred while merging PDFs")
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadMergedPdf = () => {
    if (downloadUrl) {
      downloadFile(downloadUrl, "merged_document.pdf")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Merge PDFs</h2>
        <p className="text-muted-foreground">
          Combine multiple PDF files into a single document. Drag to reorder files as needed.
        </p>
      </div>

      <PdfUploader onFilesSelected={handleFilesSelected} multiple={true} maxFiles={20} />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">File Order</h3>
          <p className="text-sm text-muted-foreground">
            Drag files to reorder them. The PDFs will be merged in the order shown below.
          </p>

          <div className="space-y-2">
            {files.map((file, index) => (
              <Card key={index} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="bg-muted text-muted-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs">
                    {index + 1}
                  </span>
                  <span className="font-medium truncate">{file.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => moveFile(index, "up")}
                    disabled={index === 0}
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => moveFile(index, "down")}
                    disabled={index === files.length - 1}
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => removeFile(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {isComplete ? (
            <div className="mt-6">
              <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-900 mb-4">
                <AlertDescription className="text-green-800 dark:text-green-300 flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Your PDFs have been successfully merged!
                </AlertDescription>
              </Alert>

              <Button className="w-full" onClick={downloadMergedPdf} disabled={!downloadUrl}>
                <FileOutput className="mr-2 h-4 w-4" />
                Download Merged PDF
              </Button>
            </div>
          ) : (
            <Button className="w-full" onClick={mergePdfs} disabled={isProcessing || files.length < 2}>
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
                "Merge PDFs"
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
