"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { VoiceControls } from "@/components/voice-controls"
import { callGemini, imageToBase64 } from "@/lib/gemini"
import { addToPromptHistory } from "@/lib/storage"
import { speechManager } from "@/lib/speech"
import { useToast } from "@/hooks/use-toast"
import { Upload, ImageIcon, Send, Copy, X } from "lucide-react"

import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

export default function ImagePage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [question, setQuestion] = useState("")
  const [analysis, setAnalysis] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const handleImageSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    setSelectedImage(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    setAnalysis("")
  }

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleImageSelect(file)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      handleImageSelect(file)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const analyzeImage = async () => {
    if (!selectedImage) {
      toast({
        title: "No Image",
        description: "Please select an image first",
        variant: "destructive",
      })
      return
    }

    if (!question.trim()) {
      toast({
        title: "No Question",
        description: "Please ask a question about the image",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const base64 = await imageToBase64(selectedImage)

      const response = await callGemini([
        {
          role: "user",
          parts: [
            { text: question },
            {
              inlineData: {
                mimeType: selectedImage.type,
                data: base64,
              },
            },
          ],
        },
      ])

      setAnalysis(response)

      // Add to prompt history
      addToPromptHistory({
        prompt: `Image Analysis: ${question}`,
        response: response,
        type: "image",
      })

      // Speak result if voice is enabled
      if (voiceEnabled) {
        try {
          await speechManager.speak(response)
        } catch (error) {
          console.error("Speech error:", error)
        }
      }

      toast({
        title: "Analysis Complete",
        description: "Image has been analyzed successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze image",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyAnalysis = () => {
    navigator.clipboard.writeText(analysis)
    toast({
      title: "Copied",
      description: "Analysis copied to clipboard",
    })
  }

  const clearImage = () => {
    setSelectedImage(null)
    setImagePreview("")
    setAnalysis("")
    setQuestion("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const quickQuestions = [
    "What do you see in this image?",
    "Describe the main objects and their colors",
    "What is the mood or atmosphere of this image?",
    "Are there any people in this image? Describe them",
    "What text can you read in this image?",
    "What is the setting or location?",
    "What activities are happening in this image?",
    "What emotions does this image convey?",
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Image Analysis</h1>
          <p className="text-muted-foreground">Upload images and ask AI questions about them</p>
        </div>
        <VoiceControls
          onTranscript={(text) => setQuestion((prev) => prev + " " + text)}
          voiceEnabled={voiceEnabled}
          onVoiceToggle={setVoiceEnabled}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Upload & Question */}
        <div className="space-y-6">
          {/* Image Upload */}
          <Card className="glass border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ImageIcon className="w-5 h-5" />
                <span>Upload Image</span>
              </CardTitle>
              <CardDescription>Drag and drop or click to select an image</CardDescription>
            </CardHeader>
            <CardContent>
              {!imagePreview ? (
                <div
                  ref={dropZoneRef}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">Drop your image here</p>
                  <p className="text-sm text-muted-foreground">or click to browse files</p>
                  <p className="text-xs text-muted-foreground mt-2">Supports JPG, PNG, GIF, WebP</p>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Selected"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={clearImage}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
            </CardContent>
          </Card>

          {/* Question Input */}
          <Card className="glass border-0">
            <CardHeader>
              <CardTitle>Ask a Question</CardTitle>
              <CardDescription>What would you like to know about this image?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="What do you see in this image?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && analyzeImage()}
                  className="flex-1"
                />
                <Button onClick={analyzeImage} disabled={isLoading || !selectedImage || !question.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {/* Quick Questions */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Quick Questions:</p>
                <div className="grid grid-cols-1 gap-2">
                  {quickQuestions.map((q, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="justify-start text-left h-auto py-2 px-3"
                      onClick={() => setQuestion(q)}
                    >
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Results */}
        <div>
          <Card className="glass border-0 h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Analysis Results</CardTitle>
                {analysis && (
                  <Button variant="outline" size="sm" onClick={copyAnalysis}>
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded shimmer" />
                  <div className="h-4 bg-muted rounded shimmer" />
                  <div className="h-4 bg-muted rounded shimmer w-3/4" />
                  <div className="h-4 bg-muted rounded shimmer" />
                  <div className="h-4 bg-muted rounded shimmer w-1/2" />
                </div>
              ) : analysis ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\\w+)/.exec(className || "")
                        return !inline && match ? (
                          <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" {...props}>
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className="bg-gray-700 px-1 py-0.5 rounded text-sm" {...props}>
                            {children}
                          </code>
                        )
                      },
                      p: ({ children }) => <p className="mb-3">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="ml-2">{children}</li>,
                      strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                      h1: ({ children }) => <h1 className="text-xl font-bold mb-3">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-base font-bold mb-2">{children}</h3>,
                    }}
                  >
                    {analysis}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Ready to Analyze</h3>
                  <p>Upload an image and ask a question to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
