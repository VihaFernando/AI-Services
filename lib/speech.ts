export class SpeechManager {
  private synthesis: SpeechSynthesis | null = null
  private recognition: SpeechRecognition | null = null
  private isListening = false

  constructor() {
    if (typeof window !== "undefined") {
      this.synthesis = window.speechSynthesis

      // Initialize speech recognition
      const SpeechRecognition: SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition()
        this.recognition.continuous = false
        this.recognition.interimResults = false
        this.recognition.lang = "en-US"
      }
    }
  }

  speak(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error("Speech synthesis not supported"))
        return
      }

      // Cancel any ongoing speech
      this.synthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)

      // Try to find a female voice
      const voices = this.synthesis.getVoices()
      const femaleVoice =
        voices.find(
          (voice) =>
            voice.name.toLowerCase().includes("female") ||
            voice.name.toLowerCase().includes("samantha") ||
            voice.name.toLowerCase().includes("karen") ||
            voice.name.toLowerCase().includes("susan") ||
            voice.name.toLowerCase().includes("allison"),
        ) || voices.find((voice) => voice.gender === "female")

      if (femaleVoice) {
        utterance.voice = femaleVoice
      }

      utterance.rate = 0.9
      utterance.pitch = 1.1
      utterance.volume = 0.8

      utterance.onend = () => resolve()
      utterance.onerror = (event) => reject(new Error(`Speech error: ${event.error}`))

      this.synthesis.speak(utterance)
    })
  }

  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel()
    }
  }

  startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error("Speech recognition not supported"))
        return
      }

      if (this.isListening) {
        reject(new Error("Already listening"))
        return
      }

      this.isListening = true

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        this.isListening = false
        resolve(transcript)
      }

      this.recognition.onerror = (event) => {
        this.isListening = false
        reject(new Error(`Speech recognition error: ${event.error}`))
      }

      this.recognition.onend = () => {
        this.isListening = false
      }

      this.recognition.start()
    })
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  get isRecognitionSupported(): boolean {
    return this.recognition !== null
  }

  get isSynthesisSupported(): boolean {
    return this.synthesis !== null
  }
}

export const speechManager = new SpeechManager()
