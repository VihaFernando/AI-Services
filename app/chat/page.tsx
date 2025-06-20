"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { VoiceControls } from "@/components/voice-controls"
import { callGemini, imageToBase64, type GeminiMessage } from "@/lib/gemini"
import { saveChatHistory, getChatHistory, addToPromptHistory, type ChatMessage } from "@/lib/storage"
import { speechManager } from "@/lib/speech"
import { useToast } from "@/hooks/use-toast"
import { Send, ImageIcon, Copy, Trash2, User, Bot } from "lucide-react"

import ReactMarkdown from "react-markdown"
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
// import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    const history = getChatHistory()
    setMessages(history)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() && selectedImages.length === 0) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: Date.now(),
      images: selectedImages.length > 0 ? selectedImages.map((file) => URL.createObjectURL(file)) : undefined,
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    try {
      // Prepare Gemini messages
      const geminiMessages: GeminiMessage[] = []

      // Add conversation history (last 10 messages for context)
      const recentMessages = newMessages.slice(-10)
      for (const msg of recentMessages) {
        if (msg.role === "user") {
          const parts: any[] = []
          if (msg.content) {
            parts.push({ text: msg.content })
          }
          if (msg.images && selectedImages.length > 0) {
            for (const image of selectedImages) {
              const base64 = await imageToBase64(image)
              parts.push({
                inlineData: {
                  mimeType: image.type,
                  data: base64,
                },
              })
            }
          }
          geminiMessages.push({ role: "user", parts })
        } else {
          geminiMessages.push({ role: "model", parts: [{ text: msg.content }] })
        }
      }

      const response = await callGemini(geminiMessages)

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: Date.now(),
      }

      const finalMessages = [...newMessages, assistantMessage]
      setMessages(finalMessages)
      saveChatHistory(finalMessages)

      // Add to prompt history
      addToPromptHistory({
        prompt: userMessage.content,
        response: response,
        type: "chat",
      })

      // Speak response if voice is enabled
      if (voiceEnabled) {
        try {
          await speechManager.speak(response)
        } catch (error) {
          console.error("Speech error:", error)
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get AI response",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setSelectedImages([])
    }
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedImages(files.slice(0, 5)) // Limit to 5 images
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Copied",
      description: "Message copied to clipboard",
    })
  }

  const clearChat = () => {
    setMessages([])
    saveChatHistory([])
    toast({
      title: "Chat cleared",
      description: "All messages have been removed",
    })
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">AI Chat</h1>
          <p className="text-muted-foreground">Have a natural conversation with AI</p>
        </div>
        <div className="flex items-center space-x-2">
          <VoiceControls
            onTranscript={(text) => setInput((prev) => prev + " " + text)}
            voiceEnabled={voiceEnabled}
            onVoiceToggle={setVoiceEnabled}
          />
          <Button variant="outline" size="sm" onClick={clearChat}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <Card className="flex-1 glass border-0 p-4 overflow-hidden">
        <div className="h-full overflow-y-auto space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-start space-x-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-purple-500 to-pink-500"
                        : "bg-gradient-to-r from-blue-500 to-cyan-500"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>

                  <div
                    className={`rounded-2xl p-4 ${
                      message.role === "user" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : "glass"
                    }`}
                  >
                    {message.images && (
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {message.images.map((image, index) => (
                          <img
                            key={index}
                            src={image || "/placeholder.svg"}
                            alt={`Uploaded ${index + 1}`}
                            className="rounded-lg max-w-32 max-h-32 object-cover"
                          />
                        ))}
                      </div>
                    )}
                    <div className="prose prose-sm max-w-none dark:prose-invert prose-pre:bg-gray-800 prose-pre:text-gray-100">
                      <ReactMarkdown
                        components={{
                          code({ inline, children, ...props }) {
                            return inline ? (
                              <code className="bg-gray-700/80 px-1 py-0.5 rounded text-[0.85em]" {...props}>
                                {children}
                              </code>
                            ) : (
                              <code {...props}>{children}</code>
                            )
                          },
                          pre({ children, ...props }) {
                            return (
                              <pre className="bg-gray-800/80 p-4 rounded-md overflow-x-auto text-sm my-3" {...props}>
                                {children}
                              </pre>
                            )
                          },
                          p: ({ children }) => <p className="mb-2">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                          li: ({ children }) => <li className="ml-2">{children}</li>,
                          strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                          em: ({ children }) => <em className="italic">{children}</em>,
                          h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-base font-bold mb-1">{children}</h3>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs opacity-70">{new Date(message.timestamp).toLocaleTimeString()}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyMessage(message.content)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="glass rounded-2xl p-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-current rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-current rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </Card>

      {/* Input */}
      <div className="mt-4 space-y-3">
        {selectedImages.length > 0 && (
          <div className="flex space-x-2 overflow-x-auto">
            {selectedImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image) || "/placeholder.svg"}
                  alt={`Selected ${index + 1}`}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
                  onClick={() => setSelectedImages((prev) => prev.filter((_, i) => i !== index))}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <ImageIcon className="w-4 h-4" />
          </Button>

          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            className="flex-1"
          />

          <Button onClick={handleSend} disabled={isLoading || (!input.trim() && selectedImages.length === 0)}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
    </div>
  )
}
