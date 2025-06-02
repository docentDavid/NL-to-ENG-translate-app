"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Square, Play, Pause } from "lucide-react"

interface AudioRecorderProps {
  onTranscriptionComplete: (data: any) => void
  setIsProcessing: (processing: boolean) => void
}

export default function AudioRecorder({ onTranscriptionComplete, setIsProcessing }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" })
        setAudioBlob(blob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error starting recording:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const playAudio = () => {
    if (audioBlob && audioRef.current) {
      const url = URL.createObjectURL(audioBlob)
      audioRef.current.src = url
      audioRef.current.play()
      setIsPlaying(true)

      audioRef.current.onended = () => {
        setIsPlaying(false)
        URL.revokeObjectURL(url)
      }
    }
  }

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const processAudio = async () => {
    if (!audioBlob) return

    setIsProcessing(true)
    const formData = new FormData()
    formData.append("audio", audioBlob, "recording.wav")

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
      console.error("Error processing audio:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center">
        {!isRecording ? (
          <Button onClick={startRecording} size="lg" className="gap-2 bg-red-600 hover:bg-red-700">
            <Mic className="w-5 h-5" />
            Start Opname
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            size="lg"
            variant="outline"
            className="gap-2 border-red-600 text-red-600 hover:bg-red-50"
          >
            <Square className="w-5 h-5" />
            Stop Opname
          </Button>
        )}
      </div>

      {isRecording && (
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 text-red-600">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Opname actief...</span>
          </div>
        </div>
      )}

      {audioBlob && (
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Opname gereed</span>
            <div className="flex gap-2">
              <Button onClick={isPlaying ? pauseAudio : playAudio} size="sm" variant="outline" className="gap-2">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? "Pauzeer" : "Afspelen"}
              </Button>
              <Button onClick={processAudio} size="sm" className="gap-2">
                Transcribeer
              </Button>
            </div>
          </div>
          <audio ref={audioRef} className="hidden" />
        </div>
      )}
    </div>
  )
}
