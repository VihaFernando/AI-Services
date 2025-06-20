"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VoiceControls } from "@/components/voice-controls"
import { callGemini } from "@/lib/gemini"
import { addToPromptHistory } from "@/lib/storage"
import { speechManager } from "@/lib/speech"
import { useToast } from "@/hooks/use-toast"
import { Copy, Download, PenTool, FileText, Mail, User, Briefcase } from "lucide-react"

import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

const templates = [
  {
    id: "blog",
    name: "Blog Post",
    icon: FileText,
    description: "Create engaging blog content",
    fields: [
      { name: "topic", label: "Topic", type: "input", placeholder: "Enter your blog topic" },
      { name: "audience", label: "Target Audience", type: "input", placeholder: "Who is your audience?" },
      { name: "tone", label: "Tone", type: "select", options: ["Professional", "Casual", "Friendly", "Authoritative"] },
      {
        name: "length",
        label: "Length",
        type: "select",
        options: ["Short (300-500 words)", "Medium (500-800 words)", "Long (800+ words)"],
      },
    ],
    prompt: (data: any) =>
      `Write a ${data.tone.toLowerCase()} blog post about "${data.topic}" for ${data.audience}. The post should be ${data.length.toLowerCase()}. Include an engaging introduction, main points with examples, and a compelling conclusion.`,
  },
  {
    id: "social",
    name: "Social Media Post",
    icon: PenTool,
    description: "Craft engaging social content",
    fields: [
      {
        name: "platform",
        label: "Platform",
        type: "select",
        options: ["Twitter", "LinkedIn", "Facebook", "Instagram"],
      },
      { name: "topic", label: "Topic/Message", type: "input", placeholder: "What do you want to share?" },
      { name: "cta", label: "Call to Action", type: "input", placeholder: "What action should users take?" },
      { name: "hashtags", label: "Include Hashtags", type: "select", options: ["Yes", "No"] },
    ],
    prompt: (data: any) =>
      `Create a ${data.platform} post about "${data.topic}". Include a call to action: "${data.cta}". ${data.hashtags === "Yes" ? "Include relevant hashtags." : "Do not include hashtags."} Make it engaging and platform-appropriate.`,
  },
  {
    id: "email",
    name: "Email",
    icon: Mail,
    description: "Professional email templates",
    fields: [
      {
        name: "type",
        label: "Email Type",
        type: "select",
        options: ["Business Inquiry", "Follow-up", "Thank You", "Complaint", "Request"],
      },
      { name: "recipient", label: "Recipient", type: "input", placeholder: "Who are you writing to?" },
      { name: "purpose", label: "Purpose", type: "textarea", placeholder: "What is the main purpose of this email?" },
      { name: "tone", label: "Tone", type: "select", options: ["Formal", "Semi-formal", "Friendly"] },
    ],
    prompt: (data: any) =>
      `Write a ${data.tone.toLowerCase()} ${data.type.toLowerCase()} email to ${data.recipient}. The purpose is: ${data.purpose}. Include appropriate subject line, greeting, body, and closing.`,
  },
  {
    id: "resume",
    name: "Resume Section",
    icon: User,
    description: "Professional resume content",
    fields: [
      {
        name: "section",
        label: "Section",
        type: "select",
        options: ["Professional Summary", "Work Experience", "Skills", "Education"],
      },
      { name: "role", label: "Target Role", type: "input", placeholder: "What position are you applying for?" },
      {
        name: "experience",
        label: "Your Background",
        type: "textarea",
        placeholder: "Describe your relevant experience",
      },
      { name: "industry", label: "Industry", type: "input", placeholder: "What industry?" },
    ],
    prompt: (data: any) =>
      `Write a professional ${data.section.toLowerCase()} for a resume targeting a ${data.role} position in the ${data.industry} industry. Based on this background: ${data.experience}. Make it compelling and ATS-friendly.`,
  },
  {
    id: "cover",
    name: "Cover Letter",
    icon: Briefcase,
    description: "Compelling cover letters",
    fields: [
      { name: "company", label: "Company Name", type: "input", placeholder: "Company you're applying to" },
      { name: "position", label: "Position", type: "input", placeholder: "Job title" },
      {
        name: "experience",
        label: "Relevant Experience",
        type: "textarea",
        placeholder: "Your relevant background and achievements",
      },
      {
        name: "motivation",
        label: "Why This Company?",
        type: "textarea",
        placeholder: "Why do you want to work here?",
      },
    ],
    prompt: (data: any) =>
      `Write a professional cover letter for the ${data.position} position at ${data.company}. Highlight this experience: ${data.experience}. Explain motivation: ${data.motivation}. Make it personalized and compelling.`,
  },
]

export default function WritePage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const { toast } = useToast()

  const currentTemplate = templates.find((t) => t.id === selectedTemplate)

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }))
  }

  const handleVoiceInput = (fieldName: string, transcript: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: transcript }))
  }

  const generateContent = async () => {
    if (!currentTemplate) return

    // Check if all required fields are filled
    const missingFields = currentTemplate.fields.filter((field) => !formData[field.name]?.trim())
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in: ${missingFields.map((f) => f.label).join(", ")}`,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const prompt = currentTemplate.prompt(formData)
      const response = await callGemini([{ role: "user", parts: [{ text: prompt }] }])

      setResult(response)

      // Add to prompt history
      addToPromptHistory({
        prompt: `${currentTemplate.name}: ${prompt}`,
        response: response,
        type: "write",
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
        title: "Content Generated",
        description: "Your content is ready!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate content",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyResult = () => {
    navigator.clipboard.writeText(result)
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    })
  }

  const downloadResult = () => {
    const blob = new Blob([result], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${currentTemplate?.name.replace(" ", "_")}_${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Writing Assistant</h1>
          <p className="text-muted-foreground">Professional templates powered by AI</p>
        </div>
        <VoiceControls voiceEnabled={voiceEnabled} onVoiceToggle={setVoiceEnabled} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Template Selection & Form */}
        <div className="space-y-6">
          {/* Template Selection */}
          <Card className="glass border-0">
            <CardHeader>
              <CardTitle>Choose Template</CardTitle>
              <CardDescription>Select the type of content you want to create</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {templates.map((template) => (
                  <motion.div key={template.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant={selectedTemplate === template.id ? "secondary" : "outline"}
                      className="w-full h-auto p-4 flex flex-col items-center space-y-2"
                      onClick={() => {
                        setSelectedTemplate(template.id)
                        setFormData({})
                        setResult("")
                      }}
                    >
                      <template.icon className="w-6 h-6" />
                      <div className="text-center">
                        <div className="font-medium">{template.name}</div>
                        <div className="text-xs text-muted-foreground">{template.description}</div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Form Fields */}
          {currentTemplate && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="glass border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <currentTemplate.icon className="w-5 h-5" />
                    <span>{currentTemplate.name}</span>
                  </CardTitle>
                  <CardDescription>{currentTemplate.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentTemplate.fields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">{field.label}</label>
                        <VoiceControls
                          onTranscript={(text) => handleVoiceInput(field.name, text)}
                          voiceEnabled={false}
                          onVoiceToggle={() => {}}
                        />
                      </div>

                      {field.type === "input" && (
                        <Input
                          placeholder={field.placeholder}
                          value={formData[field.name] || ""}
                          onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        />
                      )}

                      {field.type === "textarea" && (
                        <Textarea
                          placeholder={field.placeholder}
                          value={formData[field.name] || ""}
                          onChange={(e) => handleFieldChange(field.name, e.target.value)}
                          rows={3}
                        />
                      )}

                      {field.type === "select" && (
                        <Select
                          value={formData[field.name] || ""}
                          onValueChange={(value) => handleFieldChange(field.name, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  ))}

                  <Button
                    onClick={generateContent}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {isLoading ? "Generating..." : "Generate Content"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Result */}
        <div className="space-y-6">
          <Card className="glass border-0 h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Generated Content</CardTitle>
                {result && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={copyResult}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadResult}>
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded shimmer" />
                  <div className="h-4 bg-muted rounded shimmer" />
                  <div className="h-4 bg-muted rounded shimmer w-3/4" />
                </div>
              ) : result ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
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
                      pre: ({ node, children, ...props }) => (
                        <SyntaxHighlighter style={oneDark} language="javascript" PreTag="div" {...props}>
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ),
                      p: ({ children }) => <p className="mb-3">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="ml-2">{children}</li>,
                      strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                      h1: ({ children }) => <h1 className="text-2xl font-bold mb-3">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-xl font-bold mb-3">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-lg font-bold mb-2">{children}</h3>,
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-gray-500 pl-4 italic mb-3">{children}</blockquote>
                      ),
                    }}
                  >
                    {result}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <PenTool className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a template and fill in the details to generate content</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
