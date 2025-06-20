"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Database, Lock, UserCheck, Globe } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="text-xl text-muted-foreground">Your privacy is our priority</p>
        <p className="text-sm text-muted-foreground">Last updated: December 2024</p>
      </div>

      {/* Overview */}
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Privacy Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            AI Services is committed to protecting your privacy and ensuring the security of your personal information.
            This policy explains how we collect, use, and protect your data when you use our AI-powered tools.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg glass">
              <Eye className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-medium">No Tracking</h3>
              <p className="text-xs text-muted-foreground">We don't track your browsing behavior</p>
            </div>
            <div className="text-center p-4 rounded-lg glass">
              <Database className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-medium">Local Storage</h3>
              <p className="text-xs text-muted-foreground">Data stored locally in your browser</p>
            </div>
            <div className="text-center p-4 rounded-lg glass">
              <Lock className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <h3 className="font-medium">Encrypted</h3>
              <p className="text-xs text-muted-foreground">All communications are encrypted</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Collection */}
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle>Information We Collect</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Information You Provide</h3>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Text inputs and prompts you enter into our AI tools</li>
              <li>• Images you upload for analysis</li>
              <li>• Documents you upload for summarization</li>
              <li>• Voice recordings when using voice features</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Automatically Collected Information</h3>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Browser type and version</li>
              <li>• Device information (for optimization purposes)</li>
              <li>• Usage patterns (to improve our services)</li>
              <li>• Error logs (for debugging and improvements)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* How We Use Data */}
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle>How We Use Your Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2 text-green-600">✓ What We Do</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Process your requests through AI models</li>
                <li>• Store chat history locally in your browser</li>
                <li>• Improve our AI responses and features</li>
                <li>• Provide voice input/output functionality</li>
                <li>• Debug technical issues</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2 text-red-600">✗ What We Don't Do</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Sell your data to third parties</li>
                <li>• Store conversations permanently</li>
                <li>• Use your data for advertising</li>
                <li>• Share personal information</li>
                <li>• Track you across other websites</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Storage */}
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle>Data Storage and Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Local Storage</h3>
            <p className="text-sm text-muted-foreground">
              Your chat history and preferences are stored locally in your browser using localStorage. This data never
              leaves your device unless you explicitly export it.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">AI Processing</h3>
            <p className="text-sm text-muted-foreground">
              When you interact with our AI tools, your inputs are sent to Google's Gemini AI service for processing.
              These requests are encrypted and processed according to Google's privacy policies.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Security Measures</h3>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• HTTPS encryption for all communications</li>
              <li>• No permanent storage of personal conversations</li>
              <li>• Regular security audits and updates</li>
              <li>• Minimal data collection principles</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Third Party Services */}
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle>Third-Party Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Google Gemini AI</h3>
            <p className="text-sm text-muted-foreground">
              We use Google's Gemini AI service to power our AI features. Your inputs are processed according to
              Google's AI services privacy policy. We recommend reviewing their privacy policy for more details.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Browser APIs</h3>
            <p className="text-sm text-muted-foreground">
              We use browser APIs for voice recognition and synthesis. These features require your explicit permission
              and are processed locally when possible.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Your Rights */}
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5" />
            <span>Your Rights and Controls</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Data Control</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Clear your chat history anytime</li>
                <li>• Export your data</li>
                <li>• Disable voice features</li>
                <li>• Control browser permissions</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Privacy Settings</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Manage voice permissions</li>
                <li>• Clear stored preferences</li>
                <li>• Disable data collection</li>
                <li>• Use incognito mode</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Contact Us</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            If you have questions about this privacy policy or how we handle your data, please contact us:
          </p>
          <div className="space-y-2 text-sm">
            <p>Email: privacy@aiservices.com</p>
            <p>Last Updated: December 2024</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
