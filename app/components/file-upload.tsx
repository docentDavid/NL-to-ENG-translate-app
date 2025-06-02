"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, File, X } from "lucide-react"

interface FileUploadProps {
  onTranscriptionComplete: (data: any) => void
  setIsProcessing: (processing: boolean) => void
  inputLanguage: string
  outputLanguage: string
}

export default function FileUpload({
  onTranscriptionComplete,
  setIsProcessing,
  inputLanguage,
  outputLanguage,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith("audio/")) {
      setSelectedFile(file)
    } else {
      alert("Selecteer een geldig audiobestand")
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const processFile = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    const formData = new FormData()
    formData.append("audio", selectedFile)
    formData.append("inputLanguage", inputLanguage)
    formData.append("outputLanguage", outputLanguage)

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        onTranscriptionComplete(data)
      } else {
        console.error("Transcription failed")
      }
    } catch (error) {
      console.error("Error processing file:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">Sleep een audiobestand hierheen</p>
        <p className="text-sm text-gray-500 mb-4">of klik om een bestand te selecteren</p>
        <input type="file" accept="audio/*" onChange={handleFileInput} className="hidden" id="file-input" />
        <Button asChild variant="outline">
          <label htmlFor="file-input" className="cursor-pointer">
            Bestand Selecteren
          </label>
        </Button>
      </div>

      {selectedFile && (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <File className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setSelectedFile(null)} size="sm" variant="outline">
              <X className="w-4 h-4" />
            </Button>
            <Button onClick={processFile} size="sm">
              Transcribeer & Vertaal
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
