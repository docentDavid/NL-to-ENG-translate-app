"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Languages, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

const LANGUAGE_FLAGS: { [key: string]: string } = {
  nl: "🇳🇱",
  en: "🇬🇧",
  "en-US": "🇺🇸",
  de: "🇩🇪",
  fr: "🇫🇷",
  es: "🇪🇸",
  it: "🇮🇹",
  pt: "🇵🇹",
  ru: "🇷🇺",
  ja: "🇯🇵",
  ko: "🇰🇷",
  zh: "🇨🇳",
}

const LANGUAGE_NAMES: { [key: string]: string } = {
  nl: "Nederlands",
  en: "English (UK)",
  "en-US": "English (US)",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  it: "Italiano",
  pt: "Português",
  ru: "Русский",
  ja: "日本語",
  ko: "한국어",
  zh: "中文",
}

interface TranscriptionResultProps {
  data: {
    original: string
    translated: string
    inputLang: string
    outputLang: string
  }
}

export default function TranscriptionResult({ data }: TranscriptionResultProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getLanguageDisplay = (code: string) => {
    const flag = LANGUAGE_FLAGS[code] || "🌐"
    const name = LANGUAGE_NAMES[code] || code
    return { flag, name }
  }

  const inputLang = getLanguageDisplay(data.inputLang)
  const outputLang = getLanguageDisplay(data.outputLang)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="w-5 h-5" />
          Transcriptie & Vertaling Resultaten
        </CardTitle>
        <CardDescription>
          Audio getranscribeerd van {inputLang.flag} {inputLang.name} naar {outputLang.flag} {outputLang.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="gap-1">
              <span>{inputLang.flag}</span>
              <span>{inputLang.name}</span>
            </Badge>
            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(data.original)}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <Textarea value={data.original} readOnly className="min-h-[100px] bg-gray-50" />
        </div>

        <Separator />

        <div>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="gap-1">
              <span>{outputLang.flag}</span>
              <span>{outputLang.name}</span>
            </Badge>
            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(data.translated)}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <Textarea value={data.translated} readOnly className="min-h-[100px] bg-blue-50 border-blue-200" />
        </div>
      </CardContent>
    </Card>
  )
}
