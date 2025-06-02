"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Upload, FileAudio, Languages, MessageSquare, TrendingUp } from "lucide-react"
import AudioRecorder from "./components/audio-recorder"
import FileUpload from "./components/file-upload"
import TranscriptionResult from "./components/transcription-result"

export default function TranscriptionApp() {
  const [activeTab, setActiveTab] = useState<"record" | "upload">("record")
  const [transcriptionData, setTranscriptionData] = useState<{
    dutch: string
    english: string
    feedback: string
    feedforward: string
  } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleTranscriptionComplete = (data: any) => {
    setTranscriptionData(data)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Nederlandse Audio Transcriptie & Feedback</h1>
          <p className="text-gray-600">Transcribeer Nederlandse audio naar Engels en ontvang educatieve feedback</p>
        </div>

        {/* Main Interface */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileAudio className="w-5 h-5" />
                  Audio Invoer
                </CardTitle>
                <CardDescription>Neem audio op of upload een bestand voor transcriptie</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={activeTab === "record" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("record")}
                  className="gap-2"
                >
                  <Mic className="w-4 h-4" />
                  Opnemen
                </Button>
                <Button
                  variant={activeTab === "upload" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("upload")}
                  className="gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Uploaden
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {activeTab === "record" ? (
              <AudioRecorder onTranscriptionComplete={handleTranscriptionComplete} setIsProcessing={setIsProcessing} />
            ) : (
              <FileUpload onTranscriptionComplete={handleTranscriptionComplete} setIsProcessing={setIsProcessing} />
            )}
          </CardContent>
        </Card>

        {/* Processing Indicator */}
        {isProcessing && (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-600">Verwerken van audio...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {transcriptionData && <TranscriptionResult data={transcriptionData} />}

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Languages className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold">Transcriptie</h3>
                  <p className="text-sm text-gray-600">Nederlands naar Engels</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="font-semibold">Feedback</h3>
                  <p className="text-sm text-gray-600">Educatieve beoordeling</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <div>
                  <h3 className="font-semibold">Feed Forward</h3>
                  <p className="text-sm text-gray-600">Verbetervoorstellen</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
