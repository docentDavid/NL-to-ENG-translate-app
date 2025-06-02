import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return Response.json({ error: "No audio file provided" }, { status: 400 })
    }

    // Convert audio file to buffer for Groq Whisper
    const audioBuffer = await audioFile.arrayBuffer()
    const audioBlob = new Blob([audioBuffer], { type: audioFile.type })

    // Transcribe Dutch audio using Groq Whisper
    const transcriptionResponse = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: (() => {
        const formData = new FormData()
        formData.append("file", audioBlob, "audio.wav")
        formData.append("model", "whisper-large-v3")
        formData.append("language", "nl")
        return formData
      })(),
    })

    if (!transcriptionResponse.ok) {
      throw new Error("Transcription failed")
    }

    const transcriptionData = await transcriptionResponse.json()
    const dutchText = transcriptionData.text

    // Translate to English and generate educational feedback
    const { text: analysisResult } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: `You are an educational AI assistant. You receive Dutch text that you must:

1. Translate to correct English
2. Analyze from an educational perspective  
3. Provide feedback on the content
4. Make feed forward suggestions for improvement

Dutch text: "${dutchText}"

IMPORTANT: Respond ONLY with valid JSON in exactly this format, no additional text or explanation:

{
  "dutch": "${dutchText}",
  "english": "English translation here",
  "feedback": "Educational feedback about content, learning outcomes, and strengths",
  "feedforward": "Concrete suggestions for improvement and further development"
}`,
    })

    // Parse the JSON response with better error handling
    let parsedResult
    try {
      // Clean the response to ensure it's valid JSON
      const cleanedResult = analysisResult.trim()
      console.log("AI Response:", cleanedResult) // Debug log

      parsedResult = JSON.parse(cleanedResult)

      // Validate that all required fields exist
      if (!parsedResult.dutch || !parsedResult.english || !parsedResult.feedback || !parsedResult.feedforward) {
        throw new Error("Missing required fields in response")
      }
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError)
      console.error("Raw AI Response:", analysisResult)

      // Enhanced fallback with actual translation attempt
      const { text: simpleTranslation } = await generateText({
        model: groq("llama-3.1-8b-instant"),
        prompt: `Translate this Dutch text to English: "${dutchText}"
    
    Respond with only the English translation, no additional text.`,
      })

      parsedResult = {
        dutch: dutchText,
        english: simpleTranslation.trim(),
        feedback:
          "De audio is succesvol getranscribeerd. Voor een volledige educatieve analyse, probeer opnieuw met duidelijkere audio.",
        feedforward: "Zorg voor goede audio kwaliteit en spreek duidelijk voor betere analyse resultaten.",
      }
    }

    return Response.json(parsedResult)
  } catch (error) {
    console.error("Transcription error:", error)
    return Response.json({ error: "Failed to process audio" }, { status: 500 })
  }
}
