"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PdfUploader from "./pdf-uploader"
import { addTextWatermark, addImageWatermark, uint8ArrayToBlob, createDownloadURL, downloadFile } from "@/lib/pdf-utils"

export default function PdfWatermark() {
  const [file, setFile] = useState<File | null>(null)
  const [watermarkType, setWatermarkType] = useState<"text" | "image">("text")
  const [watermarkText, setWatermarkText] = useState<string>("CONFIDENTIAL")
  const [watermarkImage, setWatermarkImage] = useState<File | null>(null)
  const [opacity, setOpacity] = useState<number>(30)
  const [position, setPosition] = useState<string>("center")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [lastWatermarkDesc, setLastWatermarkDesc] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  const imageInputRef = useRef<HTMLInputElement>(null)

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const img = e.target.files[0]
      if (!img.type.startsWith("image/")) {
        setError("Please select a valid image file (PNG or JPEG).")
        return
      }
      setWatermarkImage(img)
      setError(null)
    }
  }

  const applyWatermark = async () => {
    if (!file) {
      setError("Please deposit a PDF manuscript first.")
      return
    }

    if (watermarkType === "text" && !watermarkText.trim()) {
      setError("Please specify watermark text.")
      return
    }

    if (watermarkType === "image" && !watermarkImage) {
      setError("Please upload a watermark seal or image (PNG or JPG).")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      let watermarkedBytes: Uint8Array
      const pos = position as "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "tile"

      if (watermarkType === "text") {
        watermarkedBytes = await addTextWatermark(file, watermarkText, opacity, pos)
        setLastWatermarkDesc(`Text: "${watermarkText}" (${opacity}%, position: ${position})`)
      } else {
        watermarkedBytes = await addImageWatermark(file, watermarkImage!, opacity, pos)
        setLastWatermarkDesc(`Image seal: ${watermarkImage!.name} (${opacity}%, position: ${position})`)
      }

      const pdfBlob = uint8ArrayToBlob(watermarkedBytes)
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl)
      }
      const url = createDownloadURL(pdfBlob)

      setDownloadUrl(url)
      setIsComplete(true)
    } catch (err) {
      console.error("Error applying watermark:", err)
      setError(err instanceof Error ? err.message : "An error occurred while stamping the watermark onto the PDF.")
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadWatermarkedPdf = () => {
    if (downloadUrl && file) {
      const sanitizedName = file.name.replace(/\.[^/.]+$/, "")
      downloadFile(downloadUrl, `${sanitizedName}_sealed.pdf`)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="editorial-tag text-muted-foreground mb-1">Instrument V · Provenance & Stamp</div>
        <h2 className="text-xl md:text-2xl font-serif font-medium text-foreground">Attribution & Seal (Watermark)</h2>
        <p className="text-xs md:text-sm text-muted-foreground font-sans mt-1">
          Inscribe publisher marks, security watermarks, or emblems across your manuscript. Both text and image stamps are supported with full opacity and positioning control.
        </p>
      </div>

      {!file && <PdfUploader onFilesSelected={handleFileSelected} multiple={false} />}

      {file && (
        <div className="p-4 bg-muted/40 border border-border rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-serif font-medium text-foreground">{file.name}</div>
            <div className="text-[0.7rem] text-muted-foreground font-mono">
              Source: {(file.size / 1024 / 1024).toFixed(2)} MB · Ready for repeated watermark application
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
          {/* Watermark Type Selection */}
          <div className="space-y-4 p-5 border border-border bg-card rounded-sm">
            <div>
              <Label className="text-xs uppercase tracking-wider font-sans text-muted-foreground mb-2 block font-medium">
                Seal Category
              </Label>
              <RadioGroup
                value={watermarkType}
                onValueChange={(val: "text" | "image") => {
                  setWatermarkType(val)
                  setError(null)
                }}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="text" id="watermark-type-text" />
                  <Label htmlFor="watermark-type-text" className="font-serif text-sm cursor-pointer">
                    Text Inscription
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="image" id="watermark-type-image" />
                  <Label htmlFor="watermark-type-image" className="font-serif text-sm cursor-pointer">
                    Image Emblem / Seal (PNG, JPG)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Text Input */}
            {watermarkType === "text" && (
              <div className="space-y-1.5 pt-2">
                <Label htmlFor="watermark-text" className="text-xs uppercase tracking-wider font-sans text-muted-foreground">
                  Watermark Inscription
                </Label>
                <Input
                  id="watermark-text"
                  value={watermarkText}
                  onChange={(e) => {
                    setWatermarkText(e.target.value)
                    setError(null)
                  }}
                  placeholder="e.g. CONFIDENTIAL or ARCHIVAL COPY"
                  className="max-w-md text-sm rounded-sm bg-background border-border"
                />
              </div>
            )}

            {/* Image Input */}
            {watermarkType === "image" && (
              <div className="space-y-2 pt-2">
                <Label className="text-xs uppercase tracking-wider font-sans text-muted-foreground block">
                  Select Seal Image
                </Label>
                <input
                  type="file"
                  ref={imageInputRef}
                  onChange={handleImageChange}
                  accept="image/png,image/jpeg,image/jpg"
                  className="hidden"
                />
                <div
                  onClick={() => imageInputRef.current?.click()}
                  className="border border-dashed border-border hover:border-foreground/40 p-4 rounded-sm cursor-pointer bg-background max-w-md text-center transition-colors"
                >
                  {watermarkImage ? (
                    <div className="text-xs font-serif font-medium text-foreground">
                      Selected Seal: <span className="font-mono">{watermarkImage.name}</span> (Click to change)
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground font-sans">
                      Click to choose an image emblem (PNG with transparency recommended, or JPG)
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Opacity Slider */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="text-muted-foreground uppercase tracking-wider">Watermark Opacity</span>
                <span className="font-mono text-foreground font-medium">{opacity}%</span>
              </div>
              <Slider
                value={[opacity]}
                onValueChange={(val) => setOpacity(val[0])}
                min={5}
                max={100}
                step={5}
                disabled={isProcessing}
                className="max-w-md"
              />
              <div className="flex justify-between text-[0.7rem] text-muted-foreground font-sans max-w-md">
                <span>Subtle (5%)</span>
                <span>Prominent (100%)</span>
              </div>
            </div>

            {/* Position Select */}
            <div className="space-y-1.5 pt-2">
              <Label htmlFor="position-select" className="text-xs uppercase tracking-wider font-sans text-muted-foreground block">
                Folio Placement
              </Label>
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger id="position-select" className="max-w-md text-sm rounded-sm bg-background border-border">
                  <SelectValue placeholder="Choose placement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="center">Center (Rotated 45°)</SelectItem>
                  <SelectItem value="top-left">Top Left Margin</SelectItem>
                  <SelectItem value="top-right">Top Right Margin</SelectItem>
                  <SelectItem value="bottom-left">Bottom Left Margin</SelectItem>
                  <SelectItem value="bottom-right">Bottom Right Margin</SelectItem>
                  <SelectItem value="tile">Repeated Grid (Tile)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Download & Success Box */}
          {isComplete && downloadUrl && (
            <div className="p-4 bg-muted/50 border border-foreground/20 rounded-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-serif font-medium text-foreground">
                  ✓ Watermark Applied: {lastWatermarkDesc}
                </div>
                <span className="text-[0.7rem] font-mono text-muted-foreground">Original manuscript remains in memory</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={downloadWatermarkedPdf}
                  className="px-6 py-2 bg-foreground text-background text-xs uppercase tracking-wider font-semibold rounded-sm hover:opacity-90"
                >
                  Download Sealed PDF
                </Button>
                <span className="text-xs text-muted-foreground">
                  Adjust text, emblem, position, or opacity above and click &ldquo;Apply Watermark Again&rdquo;.
                </span>
              </div>
            </div>
          )}

          {/* Primary Action Button */}
          <Button
            onClick={applyWatermark}
            disabled={isProcessing || (watermarkType === "text" && !watermarkText.trim()) || (watermarkType === "image" && !watermarkImage)}
            className="w-full py-2.5 bg-foreground text-background text-xs uppercase tracking-wider font-semibold rounded-sm hover:opacity-90 transition-opacity"
          >
            {isProcessing
              ? "Inscribing Watermark..."
              : isComplete
              ? "Apply Watermark Again From Same Source"
              : "Inscribe Watermark onto Folios"}
          </Button>
        </div>
      )}
    </div>
  )
}
