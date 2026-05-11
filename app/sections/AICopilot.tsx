"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { chatResponsesByLocale, findResponse } from "@/lib/chat-responses";
import { useI18n } from "@/lib/i18n-context";
import { AnimatedSection } from "@/app/components/AnimatedSection";
import { Send, User, Bot, Sparkles } from "lucide-react";
import { AsondoMark } from "../components/AsondoLogo";

interface Message {
  role: "user" | "assistant";
  content: string;
  followUp?: string[];
}

// Max number of past turns we send to the Gemini API for context.
// Keep this small to limit tokens and latency.
const HISTORY_LIMIT = 10;

export function AICopilot() {
  const { t, locale } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  // Track if user has interacted with the chat. Prevents the auto-scroll
  // that runs when `messages` is initially populated (locale-driven welcome
  // message) from pulling the whole page down to the chat section.
  const hasUserInteracted = useRef(false);

  useEffect(() => {
    const welcome = chatResponsesByLocale[locale][0];
    setMessages([
      {
        role: "assistant",
        content: welcome.response,
        followUp: welcome.followUp,
      },
    ]);
  }, [locale]);

  useEffect(() => {
    if (!hasUserInteracted.current) return;
    const container = messagesContainerRef.current;
    if (!container) return;
    // Scroll only the chat container itself, never the whole page.
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    hasUserInteracted.current = true;
    setInput("");
    setIsTyping(true);

    // Snapshot the conversation BEFORE adding the new user message,
    // so the API receives the prior turns as "history" and the new
    // user turn as "message".
    const priorHistory = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-HISTORY_LIMIT)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: priorHistory,
          locale,
        }),
      });

      const data = (await res.json()) as { reply?: string; error?: string };
      // The server always returns a `reply` (either Gemini or static KB).
      // If for any reason `reply` is missing, fall back to a local
      // static-KB lookup so the user still sees a useful Asondo answer.
      const reply = data.reply ?? findResponse(trimmed, locale).response;

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("[AICopilot] fetch error, using local KB:", err);
      // Network failure (offline, blocked). Do NOT show a "service
      // unavailable" toast — fall back to the local knowledge base so the
      // visitor still gets a useful Asondo-scoped answer.
      const localReply = findResponse(trimmed, locale).response;
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: localReply },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <section id="ai-copilot" className="relative py-24 lg:py-32 bg-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-radial from-[#FEF3E7] to-transparent opacity-60 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3E7] border border-[#E8833D]/20 text-[#D06B1F] text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              AI Assistant
            </div>
            <h2 className="text-headline text-[#1A1A1A] mb-5 text-balance">
              {t.ai.title}
            </h2>
            <p className="text-lg text-[#6B7280] leading-relaxed">{t.ai.subtitle}</p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="relative">
              {/* Glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#E8833D]/15 via-[#F2B83E]/15 to-[#D06B1F]/15 rounded-3xl blur-2xl" />

              <div className="relative bg-white rounded-3xl border border-[#E8833D]/15 shadow-2xl shadow-[#E8833D]/10 overflow-hidden">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-[#1F3D2F] to-[#0F2619] px-6 py-5 overflow-hidden">
                  <div className="absolute -top-8 -right-8 w-40 h-40 bg-[#F2B83E]/20 rounded-full blur-2xl" />
                  <div className="relative flex items-center gap-3">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#E8833D] to-[#D06B1F] flex items-center justify-center shadow-lg">
                        <AsondoMark size={26} color="#FFFFFF" />
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#22C55E] border-2 border-[#1F3D2F]" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{t.ai.assistantName}</h3>
                      <p className="text-xs text-[#F2B83E] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                        {t.ai.replySpeed}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div
                  ref={messagesContainerRef}
                  className="h-[440px] overflow-y-auto p-6 space-y-4 bg-[#FDFBF7]"
                >
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E8833D] to-[#D06B1F] flex items-center justify-center shrink-0 shadow-md">
                          <Bot className="w-4 h-4 text-white" strokeWidth={2.5} />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                          msg.role === "user"
                            ? "bg-gradient-to-br from-[#E8833D] to-[#D06B1F] text-white rounded-tr-sm"
                            : "bg-white text-[#1A1A1A] rounded-tl-sm border border-[#E8833D]/10"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>

                        {msg.followUp && msg.followUp.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-[#E8833D]/10">
                            {msg.followUp.map((q) => (
                              <button
                                key={q}
                                onClick={() => sendMessage(q)}
                                className="text-xs px-3 py-1.5 rounded-full bg-[#FEF3E7] text-[#D06B1F] hover:bg-[#E8833D] hover:text-white transition-all font-medium"
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {msg.role === "user" && (
                        <div className="w-9 h-9 rounded-xl bg-[#1F3D2F] flex items-center justify-center shrink-0 shadow-md">
                          <User className="w-4 h-4 text-[#F2B83E]" strokeWidth={2.5} />
                        </div>
                      )}
                    </motion.div>
                  ))}

                  <AnimatePresence>
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex gap-3"
                      >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E8833D] to-[#D06B1F] flex items-center justify-center shrink-0 shadow-md">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-white p-4 rounded-2xl rounded-tl-sm border border-[#E8833D]/10">
                          <div className="flex gap-1.5">
                            <span className="w-2 h-2 bg-[#E8833D] rounded-full animate-bounce" />
                            <span className="w-2 h-2 bg-[#E8833D] rounded-full animate-bounce [animation-delay:120ms]" />
                            <span className="w-2 h-2 bg-[#E8833D] rounded-full animate-bounce [animation-delay:240ms]" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Quick questions */}
                <div className="px-6 pt-3 pb-2 bg-white border-t border-[#E8833D]/10">
                  <div className="flex flex-wrap gap-2">
                    {t.ai.quickQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="text-xs px-3 py-1.5 rounded-full bg-[#FEF3E7] text-[#D06B1F] hover:bg-[#E8833D] hover:text-white transition-all font-medium border border-[#E8833D]/20"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <div className="p-4 bg-white border-t border-[#E8833D]/10">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      sendMessage(input);
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={t.ai.placeholder}
                      disabled={isTyping}
                      className="flex-1 h-12 bg-[#FDFBF7] border-[#E8833D]/20 focus:border-[#E8833D] focus:ring-[#E8833D]/20 rounded-full px-5 disabled:opacity-60"
                    />
                    <button
                      type="submit"
                      disabled={isTyping || !input.trim()}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E8833D] to-[#D06B1F] text-white flex items-center justify-center shadow-lg shadow-[#E8833D]/30 hover:shadow-xl hover:shadow-[#E8833D]/40 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
