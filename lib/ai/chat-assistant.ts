import {
  AI_CHAT_TIMEOUT_MS,
  AI_CHAT_TIMEOUT_MESSAGE,
} from "@/lib/ai/constants";
import { MARKET_LABEL } from "@/lib/interiors/config";
import { buildInteriorsKnowledge } from "@/lib/interiors/knowledge";

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

const CHAT_SYSTEM_PROMPT = `You are Onehabitat's home-services and interiors assistant for customers in India.

Onehabitat provides:
- Home maintenance and repairs: plumbing, electrical, painting, carpentry, seepage and waterproofing, pest control.
- Interiors and renovations: full home interiors, modular kitchens and wardrobes, and bathroom / flat / villa / terrace / balcony makeovers.
- Pre-handover flat inspections (1 BHK, 2 BHK, 3 BHK, villas).

How to answer:
1. Answer exactly the question asked. Your first sentence must directly answer it. Do not add anything the customer didn't ask for — no unrelated costs, brands, colours, trends, services or sales lines.
2. Be specific. Use the actual figures, units, product types and brands from the reference below instead of general statements.
3. Keep it short: 1-3 sentences, or up to 5 short bullet points for a list.
4. Reply in the same language and style the customer uses (English, Telugu, or Telugu written in English letters).
5. Never mention any city, place, celebrity, designer or other person's name unless the customer asks about it.
6. If you truly cannot answer without one detail (such as the home size), ask only for that detail, in one short question.
7. Stay on topic: home maintenance, repairs, interiors, renovations and Onehabitat services. Politely redirect anything else in one sentence.
8. Never give step-by-step instructions for dangerous electrical, gas or structural work — advise hiring a professional.

Repairs and problems (leaks, cracks, damp walls, electrical faults, pests):
- Explain the likely cause and the right fix in plain words.
- Don't quote repair prices — the cost depends on an inspection. Suggest uploading a photo of the problem for an instant AI diagnosis, or booking a verified expert.

Interiors and renovations:
- Use only figures from the reference; never invent prices. Quote each rate with its unit, and call figures indicative (the final cost is confirmed after a free site measurement).
- If an earlier assistant message contains an "[Interior estimate]" breakdown, use those exact numbers for follow-up questions.

Internal note (do not volunteer): the reference rates are based on ${MARKET_LABEL}. Mention the city only if the customer asks which city, location or market the rates are for.

Reference:
${buildInteriorsKnowledge()}`;

const LOCALIZE_PROMPT = `Rewrite the assistant reply in the same language and style as the customer's message (for example, Telugu written in English letters mixed with English words).
Keep every number, unit, rupee amount, brand name, line break and bullet exactly as written.
Do not add, remove or change any information. Do not mention any city, place or person.
Return only the rewritten reply.`;

type OpenAIMessage = { role: "system" | "user" | "assistant"; content: string };

type OpenAIChatResponse = {
  choices?: Array<{ message?: { content?: string | null } }>;
  error?: { message?: string };
};

function getApiKey(): string | null {
  return process.env.OPENAI_API_KEY?.trim() || null;
}

async function callOpenAI(
  apiKey: string,
  messages: OpenAIMessage[],
  options: { temperature: number; maxTokens: number }
): Promise<string> {
  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_CHAT_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: options.temperature,
        max_tokens: options.maxTokens,
        messages,
      }),
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(AI_CHAT_TIMEOUT_MESSAGE);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }

  const payload = (await response.json()) as OpenAIChatResponse;
  if (!response.ok) {
    throw new Error(
      payload.error?.message ?? `OpenAI request failed (${response.status})`
    );
  }

  const content = payload.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("The assistant returned an empty response. Please try again.");
  }
  return content;
}

/** Lightweight keyword-based reply used when OPENAI_API_KEY is not configured. */
export function mockChatReply(message: string): Promise<string> {
  const text = message.toLowerCase();

  const pick = (): string => {
    if (/(pest|termite|cockroach|rodent|\brats?\b|mosquito|bed ?bug|insect)/.test(text)) {
      return "Yes — we offer professional pest control starting from ₹680, covering termites, cockroaches, rodents and more. Tell us the pest and the area, or upload a photo, and we'll recommend the right treatment.";
    }
    if (/(inspect|handover|snag|possession)/.test(text)) {
      return "Our pre-handover flat inspection covers 1 BHK, 2 BHK, 3 BHK and villas, with a detailed snag report before you take possession. Contact our team to schedule one.";
    }
    if (/(leak|drip|seep|damp|moist)/.test(text)) {
      return "A leak or damp patch is best fixed early, before it damages walls and ceilings. Upload a photo and our AI will pinpoint the cause, or book a verified plumber through our team.";
    }
    if (/(short|spark|shock|tripping|mcb|no power|not working)/.test(text)) {
      return "Electrical faults can be a safety risk, so please avoid touching exposed wiring. Capture a photo of the affected point for an instant AI assessment, and we'll arrange a licensed electrician.";
    }
    if (/(crack|peel|bubbl|flak)/.test(text)) {
      return "Cracked or peeling paint usually points to moisture or poor surface preparation. Share a photo and our AI will suggest the right treatment before repainting.";
    }
    if (/(interior|renn?ovat|remodel|refurbish|furnish|modular)/.test(text)) {
      return "Tell me your home size (e.g. 2BHK or 1,100 sqft), full interiors or renovation, finish level (economy / premium / luxury) and budget — for example \"2BHK full interiors, premium, budget 12 lakh\" — and I'll give you the cost, material quantities and labour charges.";
    }
    return "I can help with home repairs, interiors and renovations — costs, material quantities, labour rates, brands and colour ideas. For a problem at home, you can also upload a photo for an instant AI diagnosis.";
  };

  const reply = pick();
  const delay = 500 + Math.random() * 500;
  return new Promise((resolve) => setTimeout(() => resolve(reply), delay));
}

export async function generateChatReply(history: ChatTurn[]): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    const last = [...history].reverse().find((turn) => turn.role === "user");
    return mockChatReply(last?.content ?? "");
  }

  return callOpenAI(
    apiKey,
    [
      { role: "system", content: CHAT_SYSTEM_PROMPT },
      ...history.map((turn) => ({ role: turn.role, content: turn.content })),
    ],
    { temperature: 0.2, maxTokens: 500 }
  );
}

/**
 * Rewords an exact, pre-built reply into the customer's language (e.g. Telugu
 * written in English letters) without changing any figures. Falls back to the
 * original reply if the AI is unavailable.
 */
export async function localizeReply(
  reply: string,
  customerMessage: string
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) return reply;

  try {
    return await callOpenAI(
      apiKey,
      [
        { role: "system", content: LOCALIZE_PROMPT },
        {
          role: "user",
          content: `Customer message:\n${customerMessage}\n\nAssistant reply:\n${reply}`,
        },
      ],
      { temperature: 0, maxTokens: 700 }
    );
  } catch (error) {
    console.error("[chat-assistant] localizeReply failed", error);
    return reply;
  }
}
