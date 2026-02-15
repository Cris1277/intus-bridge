import type { JournalEntry, CheckIn, Mood, Message } from "@/lib/types"
import {
  journalEntries,
  checkIns,
  tools,
  scenarios,
  mockResponses,
} from "@/data/mock"

// ── Journal stubs ──

export async function createJournalEntry(data: {
  title: string
  content: string
  mood: Mood
  tags: string[]
}): Promise<JournalEntry> {
  // TODO: connect to backend
  const entry: JournalEntry = {
    id: `j${Date.now()}`,
    userId: "u1",
    title: data.title,
    content: data.content,
    mood: data.mood,
    tags: data.tags,
    createdAt: new Date().toISOString(),
  }
  journalEntries.unshift(entry)
  return entry
}

export async function listJournalEntries(): Promise<JournalEntry[]> {
  // TODO: connect to backend
  return [...journalEntries]
}

export async function getJournalEntry(
  id: string
): Promise<JournalEntry | undefined> {
  // TODO: connect to backend
  return journalEntries.find((e) => e.id === id)
}

// ── Check-in stubs ──

export async function saveCheckIn(data: {
  mood: Mood
  stressLevel: number
  energyLevel: number
  note?: string
}): Promise<CheckIn> {
  // TODO: connect to backend
  const entry: CheckIn = {
    id: `c${Date.now()}`,
    userId: "u1",
    mood: data.mood,
    stressLevel: data.stressLevel,
    energyLevel: data.energyLevel,
    note: data.note,
    createdAt: new Date().toISOString(),
  }
  checkIns.unshift(entry)
  return entry
}

// ── Tools stubs ──

export async function listTools() {
  // TODO: connect to backend
  return [...tools]
}

export async function getTool(id: string) {
  // TODO: connect to backend
  return tools.find((t) => t.id === id)
}

// ── Scenarios stubs ──

export async function listScenarios() {
  // TODO: connect to backend
  return [...scenarios]
}

export async function getScenario(id: string) {
  // TODO: connect to backend
  return scenarios.find((s) => s.id === id)
}

// ── Chat stubs ──

export async function sendChatMessage(content: string): Promise<Message> {
  // TODO: connect to AI backend
  await new Promise((r) => setTimeout(r, 800))

  const hasSafetyKeywords = /hacerme dano|suicid|morir|no puedo mas/i.test(
    content
  )

  const response =
    mockResponses[Math.floor(Math.random() * mockResponses.length)]

  return {
    id: `m${Date.now()}`,
    conversationId: "conv1",
    role: "assistant",
    content: hasSafetyKeywords
      ? "Escucho lo que me dices y me preocupo por ti. Si estas pensando en hacerte dano, por favor llama al 024 o al 112 ahora mismo. No estas solo/a. ¿Puedo ayudarte a encontrar recursos de ayuda?"
      : response,
    createdAt: new Date().toISOString(),
    safetyFlags: hasSafetyKeywords ? ["safety_concern"] : undefined,
  }
}

// ── Data controls stubs ──

export async function exportUserData(): Promise<{ success: boolean }> {
  // TODO: connect to backend
  return { success: true }
}

export async function deleteUserData(): Promise<{ success: boolean }> {
  // TODO: connect to backend
  return { success: true }
}
