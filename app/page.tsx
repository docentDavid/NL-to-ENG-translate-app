"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mic, Upload, FileAudio, Languages, ArrowRight } from "lucide-react"
import AudioRecorder from "./components/audio-recorder"
import FileUpload from "./components/file-upload"
import TranscriptionResult from "./components/transcription-result"

const LANGUAGES = [
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  { code: "en", name: "English (UK)", flag: "🇬🇧" },
  { code: "en-US", name: "English (US)", flag: "🇺🇸" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
]

export default function TranscriptionApp() {
  const [activeTab, setActiveTab] = useState<"record" | "upload">("record")
  const [inputLanguage, setInputLanguage] = useState("nl")
  const [outputLanguage, setOutputLanguage] = useState("en")
  const [transcriptionData, setTranscriptionData] = useState<{
    original: string
    translated: string
    inputLang: string
    outputLang: string
  } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleTranscriptionComplete = (data: any) => {
    setTranscriptionData(data)
  }

  const getLanguageName = (code: string) => {
    return LANGUAGES.find((lang) => lang.code === code)?.name || code
  }

  const getLanguageFlag = (code: string) => {
    return LANGUAGES.find((lang) => lang.code === code)?.flag || "🌐"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Audio Transcriptie & Vertaling</h1>
          <p className="text-gray-600">Transcribeer audio en vertaal naar verschillende talen</p>
        </div>

        {/* Language Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="w-5 h-5" />
              Taal Selectie
            </CardTitle>
            <CardDescription>Kies de invoer- en uitvoertaal voor transcriptie en vertaling</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Invoertaal</label>
                <Select value={inputLanguage} onValueChange={setInputLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-gray-400" />
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Uitvoertaal</label>
                <Select value={outputLanguage} onValueChange={setOutputLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Interface */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileAudio className="w-5 h-5" />
                  Audio Invoer
                </CardTitle>
                <CardDescription>Neem audio op of upload een bestand voor transcriptie en vertaling</CardDescription>
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
              <AudioRecorder
                onTranscriptionComplete={handleTranscriptionComplete}
                setIsProcessing={setIsProcessing}
                inputLanguage={inputLanguage}
                outputLanguage={outputLanguage}
              />
            ) : (
              <FileUpload
                onTranscriptionComplete={handleTranscriptionComplete}
                setIsProcessing={setIsProcessing}
                inputLanguage={inputLanguage}
                outputLanguage={outputLanguage}
              />
            )}
          </CardContent>
        </Card>

        {/* Processing Indicator */}
        {isProcessing && (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-600">
                  Transcriberen van {getLanguageFlag(inputLanguage)} {getLanguageName(inputLanguage)} naar{" "}
                  {getLanguageFlag(outputLanguage)} {getLanguageName(outputLanguage)}...
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {transcriptionData && <TranscriptionResult data={transcriptionData} />}

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Languages className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold">Multi-taal Transcriptie</h3>
                  <p className="text-sm text-gray-600">Ondersteuning voor 12+ talen</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <ArrowRight className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="font-semibold">Directe Vertaling</h3>
                  <p className="text-sm text-gray-600">Real-time audio naar tekst vertaling</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
