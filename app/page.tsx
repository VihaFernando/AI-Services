"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, PenTool, Calendar, ImageIcon, FileText, Sparkles, Mic, Volume2, Zap } from "lucide-react"

const features = [
  {
    icon: MessageCircle,
    title: "AI Chat",
    description: "Natural conversations with advanced AI, supporting text and images",
    href: "/chat",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: PenTool,
    title: "Writing Assistant",
    description: "Professional templates for blogs, emails, resumes, and more",
    href: "/write",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Calendar,
    title: "AI Planner",
    description: "Smart daily planning with AI-generated tasks and goals",
    href: "/planner",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: ImageIcon,
    title: "Image Analysis",
    description: "Upload images and ask questions about their content",
    href: "/image",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: FileText,
    title: "Document Summarizer",
    description: "Summarize and analyze any text or document instantly",
    href: "/docs",
    color: "from-indigo-500 to-purple-500",
  },
]

const highlights = [
  { icon: Mic, text: "Voice Input & Output" },
  { icon: Volume2, text: "Natural Speech" },
  { icon: Sparkles, text: "Multimodal AI" },
  { icon: Zap, text: "Real-time Processing" },
]

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-8"
      >
        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
            className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            AI Services
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Your intelligent assistant for writing, planning, analysis, and conversation. Powered by advanced AI with
            voice capabilities.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {highlights.map((highlight, index) => (
            <motion.div
              key={highlight.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-center space-x-2 glass rounded-full px-4 py-2"
            >
              <highlight.icon className="w-4 h-4 text-purple-400" />
              <span className="text-sm">{highlight.text}</span>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Link href="/chat">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg"
            >
              Get Started
            </Button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Features Grid */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="space-y-8"
      >
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful AI Tools</h2>
          <p className="text-muted-foreground text-lg">Everything you need to boost your productivity with AI</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={feature.href}>
                <Card className="glass border-0 hover:shadow-2xl transition-all duration-300 h-full group">
                  <CardHeader>
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="text-center space-y-6 py-16"
      >
        <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to experience the future of AI?</h3>
          <p className="text-muted-foreground mb-6">
            Start with any tool and discover how AI can transform your workflow
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
              >
                Start Chatting
              </Button>
            </Link>
            <Link href="/write">
              <Button size="lg" variant="outline" className="bg-black text-white border-white/20">
                Try Writing Tools
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
