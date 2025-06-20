"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VoiceControls } from "@/components/voice-controls"
import { callGemini } from "@/lib/gemini"
import { addToPromptHistory } from "@/lib/storage"
import { speechManager } from "@/lib/speech"
import { useToast } from "@/hooks/use-toast"
import { FileText, Upload, Send, Copy, Sparkles } from "lucide-react"

import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

export default function DocsPage() {
  const [inputText, setInputText] = useState("")
  const [question, setQuestion] = useState("")
  const [summary, setSummary] = useState("")
  const [answer, setAnswer] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [activeTab, setActiveTab] = useState("summarize")
  const { toast } = useToast()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== "text/plain") {
      toast({
        title: "Invalid File",
        description: "Please upload a text file (.txt)",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setInputText(content)
      toast({
        title: "File Uploaded",
        description: "Text content has been loaded",
      })
    }
    reader.readAsText(file)
  }

  const summarizeText = async () => {
    if (!inputText.trim()) {
      toast({
        title: "No Text",
        description: "Please enter or upload text to summarize",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const prompt = `Please provide a comprehensive summary of the following text. Include:
1. Main points and key ideas
2. Important details and supporting information
3. Conclusions or outcomes
4. Overall theme or message

Text to summarize:
${inputText}`

      const response = await callGemini([{ role: "user", parts: [{ text: prompt }] }])
      setSummary(response)

      // Add to prompt history
      addToPromptHistory({
        prompt: `Document Summary: ${inputText.slice(0, 100)}...`,
        response: response,
        type: "docs",
      })

      // Speak result if voice is enabled
      if (voiceEnabled) {
        try {
          const speakText = response.slice(0, 300) + (response.length > 300 ? "..." : "")
          await speechManager.speak(speakText)
        } catch (error) {
          console.error("Speech error:", error)
        }
      }

      toast({
        title: "Summary Generated",
        description: "Your document has been summarized",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to summarize text",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const askQuestion = async () => {
    if (!inputText.trim()) {
      toast({
        title: "No Text",
        description: "Please enter or upload text first",
        variant: "destructive",
      })
      return
    }

    if (!question.trim()) {
      toast({
        title: "No Question",
        description: "Please enter a question about the text",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const prompt = `Based on the following text, please answer this question: "${question}"

Provide a detailed answer based only on the information in the text. If the answer cannot be found in the text, please say so.

Text:
${inputText}`

      const response = await callGemini([{ role: "user", parts: [{ text: prompt }] }])
      setAnswer(response)

      // Add to prompt history
      addToPromptHistory({
        prompt: `Document Q&A: ${question}`,
        response: response,
        type: "docs",
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
        title: "Question Answered",
        description: "AI has analyzed your document and provided an answer",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to answer question",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyResult = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    })
  }

  const quickQuestions = [
    "What are the main points discussed?",
    "What conclusions are drawn?",
    "Who are the key people mentioned?",
    "What dates or numbers are important?",
    "What problems are identified?",
    "What solutions are proposed?",
    "What is the overall tone or sentiment?",
    "What actions are recommended?",
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Document Summarizer</h1>
          <p className="text-muted-foreground">Analyze and summarize any text or document</p>
        </div>
        <VoiceControls
          onTranscript={(text) => {
            if (activeTab === "summarize") {
              setInputText((prev) => prev + " " + text)
            } else {
              setQuestion((prev) => prev + " " + text)
            }
          }}
          voiceEnabled={voiceEnabled}
          onVoiceToggle={setVoiceEnabled}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Text Input */}
          <Card className="glass border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Document Input</span>
              </CardTitle>
              <CardDescription>Paste text or upload a document</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your text here or upload a file..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={12}
                className="resize-none"
              />

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("file-upload")?.click()}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Text File
                </Button>
                <Button variant="outline" onClick={() => setInputText("")} disabled={!inputText}>
                  Clear
                </Button>
              </div>

              <input id="file-upload" type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />

              {inputText && (
                <div className="text-xs text-muted-foreground">
                  {inputText.length} characters • {inputText.split(/\s+/).length} words
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Tabs */}
          <Card className="glass border-0">
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="summarize">Summarize</TabsTrigger>
                  <TabsTrigger value="question">Ask Question</TabsTrigger>
                </TabsList>

                <TabsContent value="summarize" className="space-y-4">
                  <Button
                    onClick={summarizeText}
                    disabled={isLoading || !inputText.trim()}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span>Summarizing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>Generate Summary</span>
                      </div>
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="question" className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Ask a question about the text..."
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && askQuestion()}
                      className="flex-1"
                    />
                    <Button onClick={askQuestion} disabled={isLoading || !inputText.trim() || !question.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Quick Questions:</p>
                    <div className="grid grid-cols-1 gap-1">
                      {quickQuestions.slice(0, 4).map((q, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="justify-start text-left h-auto py-2 px-3 text-xs"
                          onClick={() => setQuestion(q)}
                        >
                          {q}
                        </Button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Summary Results */}
          {(summary || (isLoading && activeTab === "summarize")) && (
            <Card className="glass border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Summary</CardTitle>
                  {summary && (
                    <Button variant="outline" size="sm" onClick={() => copyResult(summary)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isLoading && activeTab === "summarize" ? (
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded shimmer" />
                    <div className="h-4 bg-muted rounded shimmer" />
                    <div className="h-4 bg-muted rounded shimmer w-3/4" />
                    <div className="h-4 bg-muted rounded shimmer" />
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose prose-sm max-w-none dark:prose-invert"
                  >
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "")
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
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ul>,
                        li: ({ children }) => <li className="ml-2">{children}</li>,
                        strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                        em: ({ children }) => <em className="italic">{children}</em>,
                        h1: ({ children }) => <h1 className="text-xl font-bold mb-3">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-base font-bold mb-2">{children}</h3>,
                      }}
                    >
                      {summary}
                    </ReactMarkdown>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Q&A Results */}
          {(answer || (isLoading && activeTab === "question")) && (
            <Card className="glass border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Answer</CardTitle>
                  {answer && (
                    <Button variant="outline" size="sm" onClick={() => copyResult(answer)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                {question && !isLoading && <CardDescription>Q: {question}</CardDescription>}
              </CardHeader>
              <CardContent>
                {isLoading && activeTab === "question" ? (
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded shimmer" />
                    <div className="h-4 bg-muted rounded shimmer" />
                    <div className="h-4 bg-muted rounded shimmer w-2/3" />
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose prose-sm max-w-none dark:prose-invert"
                  >
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "")
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
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ul>,
                        li: ({ children }) => <li className="ml-2">{children}</li>,
                        strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                        em: ({ children }) => <em className="italic">{children}</em>,
                        h1: ({ children }) => <h1 className="text-xl font-bold mb-3">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-base font-bold mb-2">{children}</h3>,
                      }}
                    >
                      {answer}
                    </ReactMarkdown>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!summary && !answer && !isLoading && (
            <Card className="glass border-0">
              <CardContent className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Ready to Analyze</h3>
                <p className="text-muted-foreground">Enter or upload text, then choose to summarize or ask questions</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
