"use client"

import type React from "react"
import { useState, useRef } from "react"

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
        className={`border border-dashed rounded-sm p-6 text-center cursor-pointer transition-colors bg-card ${
          isDragging ? "border-foreground bg-muted/60" : "border-border hover:border-foreground/40"
        } ${files.length > 0 ? "pb-3" : "py-10 md:py-14"}`}
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
          <div className="flex flex-col items-center max-w-md mx-auto">
            {/* Custom Classical Manuscript Ingestion Icon */}
            <div className="w-12 h-12 rounded-sm bg-muted/70 flex items-center justify-center text-foreground/80 mb-4 border border-border">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" />
                <path d="M14 2v6h6M12 18v-6M9 15l3-3 3 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-base font-serif font-medium text-foreground">
              Deposit PDF {multiple ? "manuscripts" : "manuscript"} upon this desk
            </p>
            <p className="text-xs text-muted-foreground mt-1 font-sans">
              Drag folios into this tray, or browse the local file repository
            </p>
            <button
              type="button"
              className="mt-4 px-4 py-2 border border-border bg-background hover:bg-muted/70 text-xs font-sans uppercase tracking-wider font-semibold rounded-sm transition-colors text-foreground"
              onClick={(e) => {
                e.stopPropagation()
                triggerFileInput()
              }}
            >
              Select Manuscript{multiple ? "s" : ""}
            </button>
          </div>
        )}

        {files.length > 0 && (
          <div className="space-y-2 mt-2" onClick={(e) => e.stopPropagation()}>
            <div className="editorial-tag text-muted-foreground text-left mb-2">
              Ingested Folios ({files.length} of {maxFiles})
            </div>
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-muted/50 border border-border/80 p-3 rounded-sm text-left"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="w-5 h-5 rounded-sm bg-foreground text-background text-[0.65rem] font-serif font-bold flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>
                  <div className="truncate">
                    <div className="text-xs font-serif font-medium text-foreground truncate">{file.name}</div>
                    <div className="text-[0.65rem] text-muted-foreground font-mono">
                      {(file.size / 1024 / 1024).toFixed(2)} MB · Portable Document Format
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-sm"
                  aria-label="Remove leaf"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(index)
                  }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ))}

            {multiple && files.length < maxFiles && (
              <button
                type="button"
                className="w-full mt-3 py-2 border border-dashed border-border hover:border-foreground/40 text-xs font-sans uppercase tracking-wider font-medium text-muted-foreground hover:text-foreground rounded-sm transition-colors bg-background"
                onClick={(e) => {
                  e.stopPropagation()
                  triggerFileInput()
                }}
              >
                + Append Further Manuscripts
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
