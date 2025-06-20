"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react"
import { speechManager } from "@/lib/speech"
import { useToast } from "@/hooks/use-toast"

interface VoiceControlsProps {
  onTranscript?: (text: string) => void
  voiceEnabled: boolean
  onVoiceToggle: (enabled: boolean) => void
}

export function VoiceControls({ onTranscript, voiceEnabled, onVoiceToggle }: VoiceControlsProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setIsSupported(speechManager.isRecognitionSupported && speechManager.isSynthesisSupported)
  }, [])

  const startListening = async () => {
    if (!isSupported) {
      toast({
        title: "Voice not supported",
        description: "Your browser doesn't support voice features.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsListening(true)
      const transcript = await speechManager.startListening()
      if (onTranscript) {
        onTranscript(transcript)
      }
      toast({
        title: "Voice captured",
        description: "Your voice has been transcribed.",
      })
    } catch (error) {
      toast({
        title: "Voice error",
        description: error instanceof Error ? error.message : "Failed to capture voice",
        variant: "destructive",
      })
    } finally {
      setIsListening(false)
    }
  }

  const stopListening = () => {
    speechManager.stopListening()
    setIsListening(false)
  }

  if (!isSupported) {
    return null
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={voiceEnabled ? () => onVoiceToggle(false) : () => onVoiceToggle(true)}
        className={voiceEnabled ? "bg-green-500/20 border-green-500" : ""}
      >
        {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={isListening ? stopListening : startListening}
        disabled={isListening}
        className={isListening ? "bg-red-500/20 border-red-500 animate-pulse" : ""}
      >
        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </Button>
    </div>
  )
}
