export interface GeminiMessage {
  role: "user" | "model"
  parts: Array<{
    text?: string
    inlineData?: {
      mimeType: string
      data: string
    }
  }>
}

/**
 * Client-side helper.
 * Always calls our own /api/gemini route (API key stays on the server).
 */
export async function callGemini(messages: GeminiMessage[]): Promise<string> {
  try {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    })

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Unknown error" }))
      throw new Error(error ?? `HTTP ${res.status}`)
    }

    const { text } = (await res.json()) as { text: string }
    return text
  } catch (error) {
    console.error("Gemini API error:", error)
    throw error instanceof Error ? error : new Error("Gemini request failed.")
  }
}

/* ---------- utility unchanged ---------- */
export function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(",")[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
