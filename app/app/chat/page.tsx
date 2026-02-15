"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Shield, Phone, AlertTriangle, Loader2 } from "lucide-react";
import { SafetyBanner } from "@/components/safety-banner";
import { sendChatMessage } from "@/lib/stubs";
import { mockMessages } from "@/data/mock";
import type { Message } from "@/lib/types";

const quickPrompts = [
  "Quiero calmarme",
  "Quiero contar lo que pasó",
  "Necesito poner límites",
  "Me siento solo/a",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([...mockMessages]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [safeMode, setSafeMode] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  async function handleSend(text?: string) {
    const content = text || input.trim();
    if (!content) return;
    setInput("");

    const userMsg: Message = {
      id: `m${Date.now()}`,
      conversationId: "conv1",
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const response = await sendChatMessage(content);

    if (response.safetyFlags?.includes("safety_concern")) {
      setShowSafetyModal(true);
    }

    setIsTyping(false);
    setMessages((prev) => [...prev, response]);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col">
      {/* Safety banner */}
      <SafetyBanner variant="chat" />

      {/* Safe mode + emergency */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <button
          onClick={() => setSafeMode(!safeMode)}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            safeMode
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-muted"
          }`}
        >
          <Shield className="h-3.5 w-3.5" />
          Modo seguro {safeMode ? "activado" : "desactivado"}
        </button>
        <a
          href="tel:112"
          className="inline-flex items-center gap-1 rounded-full bg-emergency px-3 py-1.5 text-xs font-bold text-emergency-foreground hover:opacity-90"
        >
          <Phone className="h-3.5 w-3.5" />
          Ayuda urgente
        </a>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "rounded-br-md bg-primary text-primary-foreground"
                    : "rounded-bl-md bg-secondary text-secondary-foreground"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-secondary px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Escribiendo...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick prompts */}
      {messages.length <= 3 && (
        <div className="flex flex-wrap gap-2 border-t border-border px-4 py-3">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-muted"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe lo que necesites..."
            rows={1}
            className="flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-40"
            aria-label="Enviar mensaje"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Safety modal */}
      {showSafetyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-2 text-emergency">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-lg font-bold">¿Necesitas ayuda inmediata?</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Si estás en peligro inmediato o piensas en hacerte daño, por favor
              llama a uno de estos números ahora mismo.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <a
                href="tel:112"
                className="flex items-center justify-center gap-2 rounded-lg bg-emergency px-4 py-3 text-sm font-bold text-emergency-foreground hover:opacity-90"
              >
                <Phone className="h-4 w-4" />
                Llamar al 112 (Emergencias)
              </a>
              <a
                href="tel:024"
                className="flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-bold text-accent-foreground hover:opacity-90"
              >
                <Phone className="h-4 w-4" />
                Llamar al 024 (Atención suicida)
              </a>
            </div>
            <button
              onClick={() => setShowSafetyModal(false)}
              className="mt-3 w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              Estoy bien, continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
