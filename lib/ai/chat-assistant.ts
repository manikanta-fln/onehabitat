import {
  AI_CHAT_TIMEOUT_MS,
  AI_CHAT_TIMEOUT_MESSAGE,
} from "@/lib/ai/constants";

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

const CHAT_SYSTEM_PROMPT = `You are Onehabitat's friendly home-services assistant for customers in India.

Onehabitat provides home maintenance and makeover services: plumbing, electrical, painting, carpentry, seepage and waterproofing, pest control, bathroom / flat / villa / terrace / balcony makeovers, and pre-handover flat inspections (1 BHK, 2 BHK, 3 BHK, villas).

Guidelines:
- Answer the customer's question helpfully and concisely in 2-4 short sentences, in simple, warm language.
- Give practical guidance, but NEVER give step-by-step instructions for dangerous electrical, gas, or structural work — advise hiring a professional instead.
- When relevant, mention the specific Onehabitat service that fits the problem.
- Always encourage the customer to upload or capture a photo of the issue for an instant AI diagnosis, or to contact the Onehabitat team to book a verified expert.
- Never invent exact prices. If asked about cost, explain it depends on an inspection and suggest uploading a photo for an estimate.
- Stay on topic: home maintenance, repairs, makeovers, and Onehabitat services. Politely redirect unrelated questions.`;

type OpenAIChatResponse = {
  choices?: Array<{ message?: { content?: string | null } }>;
  error?: { message?: string };
};

/** Lightweight keyword-based reply used when OPENAI_API_KEY is not configured. */
export function mockChatReply(message: string): Promise<string> {
  const text = message.toLowerCase();

  const pick = (): string => {
    if (/(leak|water|drip|tap|pipe|plumb|seep|damp|moist)/.test(text)) {
      return "That sounds like a plumbing or seepage issue, which is best caught early before it spreads. Upload a photo and our AI will pinpoint the cause and estimate the fix, or contact our team to book a verified plumber.";
    }
    if (/(electric|wire|socket|switch|power|short|spark|mcb|shock)/.test(text)) {
      return "Electrical faults can be a safety risk, so please avoid touching exposed wiring. Capture a photo of the affected point for an instant AI assessment, and we'll arrange a licensed electrician through Onehabitat.";
    }
    if (/(paint|wall|crack|peel|putty)/.test(text)) {
      return "Peeling or cracked walls usually point to moisture or surface wear. Share a photo and our AI will suggest the right treatment and repainting approach, or contact our team for a makeover quote.";
    }
    if (/(pest|termite|cockroach|rodent|rat|mosquito|bug|insect)/.test(text)) {
      return "We offer professional pest control starting from ₹680, covering termites, cockroaches, rodents and more. Tell us the pest and area, or upload a photo, and we'll recommend the right treatment.";
    }
    if (/(bathroom|tile|grout|toilet|washroom)/.test(text)) {
      return "Bathroom problems like leaks, grout damage or makeovers are one of our specialities. Upload a photo for an AI diagnosis, or contact our team to plan a full bathroom makeover.";
    }
    if (/(inspect|handover|snag|new flat|possession|quality)/.test(text)) {
      return "Our pre-handover flat inspection covers 1 BHK, 2 BHK, 3 BHK and villas with a detailed snag report before you take possession. Contact our team to schedule an inspection.";
    }
    if (/(price|cost|charge|quote|rate|budget)/.test(text)) {
      return "Pricing depends on the exact issue and an on-site inspection, so I can't quote an exact figure here. Upload a photo for an AI-based estimate, or contact our team for a detailed quote.";
    }
    return "I can help with home repairs and makeovers — plumbing, electrical, painting, seepage, pest control, bathroom and flat makeovers, and flat inspections. For the most accurate help, upload or capture a photo of the issue, or contact our team to book a verified expert.";
  };

  const reply = pick();
  const delay = 700 + Math.random() * 700;
  return new Promise((resolve) => setTimeout(() => resolve(reply), delay));
}

export async function generateChatReply(history: ChatTurn[]): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    const last = [...history].reverse().find((turn) => turn.role === "user");
    return mockChatReply(last?.content ?? "");
  }

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
        temperature: 0.4,
        max_tokens: 400,
        messages: [
          { role: "system", content: CHAT_SYSTEM_PROMPT },
          ...history.map((turn) => ({ role: turn.role, content: turn.content })),
        ],
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
