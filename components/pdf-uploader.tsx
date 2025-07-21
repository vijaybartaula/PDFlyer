"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PdfUploaderProps {
  onFilesSelected: (files: File[]) => void
  multiple?: boolean
  maxFiles?: number
  className?: string
}

export default function PdfUploader({
  onFilesSelected,
  multiple = false,
  maxFiles = 10,
  className = "",
}: PdfUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files).filter((file) => file.type === "application/pdf")
      const newFiles = multiple ? [...files, ...fileList].slice(0, maxFiles) : fileList.slice(0, 1)

      setFiles(newFiles)
      onFilesSelected(newFiles)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files) {
      const fileList = Array.from(e.dataTransfer.files).filter((file) => file.type === "application/pdf")
      const newFiles = multiple ? [...files, ...fileList].slice(0, maxFiles) : fileList.slice(0, 1)

      setFiles(newFiles)
      onFilesSelected(newFiles)
    }
  }

  const removeFile = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
    onFilesSelected(newFiles)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={className}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/30"}
          ${files.length > 0 ? "pb-2" : "py-12"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf"
          multiple={multiple}
          className="hidden"
        />

        {files.length === 0 && (
          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Drag & drop your PDF{multiple ? "s" : ""} here</p>
            <p className="text-sm text-muted-foreground mt-2">or click to browse</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={(e) => {
                e.stopPropagation()
                triggerFileInput()
              }}
            >
              Select PDF{multiple ? "s" : ""}
            </Button>
          </div>
        )}

        {files.length > 0 && (
          <div className="space-y-2 mt-4" onClick={(e) => e.stopPropagation()}>
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-muted p-3 rounded-md">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm font-medium truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(index)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {multiple && files.length < maxFiles && (
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={(e) => {
                  e.stopPropagation()
                  triggerFileInput()
                }}
              >
                Add More PDFs
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
