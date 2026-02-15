// ── IntusBridge Entity Types ──

export type Mood = "calm" | "ok" | "stressed" | "anxious" | "sad" | "angry"

export interface User {
  id: string
  name: string
  email: string
}

export interface JournalEntry {
  id: string
  userId: string
  title: string
  content: string
  mood: Mood
  tags: string[]
  createdAt: string
}

export interface CheckIn {
  id: string
  userId: string
  mood: Mood
  stressLevel: number // 1-10
  energyLevel: number // 1-10
  note?: string
  createdAt: string
}

export type ToolType = "breathing" | "grounding" | "reframe" | "selftalk"

export interface Tool {
  id: string
  title: string
  type: ToolType
  description: string
  durationMin: number
  steps: string[]
}

export type ScenarioType = "bullying_school" | "bullying_work" | "anxiety" | "stress"

export interface Scenario {
  id: string
  type: ScenarioType
  title: string
  description: string
  steps: string[]
  createdAt: string
}

export interface Conversation {
  id: string
  userId: string
  createdAt: string
}

export type MessageRole = "user" | "assistant"

export interface Message {
  id: string
  conversationId: string
  role: MessageRole
  content: string
  createdAt: string
  safetyFlags?: string[]
}

export type ResourceType = "emergency" | "professional" | "education"

export interface ResourceLink {
  id: string
  title: string
  description: string
  type: ResourceType
  phone?: string
  url?: string
}
