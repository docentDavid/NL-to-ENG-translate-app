import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

// Language code mapping for Whisper
const WHISPER_LANGUAGE_MAP: { [key: string]: string } = {
  nl: "nl",
  en: "en",
  "en-US": "en",
  de: "de",
  fr: "fr",
  es: "es",
  it: "it",
  pt: "pt",
  ru: "ru",
  ja: "ja",
  ko: "ko",
  zh: "zh",
}

const LANGUAGE_NAMES: { [key: string]: string } = {
  nl: "Dutch",
  en: "English (UK)",
  "en-US": "English (US)",
  de: "German",
  fr: "French",
  es: "Spanish",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File
    const inputLanguage = (formData.get("inputLanguage") as string) || "nl"
    const outputLanguage = (formData.get("outputLanguage") as string) || "en"

    if (!audioFile) {
      return Response.json({ error: "No audio file provided" }, { status: 400 })
    }

    // Convert audio file to buffer for Groq Whisper
    const audioBuffer = await audioFile.arrayBuffer()
    const audioBlob = new Blob([audioBuffer], { type: audioFile.type })

    // Get the correct language code for Whisper
    const whisperLangCode = WHISPER_LANGUAGE_MAP[inputLanguage] || "auto"

    // Transcribe audio using Groq Whisper
    const transcriptionResponse = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: (() => {
        const formData = new FormData()
        formData.append("file", audioBlob, "audio.wav")
        formData.append("model", "whisper-large-v3")
        if (whisperLangCode !== "auto") {
          formData.append("language", whisperLangCode)
        }
        return formData
      })(),
    })

    if (!transcriptionResponse.ok) {
      throw new Error("Transcription failed")
    }

    const transcriptionData = await transcriptionResponse.json()
    const originalText = transcriptionData.text

    // If input and output languages are the same, skip translation
    if (inputLanguage === outputLanguage) {
      return Response.json({
        original: originalText,
        translated: originalText,
        inputLang: inputLanguage,
        outputLang: outputLanguage,
      })
    }

    // Translate the text
    const { text: translatedText } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: `Translate the following text from ${LANGUAGE_NAMES[inputLanguage] || inputLanguage} to ${LANGUAGE_NAMES[outputLanguage] || outputLanguage}.

Text to translate: "${originalText}"

Provide only the translation, no additional text or explanation.`,
    })

    return Response.json({
      original: originalText,
      translated: translatedText.trim(),
      inputLang: inputLanguage,
      outputLang: outputLanguage,
    })
  } catch (error) {
    console.error("Transcription error:", error)
    return Response.json({ error: "Failed to process audio" }, { status: 500 })
  }
}
