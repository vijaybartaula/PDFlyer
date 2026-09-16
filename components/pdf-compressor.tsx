"use client"

import { useState, useEffect } from "react"
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
  const [lastCompressedLevel, setLastCompressedLevel] = useState<number>(70)
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

  const resetFile = () => {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl)
      setDownloadUrl(null)
    }
    setFile(null)
    setOriginalSize(0)
    setCompressedSize(0)
    setIsComplete(false)
    setError(null)
  }

  const compressPdf = async () => {
    if (!file) {
      setError("Please deposit a PDF manuscript first.")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Always compress starting from the pristine original file, never from a previously compressed output
      const compressedPdfBytes = await compressPDF(file, compressionLevel)
      const pdfBlob = uint8ArrayToBlob(compressedPdfBytes)

      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl)
      }
      const url = createDownloadURL(pdfBlob)

      setDownloadUrl(url)
      setCompressedSize(pdfBlob.size)
      setLastCompressedLevel(compressionLevel)
      setIsComplete(true)
    } catch (err) {
      console.error("Error compressing PDF:", err)
      setError(err instanceof Error ? err.message : "An error occurred while compressing the manuscript.")
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadCompressedPdf = () => {
    if (downloadUrl && file) {
      const sanitizedName = file.name.replace(/\.[^/.]+$/, "")
      downloadFile(downloadUrl, `${sanitizedName}_level${lastCompressedLevel}.pdf`)
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
    if (compressionLevel >= 80) return "Highest Fidelity (Light Refinement)"
    if (compressionLevel >= 60) return "Balanced Archival Compression"
    if (compressionLevel >= 40) return "Moderate Weight Reduction"
    if (compressionLevel >= 20) return "Aggressive Stream Compaction"
    return "Maximum Compaction"
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="editorial-tag text-muted-foreground mb-1">Instrument III · Weight Optimization</div>
        <h2 className="text-xl md:text-2xl font-serif font-medium text-foreground">Volume Compressor</h2>
        <p className="text-xs md:text-sm text-muted-foreground font-sans mt-1">
          Diminish manuscript file weight. The original uncompressed source remains loaded so you can test multiple compression levels iteratively.
        </p>
      </div>

      {!file && <PdfUploader onFilesSelected={handleFileSelected} multiple={false} />}

      {file && (
        <div className="p-4 bg-muted/40 border border-border rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-serif font-medium text-foreground">{file.name}</div>
            <div className="text-[0.7rem] text-muted-foreground font-mono">
              Original Weight: {formatFileSize(originalSize)} · Pristine source file preserved in state
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
          {/* Slider Controls — Always visible and active */}
          <div className="p-5 border border-border bg-card rounded-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-sans text-muted-foreground font-medium">
                Compression Profile
              </span>
              <span className="text-xs font-mono font-medium text-foreground">{compressionLevel}%</span>
            </div>

            <div className="space-y-2">
              <Slider
                value={[compressionLevel]}
                onValueChange={(val) => {
                  setCompressionLevel(val[0])
                }}
                min={10}
                max={100}
                step={10}
                disabled={isProcessing}
                className="py-2"
              />
              <div className="flex justify-between text-[0.7rem] text-muted-foreground font-sans">
                <span>Maximum Compaction (10%)</span>
                <span>Subtle Refinement (100%)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground font-sans">
              <span>Selected Profile:</span>
              <span className="font-medium text-foreground">{getCompressionQualityLabel()}</span>
            </div>
          </div>

          {/* Results Summary Box */}
          {isComplete && (
            <div className="p-4 bg-muted/50 border border-foreground/20 rounded-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-serif font-medium text-foreground">
                  ✓ Compression Complete (Target Level: {lastCompressedLevel}%)
                </div>
                <span className="text-[0.7rem] font-mono text-muted-foreground">Original source ready for re-run</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono py-1">
                <div className="p-2 border border-border bg-background rounded-sm">
                  <div className="text-[0.65rem] text-muted-foreground font-sans uppercase">Original</div>
                  <div className="font-semibold text-foreground">{formatFileSize(originalSize)}</div>
                </div>
                <div className="p-2 border border-border bg-background rounded-sm">
                  <div className="text-[0.65rem] text-muted-foreground font-sans uppercase">Result</div>
                  <div className="font-semibold text-foreground">{formatFileSize(compressedSize)}</div>
                </div>
                <div className="p-2 border border-border bg-background rounded-sm">
                  <div className="text-[0.65rem] text-muted-foreground font-sans uppercase">Reduction</div>
                  <div className="font-semibold text-foreground">
                    {originalSize > 0
                      ? `${Math.max(0, Math.round((1 - compressedSize / originalSize) * 100))}%`
                      : "0%"}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  onClick={downloadCompressedPdf}
                  className="px-6 py-2 bg-foreground text-background text-xs uppercase tracking-wider font-semibold rounded-sm hover:opacity-90"
                >
                  Download Compressed PDF
                </Button>
                <span className="text-xs text-muted-foreground">
                  Adjust slider above and click &ldquo;Recompress from Original&rdquo; to test another setting.
                </span>
              </div>
            </div>
          )}

          {/* Primary Action Button */}
          <Button
            onClick={compressPdf}
            disabled={isProcessing}
            className="w-full py-2.5 bg-foreground text-background text-xs uppercase tracking-wider font-semibold rounded-sm hover:opacity-90 transition-opacity"
          >
            {isProcessing
              ? "Compressing Volume..."
              : isComplete
              ? "Recompress from Original Source (New Setting)"
              : "Execute Volume Compression"}
          </Button>
        </div>
      )}
    </div>
  )
}
