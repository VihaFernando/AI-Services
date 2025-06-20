"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { VoiceControls } from "@/components/voice-controls"
import { callGemini } from "@/lib/gemini"
import { addToPromptHistory } from "@/lib/storage"
import { speechManager } from "@/lib/speech"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock, Target, CheckCircle, Circle, Sparkles } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"

interface Task {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  estimatedTime: string
  completed: boolean
}

interface PlanData {
  goals: string
  timeAvailable: string
  priorities: string
  constraints: string
}

export default function PlannerPage() {
  const [planData, setPlanData] = useState<PlanData>({
    goals: "",
    timeAvailable: "",
    priorities: "",
    constraints: "",
  })
  const [tasks, setTasks] = useState<Task[]>([])
  const [suggestions, setSuggestions] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const { toast } = useToast()

  const generatePlan = async () => {
    if (!planData.goals.trim()) {
      toast({
        title: "Missing Information",
        description: "Please describe your goals for today",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const prompt = `Create a detailed daily plan based on these inputs:

Goals: ${planData.goals}
Available Time: ${planData.timeAvailable || "Full day"}
Priorities: ${planData.priorities || "Not specified"}
Constraints: ${planData.constraints || "None"}

Please provide:
1. A list of specific, actionable tasks with estimated time for each
2. Priority levels (high/medium/low) for each task
3. Brief descriptions for each task
4. General suggestions and tips for the day

Format the tasks as a JSON array with this structure:
[
  {
    "title": "Task title",
    "description": "Brief description",
    "priority": "high|medium|low",
    "estimatedTime": "30 minutes"
  }
]

After the JSON, provide general suggestions and tips.`

      const response = await callGemini([{ role: "user", parts: [{ text: prompt }] }])

      // Try to extract JSON from response
      const jsonMatch = response.match(/\[[\s\S]*?\]/)

      if (jsonMatch) {
        try {
          const tasksData = JSON.parse(jsonMatch[0])
          const newTasks: Task[] = tasksData.map((task: any, index: number) => ({
            id: `task-${Date.now()}-${index}`,
            title: task.title,
            description: task.description,
            priority: task.priority,
            estimatedTime: task.estimatedTime,
            completed: false,
          }))
          setTasks(newTasks)

          // Extract suggestions (text after JSON)
          const suggestionsText = response.replace(jsonMatch[0], "").trim()
          setSuggestions(suggestionsText)
        } catch (error) {
          // If JSON parsing fails, treat entire response as suggestions
          setSuggestions(response)
          setTasks([])
        }
      } else {
        setSuggestions(response)
        setTasks([])
      }

      // Add to prompt history
      addToPromptHistory({
        prompt: `Daily Plan: ${planData.goals}`,
        response: response,
        type: "planner",
      })

      // Speak result if voice is enabled
      if (voiceEnabled) {
        try {
          const speakText =
            tasks.length > 0
              ? `I've created a plan with ${tasks.length} tasks for you. ${suggestions.slice(0, 200)}...`
              : suggestions.slice(0, 300)
          await speechManager.speak(speakText)
        } catch (error) {
          console.error("Speech error:", error)
        }
      }

      toast({
        title: "Plan Generated",
        description: "Your daily plan is ready!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate plan",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTask = (taskId: string) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500 border-red-500"
      case "medium":
        return "text-yellow-500 border-yellow-500"
      case "low":
        return "text-green-500 border-green-500"
      default:
        return "text-gray-500 border-gray-500"
    }
  }

  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Planner</h1>
          <p className="text-muted-foreground">Let AI create your perfect daily plan</p>
        </div>
        <VoiceControls voiceEnabled={voiceEnabled} onVoiceToggle={setVoiceEnabled} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <Card className="glass border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Plan Details</span>
              </CardTitle>
              <CardDescription>Tell me about your day</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Goals for Today *</label>
                <Textarea
                  placeholder="What do you want to accomplish today?"
                  value={planData.goals}
                  onChange={(e) => setPlanData((prev) => ({ ...prev, goals: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Available Time</label>
                <Input
                  placeholder="e.g., 8 hours, morning only, 2-6 PM"
                  value={planData.timeAvailable}
                  onChange={(e) => setPlanData((prev) => ({ ...prev, timeAvailable: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Priorities</label>
                <Textarea
                  placeholder="What's most important to focus on?"
                  value={planData.priorities}
                  onChange={(e) => setPlanData((prev) => ({ ...prev, priorities: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Constraints</label>
                <Textarea
                  placeholder="Any limitations or fixed appointments?"
                  value={planData.constraints}
                  onChange={(e) => setPlanData((prev) => ({ ...prev, constraints: e.target.value }))}
                  rows={2}
                />
              </div>

              <Button
                onClick={generatePlan}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Creating Plan...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Generate Plan</span>
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Tasks & Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress */}
          {totalTasks > 0 && (
            <Card className="glass border-0">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {completedTasks}/{totalTasks} tasks completed
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tasks List */}
          {tasks.length > 0 && (
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Today's Tasks</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      task.completed ? "bg-green-500/10 border-green-500/20" : "glass border-white/10"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <button onClick={() => toggleTask(task.id)} className="mt-1">
                        {task.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground hover:text-green-500 transition-colors" />
                        )}
                      </button>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                            {task.title}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}
                            >
                              {task.priority}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {task.estimatedTime}
                            </span>
                          </div>
                        </div>
                        <p className={`text-sm text-muted-foreground ${task.completed ? "line-through" : ""}`}>
                          {task.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Suggestions */}
          {suggestions && (
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>AI Suggestions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        return (
                          <code className="bg-gray-700 px-1 py-0.5 rounded text-sm" {...props}>
                            {children}
                          </code>
                        )
                      },
                      pre({ node, children, ...props }) {
                        return (
                          <pre className="bg-gray-700 rounded-md p-4 overflow-auto" {...props}>
                            {children}
                          </pre>
                        )
                      },
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "")
                        return !inline && match ? (
                          <SyntaxHighlighter
                            children={String(children).replace(/\n$/, "")}
                            style={dracula}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          />
                        ) : (
                          <code className={className} {...props}>
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
                    {suggestions}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!isLoading && tasks.length === 0 && !suggestions && (
            <Card className="glass border-0">
              <CardContent className="text-center py-12">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Ready to Plan Your Day?</h3>
                <p className="text-muted-foreground">
                  Fill in your goals and let AI create a personalized daily plan for you
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
