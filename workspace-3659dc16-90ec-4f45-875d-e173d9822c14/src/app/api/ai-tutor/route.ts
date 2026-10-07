/**
 * Lingoland AI Tutor backend.
 * Uses z-ai-web-dev-sdk for chat completions.
 * Falls back to a deterministic local tutor if the SDK is unavailable.
 */

import ZAI from "z-ai-web-dev-sdk";
import { AI_SCENARIOS } from "@/data/catalog";
import { LANGUAGES } from "@/data/courses";

export interface ChatRequest {
  scenarioId: string;
  languageId: string;
  difficulty?: string;
  messages: { role: "user" | "assistant"; content: string }[];
}

export interface ChatResponse {
  content: string;
  translation?: string;
  correction?: { said: string; better: string; why: string; example?: string };
  fallback?: boolean;
}

const LANG_NAMES: Record<string, string> = {
  es: "Spanish",
  ja: "Japanese",
  fr: "French",
};

function buildSystemPrompt(scenarioId: string, languageId: string, difficulty: string): string {
  const scenario = AI_SCENARIOS.find((s) => s.id === scenarioId);
  const lang = LANGUAGES.find((l) => l.id === languageId);
  const langName = lang ? lang.name : LANG_NAMES[languageId] ?? "the target language";
  const base = scenario?.systemPrompt ?? "You are a friendly language tutor. Reply in the target language. Keep replies short.";
  return `${base}

Target language: ${langName}. Difficulty: ${difficulty}.
Rules:
- Always reply in ${langName}, except for the 💡 correction blocks which should be explained in English.
- Keep your reply to 1-3 short sentences.
- After your reply, if the learner made a mistake, include a line starting with 💡 Correction: in this exact format:
  💡 Correction: you said "X" → better: "Y" → because: Z. Example: W.
- If no mistake, do not include a 💡 line.
- End with a translation line: 📖 Translation: <english translation of your reply>.`;
}

function parseAssistant(text: string) {
  const correctionRegex = /💡\s*Correction:\s*you said\s*"([^"]+)"\s*→\s*better:\s*"([^"]+)"\s*→\s*because:\s*([^\n.]+)\.?(?:\s*Example:\s*([^\n]+))?/i;
  const match = text.match(correctionRegex);
  let correction: ChatResponse["correction"] | undefined;
  let content = text;
  if (match) {
    correction = {
      said: match[1],
      better: match[2],
      why: match[3].trim(),
      example: match[4]?.trim(),
    };
    content = text.replace(/💡\s*Correction:[^\n]*\n?/gi, "").trim();
  }
  const translationRegex = /📖\s*Translation:\s*([^\n]+)/i;
  const tMatch = content.match(translationRegex);
  let translation: string | undefined;
  if (tMatch) {
    translation = tMatch[1].trim();
    content = content.replace(/📖\s*Translation:[^\n]*\n?/gi, "").trim();
  }
  return { content, correction, translation };
}

function localFallback(req: ChatRequest): ChatResponse {
  const lang = LANG_NAMES[req.languageId] ?? "the language";
  const replies: Record<string, string> = {
    es: "¡Muy bien! Continúa. Tu español está mejorando con cada frase. 📖 Translation: Very good! Keep going. Your Spanish is improving with every sentence.",
    ja: "いいですね!続けてください。日本語が上達していますよ。 📖 Translation: That's nice! Please continue. Your Japanese is improving.",
    fr: "Très bien ! Continuez. Votre français s'améliore à chaque phrase. 📖 Translation: Very good! Keep going. Your French is improving with every sentence.",
  };
  return {
    content: replies[req.languageId] ?? `Great job! Keep practicing ${lang}.`,
    translation: "Keep practicing — you're doing well.",
    fallback: true,
  };
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as ChatRequest;
    if (!body.scenarioId || !body.languageId) {
      return Response.json({ error: "Missing scenarioId or languageId" }, { status: 400 });
    }
    const difficulty = body.difficulty ?? "A2";
    const systemPrompt = buildSystemPrompt(body.scenarioId, body.languageId, difficulty);

    try {
      const zai = await ZAI.create();
      const messages = [
        { role: "system" as const, content: systemPrompt },
        ...body.messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      ];
      const completion = await zai.chat.completions.create({
        messages,
        temperature: 0.7,
        max_tokens: 350,
      });
      const text = completion.choices?.[0]?.message?.content ?? "";
      const parsed = parseAssistant(text);
      return Response.json({
        content: parsed.content,
        translation: parsed.translation,
        correction: parsed.correction,
      } satisfies ChatResponse);
    } catch (sdkErr) {
      console.error("[ai-tutor] SDK error, falling back:", sdkErr);
      return Response.json(localFallback(body));
    }
  } catch (err) {
    console.error("[ai-tutor] error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
