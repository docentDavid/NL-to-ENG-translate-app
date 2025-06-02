"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Languages, MessageSquare, TrendingUp, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TranscriptionResultProps {
  data: {
    dutch: string
    english: string
    feedback: string
    feedforward: string
  }
}

export default function TranscriptionResult({ data }: TranscriptionResultProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      {/* Transcription Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="w-5 h-5" />
            Transcriptie Resultaten
          </CardTitle>
          <CardDescription>Nederlandse audio getranscribeerd en vertaald naar Engels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="gap-1">
                🇳🇱 Nederlands
              </Badge>
              <Button size="sm" variant="ghost" onClick={() => copyToClipboard(data.dutch)}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <Textarea value={data.dutch} readOnly className="min-h-[100px] bg-gray-50" />
          </div>

          <Separator />

          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="gap-1">
                🇬🇧 Engels
              </Badge>
              <Button size="sm" variant="ghost" onClick={() => copyToClipboard(data.english)}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <Textarea value={data.english} readOnly className="min-h-[100px] bg-gray-50" />
          </div>
        </CardContent>
      </Card>

      {/* Educational Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <MessageSquare className="w-5 h-5" />
              Feedback
            </CardTitle>
            <CardDescription>Educatieve beoordeling van de inhoud</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-2">
              <Button size="sm" variant="ghost" onClick={() => copyToClipboard(data.feedback)}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <Textarea value={data.feedback} readOnly className="min-h-[150px] bg-green-50 border-green-200" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <TrendingUp className="w-5 h-5" />
              Feed Forward
            </CardTitle>
            <CardDescription>Suggesties voor verbetering en ontwikkeling</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-2">
              <Button size="sm" variant="ghost" onClick={() => copyToClipboard(data.feedforward)}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <Textarea value={data.feedforward} readOnly className="min-h-[150px] bg-purple-50 border-purple-200" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
