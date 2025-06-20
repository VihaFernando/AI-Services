"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  MessageCircle,
  PenTool,
  Calendar,
  ImageIcon,
  FileText,
  Github,
  Twitter,
  Mail,
  Heart,
  Sparkles,
} from "lucide-react"

const footerLinks = {
  product: [
    { name: "AI Chat", href: "/chat", icon: MessageCircle },
    { name: "Writing Assistant", href: "/write", icon: PenTool },
    { name: "AI Planner", href: "/planner", icon: Calendar },
    { name: "Image Analysis", href: "/image", icon: ImageIcon },
    { name: "Document Summarizer", href: "/docs", icon: FileText },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Settings", href: "/settings" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
}

const socialLinks = [
  { name: "GitHub", href: "https://github.com", icon: Github },
  { name: "Twitter", href: "https://twitter.com", icon: Twitter },
  { name: "Email", href: "mailto:hello@aiservices.com", icon: Mail },
]

export function Footer() {
  return (
    <footer className="border-t glass mt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl">AI Services</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              Your intelligent assistant for writing, planning, analysis, and conversation. Powered by advanced AI with
              voice capabilities.
            </p>
            <div className="flex space-x-2">
              {socialLinks.map((social) => (
                <Button key={social.name} variant="ghost" size="sm" asChild>
                  <Link href={social.href} target="_blank" rel="noopener noreferrer">
                    <social.icon className="w-4 h-4" />
                    <span className="sr-only">{social.name}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2"
                  >
                    <link.icon className="w-3 h-3" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>© 2024 AI Services. All rights reserved.</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">Powered by advanced AI technology</span>
          </div>

          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-red-500 fill-current" />
            <span>by Vihanga Fernando</span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-8 border-t border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-muted-foreground">
            <div>
              <h4 className="font-medium text-foreground mb-2">🚀 Features</h4>
              <p>Advanced AI models, voice capabilities, multimodal chat, and intelligent document processing.</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">🔒 Privacy</h4>
              <p>Your data is secure and private. We don't store personal conversations or documents.</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">⚡ Performance</h4>
              <p>Lightning-fast responses powered by cutting-edge AI infrastructure and optimization.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
