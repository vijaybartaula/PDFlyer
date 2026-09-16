"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import PdfUploader from "./pdf-uploader"
import { mergePDFs, uint8ArrayToBlob, createDownloadURL, downloadFile } from "@/lib/pdf-utils"

export default function PdfMerger() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

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

  const resetAll = () => {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl)
      setDownloadUrl(null)
    }
    setFiles([])
    setIsComplete(false)
    setError(null)
  }

  const mergePdfs = async () => {
    if (files.length < 2) {
      setError("Please select at least two PDF manuscripts to assemble together.")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const mergedPdfBytes = await mergePDFs(files)
      const pdfBlob = uint8ArrayToBlob(mergedPdfBytes)
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl)
      }
      const url = createDownloadURL(pdfBlob)

      setDownloadUrl(url)
      setIsComplete(true)
    } catch (err) {
      console.error("Error merging PDFs:", err)
      setError(err instanceof Error ? err.message : "An error occurred while assembling the manuscripts.")
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadMergedPdf = () => {
    if (downloadUrl) {
      downloadFile(downloadUrl, "assembled_manuscript.pdf")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="editorial-tag text-muted-foreground mb-1">Instrument I · Document Collation</div>
        <h2 className="text-xl md:text-2xl font-serif font-medium text-foreground">Document Assembler (Merge)</h2>
        <p className="text-xs md:text-sm text-muted-foreground font-sans mt-1">
          Unite separate manuscripts and folios in sequence. Reorder leaves using the controls below; files remain persistent in state.
        </p>
      </div>

      <PdfUploader onFilesSelected={handleFilesSelected} multiple={true} maxFiles={20} />

      {error && (
        <Alert variant="destructive" className="rounded-sm">
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      {files.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-serif font-medium text-foreground">
                Collation Order ({files.length} Manuscripts)
              </h3>
              <p className="text-xs text-muted-foreground font-sans">
                Documents will be bound into the final volume in the exact order shown below.
              </p>
            </div>
            <button
              type="button"
              onClick={resetAll}
              className="text-xs font-sans uppercase tracking-wider py-1 px-2.5 border border-border bg-background hover:bg-muted rounded-sm transition-colors text-foreground"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-border bg-card rounded-sm"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="w-5 h-5 rounded-sm bg-foreground text-background text-[0.65rem] font-serif font-bold flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>
                  <div className="truncate">
                    <div className="text-xs font-serif font-medium text-foreground truncate">{file.name}</div>
                    <div className="text-[0.65rem] text-muted-foreground font-mono">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveFile(index, "up")}
                    disabled={index === 0}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 rounded-sm border border-transparent hover:border-border"
                    title="Move up in sequence"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveFile(index, "down")}
                    disabled={index === files.length - 1}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 rounded-sm border border-transparent hover:border-border"
                    title="Move down in sequence"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="p-1 text-muted-foreground hover:text-destructive rounded-sm border border-transparent hover:border-border ml-1"
                    title="Remove from volume"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Download Box */}
          {isComplete && downloadUrl && (
            <div className="p-4 bg-muted/50 border border-foreground/20 rounded-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-serif font-medium text-foreground">
                  ✓ Assembly Complete: {files.length} documents bound together
                </div>
                <span className="text-[0.7rem] font-mono text-muted-foreground">Original files remain active</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={downloadMergedPdf}
                  className="px-6 py-2 bg-foreground text-background text-xs uppercase tracking-wider font-semibold rounded-sm hover:opacity-90"
                >
                  Download Assembled PDF
                </Button>
                <span className="text-xs text-muted-foreground">
                  Reorder leaves above and click &ldquo;Assemble Folios Again&rdquo; to re-merge.
                </span>
              </div>
            </div>
          )}

          <Button
            onClick={mergePdfs}
            disabled={isProcessing || files.length < 2}
            className="w-full py-2.5 bg-foreground text-background text-xs uppercase tracking-wider font-semibold rounded-sm hover:opacity-90 transition-opacity"
          >
            {isProcessing
              ? "Assembling Folios..."
              : isComplete
              ? "Assemble Folios Again"
              : `Assemble ${files.length} Manuscripts Into One PDF`}
          </Button>
        </div>
      )}
    </div>
  )
}
