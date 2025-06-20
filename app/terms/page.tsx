"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Scale, AlertTriangle, CheckCircle, XCircle, Users } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Terms of Service</h1>
        <p className="text-xl text-muted-foreground">Terms and conditions for using AI Services</p>
        <p className="text-sm text-muted-foreground">Last updated: December 2024</p>
      </div>

      {/* Overview */}
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Scale className="w-5 h-5" />
            <span>Agreement Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            By accessing and using AI Services, you agree to be bound by these Terms of Service. Please read them
            carefully before using our platform.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg glass">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-medium">Free to Use</h3>
              <p className="text-xs text-muted-foreground">No subscription required</p>
            </div>
            <div className="text-center p-4 rounded-lg glass">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-medium">Fair Use</h3>
              <p className="text-xs text-muted-foreground">Reasonable usage expected</p>
            </div>
            <div className="text-center p-4 rounded-lg glass">
              <FileText className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <h3 className="font-medium">Open Source</h3>
              <p className="text-xs text-muted-foreground">Transparent and community-driven</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acceptance */}
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle>1. Acceptance of Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            By accessing or using AI Services, you acknowledge that you have read, understood, and agree to be bound by
            these Terms of Service and our Privacy Policy.
          </p>
          <p className="text-sm text-muted-foreground">
            If you do not agree to these terms, please do not use our services.
          </p>
        </CardContent>
      </Card>

      {/* Service Description */}
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle>2. Service Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            AI Services provides AI-powered tools including but not limited to:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
            <li>• AI Chat - Conversational AI assistant</li>
            <li>• Writing Assistant - Content generation tools</li>
            <li>• AI Planner - Task and schedule planning</li>
            <li>• Image Analysis - AI-powered image understanding</li>
            <li>• Document Summarizer - Text analysis and summarization</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            These services are provided "as is" and we reserve the right to modify, suspend, or discontinue any part of
            the service at any time.
          </p>
        </CardContent>
      </Card>

      {/* User Responsibilities */}
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle>3. User Responsibilities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2 text-green-600 flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Acceptable Use</span>
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use services for lawful purposes only</li>
                <li>• Respect intellectual property rights</li>
                <li>• Provide accurate information</li>
                <li>• Use reasonable bandwidth and resources</li>
                <li>• Report bugs and security issues</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2 text-red-600 flex items-center space-x-2">
                <XCircle className="w-4 h-4" />
                <span>Prohibited Activities</span>
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Generate harmful or illegal content</li>
                <li>• Attempt to reverse engineer our services</li>
                <li>• Spam or abuse our systems</li>
                <li>• Violate others' privacy or rights</li>
                <li>• Distribute malware or viruses</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Content */}
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle>4. AI-Generated Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-600 mb-1">Important Notice</h3>
                <p className="text-sm text-muted-foreground">
                  AI-generated content may not always be accurate, complete, or suitable for your specific needs. Always
                  verify important information independently.
                </p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Content Ownership</h3>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• You retain ownership of content you input</li>
              <li>• AI-generated content is provided without warranty</li>
              <li>• You are responsible for how you use AI-generated content</li>
              <li>• We don't claim ownership of your inputs or outputs</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Limitations */}
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle>5. Limitations and Disclaimers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Service Availability</h3>
            <p className="text-sm text-muted-foreground">
              We strive to maintain high availability but cannot guarantee uninterrupted service. Maintenance, updates,
              or technical issues may cause temporary disruptions.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Accuracy Disclaimer</h3>
            <p className="text-sm text-muted-foreground">
              AI responses are generated based on training data and may contain inaccuracies, biases, or outdated
              information. Use AI-generated content as a starting point, not as definitive truth.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Third-Party Services</h3>
            <p className="text-sm text-muted-foreground">
              Our services rely on third-party AI providers (Google Gemini). Their availability and performance may
              affect our services.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle>6. Privacy and Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and
            protect your information.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Data Processing</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Inputs processed by AI services</li>
                <li>• Local storage in your browser</li>
                <li>• No permanent conversation storage</li>
                <li>• Encrypted data transmission</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Your Rights</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Clear your data anytime</li>
                <li>• Export your information</li>
                <li>• Control privacy settings</li>
                <li>• Request data deletion</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Changes */}
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle>7. Changes to Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            We may update these Terms of Service from time to time. When we do, we will post the updated terms on this
            page and update the "Last updated" date.
          </p>
          <p className="text-sm text-muted-foreground">
            Continued use of our services after changes constitutes acceptance of the new terms.
          </p>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle>8. Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            If you have questions about these Terms of Service, please contact us:
          </p>
          <div className="space-y-2 text-sm">
            <p>Email: legal@aiservices.com</p>
            <p>Support: support@aiservices.com</p>
            <p>Last Updated: December 2024</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
