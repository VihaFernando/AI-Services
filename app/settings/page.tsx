"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { getPromptHistory, clearPromptHistory, clearChatHistory } from "@/lib/storage"
import { speechManager } from "@/lib/speech"
import { useToast } from "@/hooks/use-toast"
import { Settings, Trash2, Download, Volume2, Mic, Palette, History } from "lucide-react"

export default function SettingsPage() {
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [promptHistory, setPromptHistory] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const history = getPromptHistory()
    setPromptHistory(history)
  }, [])

  const testVoice = async () => {
    if (!speechManager.isSynthesisSupported) {
      toast({
        title: "Voice Not Supported",
        description: "Your browser doesn't support text-to-speech",
        variant: "destructive",
      })
      return
    }

    try {
      await speechManager.speak(
        "Hello! This is a test of the voice feature. I'm your AI assistant and I'm ready to help you.",
      )
      toast({
        title: "Voice Test",
        description: "Voice test completed successfully",
      })
    } catch (error) {
      toast({
        title: "Voice Error",
        description: "Failed to test voice feature",
        variant: "destructive",
      })
    }
  }

  const exportHistory = () => {
    const history = getPromptHistory()
    const dataStr = JSON.stringify(history, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `ai-services-history-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "History Exported",
      description: "Your prompt history has been downloaded",
    })
  }

  const clearAllHistory = () => {
    clearPromptHistory()
    clearChatHistory()
    setPromptHistory([])
    toast({
      title: "History Cleared",
      description: "All chat and prompt history has been cleared",
    })
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Customize your AI Services experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <div className="space-y-6">
          <Card className="glass border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>Appearance</span>
              </CardTitle>
              <CardDescription>Customize the look and feel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Theme</p>
                  <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
                </div>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Volume2 className="w-5 h-5" />
                <span>Voice Settings</span>
              </CardTitle>
              <CardDescription>Configure voice input and output</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Voice Responses</p>
                  <p className="text-sm text-muted-foreground">Enable AI to speak responses aloud</p>
                </div>
                <Switch checked={voiceEnabled} onCheckedChange={setVoiceEnabled} />
              </div>

              <Separator />

              <div className="space-y-3">
                <p className="font-medium">Voice Features</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-3 rounded-lg glass">
                    <Mic className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                    <p className="text-sm font-medium">Speech Input</p>
                    <p className="text-xs text-muted-foreground">
                      {speechManager.isRecognitionSupported ? "Supported" : "Not Available"}
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-lg glass">
                    <Volume2 className="w-6 h-6 mx-auto mb-2 text-green-500" />
                    <p className="text-sm font-medium">Speech Output</p>
                    <p className="text-xs text-muted-foreground">
                      {speechManager.isSynthesisSupported ? "Supported" : "Not Available"}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={testVoice}
                disabled={!speechManager.isSynthesisSupported}
                className="w-full"
              >
                Test Voice
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Data Management */}
        <div className="space-y-6">
          <Card className="glass border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <History className="w-5 h-5" />
                <span>Data Management</span>
              </CardTitle>
              <CardDescription>Manage your chat and prompt history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 rounded-lg glass">
                  <p className="text-2xl font-bold text-blue-500">{promptHistory.length}</p>
                  <p className="text-sm text-muted-foreground">Saved Prompts</p>
                </div>
                <div className="p-3 rounded-lg glass">
                  <p className="text-2xl font-bold text-green-500">
                    {promptHistory.reduce((acc, item) => acc + item.response.length, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Characters Generated</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={exportHistory}
                  className="w-full"
                  disabled={promptHistory.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export History
                </Button>

                <Button
                  variant="destructive"
                  onClick={clearAllHistory}
                  className="w-full"
                  disabled={promptHistory.length === 0}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All History
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-0">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest AI interactions</CardDescription>
            </CardHeader>
            <CardContent>
              {promptHistory.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {promptHistory.slice(0, 10).map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-3 rounded-lg glass"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium capitalize bg-primary/20 px-2 py-1 rounded">
                          {item.type}
                        </span>
                        <span className="text-xs text-muted-foreground">{formatDate(item.timestamp)}</span>
                      </div>
                      <p className="text-sm truncate">{item.prompt}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No activity yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* System Info */}
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>System Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium">Browser</p>
              <p className="text-muted-foreground">{navigator.userAgent.split(" ")[0]}</p>
            </div>
            <div>
              <p className="font-medium">Platform</p>
              <p className="text-muted-foreground">{navigator.platform}</p>
            </div>
            <div>
              <p className="font-medium">Language</p>
              <p className="text-muted-foreground">{navigator.language}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
