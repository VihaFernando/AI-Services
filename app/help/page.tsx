"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  PenTool,
  Calendar,
  ImageIcon,
  FileText,
  Search,
  HelpCircle,
  Book,
  Video,
  Mail,
} from "lucide-react"
import Link from "next/link"

const faqs = [
  {
    question: "How do I get started with AI Services?",
    answer:
      "Simply navigate to any of our AI tools from the main menu. No account required! Start with the AI Chat for general conversations, or try our specialized tools like Writing Assistant or Document Summarizer.",
  },
  {
    question: "Is my data secure and private?",
    answer:
      "Yes! We prioritize your privacy. Conversations and documents are processed securely and are not stored permanently. We use industry-standard encryption and don't share your data with third parties.",
  },
  {
    question: "How do I use voice features?",
    answer:
      "Click the microphone icon in any tool to enable voice input. Click the speaker icon to enable voice responses. Make sure your browser has microphone permissions enabled.",
  },
  {
    question: "What file formats are supported?",
    answer:
      "For images: JPG, PNG, GIF, WebP. For documents: Plain text (.txt) files. You can also paste text directly into any text field.",
  },
  {
    question: "Why isn't voice working?",
    answer:
      "Voice features require browser permissions. Make sure you've allowed microphone access and are using a supported browser (Chrome, Firefox, Safari, Edge).",
  },
  {
    question: "Can I save my conversations?",
    answer:
      "Yes! Your chat history and prompt history are automatically saved locally in your browser. You can export or clear this data in Settings.",
  },
  {
    question: "What AI model powers these tools?",
    answer:
      "We use Google's Gemini AI model, which provides advanced natural language understanding, image analysis, and multimodal capabilities.",
  },
  {
    question: "Are there usage limits?",
    answer:
      "Currently, there are no strict usage limits. However, very large documents or excessive requests may be rate-limited to ensure fair usage for all users.",
  },
]

const tools = [
  {
    name: "AI Chat",
    icon: MessageCircle,
    description: "Natural conversations with AI, supports text and images",
    href: "/chat",
    tips: [
      "Use voice input for hands-free chatting",
      "Upload images to ask questions about them",
      "Chat history is saved automatically",
    ],
  },
  {
    name: "Writing Assistant",
    icon: PenTool,
    description: "Professional templates for blogs, emails, resumes, and more",
    href: "/write",
    tips: [
      "Choose the right template for your content type",
      "Fill in all required fields for best results",
      "Use voice input for any text field",
    ],
  },
  {
    name: "AI Planner",
    icon: Calendar,
    description: "Smart daily planning with AI-generated tasks and goals",
    href: "/planner",
    tips: [
      "Be specific about your goals",
      "Include time constraints and priorities",
      "Check off completed tasks to track progress",
    ],
  },
  {
    name: "Image Analysis",
    icon: ImageIcon,
    description: "Upload images and ask questions about their content",
    href: "/image",
    tips: [
      "Use clear, high-quality images",
      "Try the quick question buttons",
      "Ask specific questions for detailed answers",
    ],
  },
  {
    name: "Document Summarizer",
    icon: FileText,
    description: "Summarize and analyze any text or document",
    href: "/docs",
    tips: [
      "Paste text directly or upload .txt files",
      "Use the Q&A feature for specific questions",
      "Try the quick questions for common analyses",
    ],
  },
]

export default function HelpPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Help Center</h1>
        <p className="text-xl text-muted-foreground">Get the most out of AI Services</p>
      </div>

      {/* Search */}
      <Card className="glass border-0">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search for help topics..." className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Book className="w-5 h-5" />
              <span>Getting Started</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">New to AI Services? Start here!</p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/chat">Try AI Chat</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="glass border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Video className="w-5 h-5" />
              <span>Video Tutorials</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Watch how to use each feature</p>
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card className="glass border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>Contact Support</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Need personal assistance?</p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="mailto:support@aiservices.com">Email Us</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Tool Guides */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Tool Guides</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <Card key={tool.name} className="glass border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <tool.icon className="w-5 h-5" />
                  <span>{tool.name}</span>
                  <Badge variant="secondary">Guide</Badge>
                </CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Tips & Tricks:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {tool.tips.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-primary">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={tool.href}>Try {tool.name}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        <Card className="glass border-0">
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* Contact */}
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5" />
            <span>Still Need Help?</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Can't find what you're looking for? Our support team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link href="mailto:support@aiservices.com">Email Support</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/settings">Check Settings</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
