export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
  images?: string[]
}

export interface PromptHistory {
  id: string
  prompt: string
  response: string
  timestamp: number
  type: "chat" | "write" | "image" | "docs" | "planner"
}

export function saveToStorage<T>(key: string, data: T): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data))
  }
}

export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return defaultValue
      }
    }
  }
  return defaultValue
}

export function saveChatHistory(messages: ChatMessage[]): void {
  saveToStorage("chat-history", messages)
}

export function getChatHistory(): ChatMessage[] {
  return getFromStorage<ChatMessage[]>("chat-history", [])
}

export function savePromptHistory(history: PromptHistory[]): void {
  saveToStorage("prompt-history", history)
}

export function getPromptHistory(): PromptHistory[] {
  return getFromStorage<PromptHistory[]>("prompt-history", [])
}

export function addToPromptHistory(item: Omit<PromptHistory, "id" | "timestamp">): void {
  const history = getPromptHistory()
  const newItem: PromptHistory = {
    ...item,
    id: Date.now().toString(),
    timestamp: Date.now(),
  }
  history.unshift(newItem)
  savePromptHistory(history.slice(0, 100)) // Keep only last 100 items
}

export function clearChatHistory(): void {
  saveToStorage("chat-history", [])
}

export function clearPromptHistory(): void {
  saveToStorage("prompt-history", [])
}
