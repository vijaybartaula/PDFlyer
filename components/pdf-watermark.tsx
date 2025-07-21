"use client"

import { useState, useEffect } from "react"
import { FileOutput, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PdfUploader from "./pdf-uploader"
import { addTextWatermark, uint8ArrayToBlob, createDownloadURL, downloadFile } from "@/lib/pdf-utils"

export default function PdfWatermark() {
  const [file, setFile] = useState<File | null>(null)
  const [watermarkType, setWatermarkType] = useState<"text" | "image">("text")
  const [watermarkText, setWatermarkText] = useState<string>("CONFIDENTIAL")
  const [opacity, setOpacity] = useState<number>(30)
  const [position, setPosition] = useState<string>("center")
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

  const addWatermark = async () => {
    if (!file) {
      setError("Please upload a PDF file first.")
      return
    }

    if (watermarkType === "text" && !watermarkText.trim()) {
      setError("Please enter watermark text.")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // For now, we only support text watermarks
      if (watermarkType === "text") {
        // Perform the actual watermarking
        const watermarkedPdfBytes = await addTextWatermark(
          file,
          watermarkText,
          opacity,
          position as "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "tile",
        )

        // Convert to blob and create download URL
        const pdfBlob = uint8ArrayToBlob(watermarkedPdfBytes)
        const url = createDownloadURL(pdfBlob)

        setDownloadUrl(url)
        setIsComplete(true)
      } else {
        // Image watermark is not implemented yet
        setError("Image watermarking is not implemented yet.")
      }
    } catch (err) {
      console.error("Error adding watermark:", err)
      setError(err instanceof Error ? err.message : "An error occurred while adding the watermark")
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadWatermarkedPdf = () => {
    if (downloadUrl && file) {
      const filename = file.name.replace(".pdf", "_watermarked.pdf")
      downloadFile(downloadUrl, filename)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Add Watermark</h2>
        <p className="text-muted-foreground">Add text or image watermarks to your PDF document.</p>
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
            <h3 className="font-medium mb-2">Watermark Options</h3>

            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Watermark Type</Label>
                <RadioGroup
                  value={watermarkType}
                  onValueChange={(value: "text" | "image") => setWatermarkType(value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="text" id="text" />
                    <Label htmlFor="text">Text</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="image" id="image" />
                    <Label htmlFor="image">Image</Label>
                  </div>
                </RadioGroup>
              </div>

              {watermarkType === "text" && (
                <div>
                  <Label htmlFor="watermark-text" className="mb-2 block">
                    Watermark Text
                  </Label>
                  <Input
                    id="watermark-text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder="Enter watermark text"
                    className="max-w-xs"
                  />
                </div>
              )}

              {watermarkType === "image" && (
                <div>
                  <Label className="mb-2 block">Upload Watermark Image</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer max-w-xs">
                    <p className="text-sm text-muted-foreground">Click to upload an image (PNG or JPG)</p>
                  </div>
                </div>
              )}

              <div>
                <Label className="mb-2 block">Opacity: {opacity}%</Label>
                <Slider
                  value={[opacity]}
                  onValueChange={(value) => setOpacity(value[0])}
                  min={10}
                  max={100}
                  step={5}
                  className="max-w-xs"
                />
              </div>

              <div>
                <Label htmlFor="position" className="mb-2 block">
                  Position
                </Label>
                <Select value={position} onValueChange={setPosition}>
                  <SelectTrigger className="max-w-xs">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="top-left">Top Left</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                    <SelectItem value="tile">Tile (Repeat)</SelectItem>
                  </SelectContent>
                </Select>
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
                  Watermark has been successfully added to your PDF!
                </AlertDescription>
              </Alert>

              <Button className="w-full" onClick={downloadWatermarkedPdf}>
                <FileOutput className="mr-2 h-4 w-4" />
                Download Watermarked PDF
              </Button>
            </div>
          ) : (
            <Button
              className="w-full"
              onClick={addWatermark}
              disabled={isProcessing || (watermarkType === "text" && !watermarkText.trim())}
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
                "Add Watermark"
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
