import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildSystemPrompt } from "@/lib/asondo-knowledge";
import type { Locale } from "@/lib/translations";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { findResponse } from "@/lib/chat-responses";

// Run on the Node.js runtime (Gemini SDK needs Node, not Edge).
export const runtime = "nodejs";
// Always run dynamically; do not pre-render this route.
export const dynamic = "force-dynamic";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  message: string;
  history?: ChatMessage[];
  locale?: Locale;
}

const MODEL_NAME = "gemini-2.5-flash";
const MAX_MESSAGE_LENGTH = 4000;
const MAX_HISTORY_TURNS = 12;

// Per-IP throttle. Keeps casual bot/abuse load below the Gemini free tier
// (10 RPM for gemini-2.5-flash). Conservative: 6 chat messages per minute
// and a longer 30-per-hour cap for sustained sessions.
const RATE_LIMIT_PER_MINUTE = 6;
const RATE_LIMIT_PER_HOUR = 30;

/**
 * Helper: build a graceful reply using the static knowledge base.
 * Used when Gemini is not configured OR when it errors out, so the
 * assistant always returns a useful Asondo-scoped answer instead of
 * a "service unavailable" message.
 */
function buildStaticReply(message: string, locale: Locale): string {
  const match = findResponse(message, locale);
  return match.response;
}

export async function POST(req: NextRequest) {
  // 1. Rate-limit by client IP (applies to both Gemini and static replies
  //    to keep abuse load low).
  const ip = getClientIp(req);
  const perMinute = rateLimit(`chat:1m:${ip}`, {
    windowMs: 60_000,
    max: RATE_LIMIT_PER_MINUTE,
  });
  if (!perMinute.allowed) {
    return NextResponse.json(
      {
        error: "rate_limited",
        retryAfterSeconds: Math.ceil(perMinute.retryAfterMs / 1000),
      },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(perMinute.retryAfterMs / 1000).toString(),
        },
      }
    );
  }
  const perHour = rateLimit(`chat:1h:${ip}`, {
    windowMs: 60 * 60_000,
    max: RATE_LIMIT_PER_HOUR,
  });
  if (!perHour.allowed) {
    return NextResponse.json(
      {
        error: "rate_limited",
        retryAfterSeconds: Math.ceil(perHour.retryAfterMs / 1000),
      },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(perHour.retryAfterMs / 1000).toString(),
        },
      }
    );
  }

  // 2. Parse and validate the body.
  let body: ChatRequest;
  try {
    body = (await req.json()) as ChatRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const rawMessage = (body.message ?? "").trim();
  if (!rawMessage) {
    return NextResponse.json({ error: "Empty message." }, { status: 400 });
  }
  if (rawMessage.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: "Message too long." },
      { status: 413 }
    );
  }

  const locale: Locale = body.locale === "en" ? "en" : "fr";
  const history = Array.isArray(body.history)
    ? body.history.slice(-MAX_HISTORY_TURNS).filter(
        (m) =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string"
      )
    : [];

  // 3. If no Gemini key is configured, use the static knowledge base.
  //    This keeps the assistant active and useful in dev / pre-API-key
  //    environments without surfacing a "service unavailable" error to
  //    the visitor.
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      reply: buildStaticReply(rawMessage, locale),
      source: "static",
    });
  }

  // 4. Otherwise, try Gemini. Fall back to the static knowledge base on
  //    any error so the visitor never sees a "service unavailable"
  //    message.
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: buildSystemPrompt(locale),
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 600,
        topP: 0.9,
      },
    });

    // Gemini expects history entries with role 'user' or 'model'.
    const geminiHistory = history.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessage(rawMessage);
    const reply = result.response.text();

    return NextResponse.json({ reply, source: "gemini" });
  } catch (err) {
    console.error("[/api/chat] Gemini error, falling back to static KB:", err);
    return NextResponse.json({
      reply: buildStaticReply(rawMessage, locale),
      source: "static-fallback",
    });
  }
}
