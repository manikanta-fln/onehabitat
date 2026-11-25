import { NextResponse } from "next/server";
import { ObjectId, type Collection } from "mongodb";
import { ADMIN_COLLECTIONS } from "@/lib/admin/db/collections";
import {
  getDb,
  getMongoConnectionErrorMessage,
  isMongoConnectionError,
  verifyMongoConnection,
} from "@/lib/mongodb";
import {
  generateChatReply,
  localizeReply,
  type ChatTurn,
} from "@/lib/ai/chat-assistant";
import { CHAT_MESSAGE_MAX_LENGTH } from "@/lib/ai/constants";
import { answerInteriorsQuestion } from "@/lib/interiors/answer";
import { estimateToText } from "@/lib/interiors/estimator";
import { TELUGU_STYLE_RE } from "@/lib/interiors/question";
import {
  classifyFollowUpReply,
  FOLLOW_UP_KNOWN_REPLY,
  FOLLOW_UPS,
  isFollowUpId,
  pickFollowUp,
  TELUGU_FOLLOW_UP_RE,
  type FollowUpId,
} from "@/lib/chat/follow-ups";
import type { ChatDocument, ChatMessageRecord } from "@/types/database";
import type { ChatSendRequest, ChatSendResponse } from "@/types/chat";
import type { InteriorEstimate } from "@/types/interiors";

export const runtime = "nodejs";
export const maxDuration = 45;

/** Number of prior turns fed to the model for context. */
const HISTORY_WINDOW = 10;

function resolveObjectId(conversationId: string | undefined): ObjectId | null {
  if (!conversationId || !ObjectId.isValid(conversationId)) return null;
  return new ObjectId(conversationId);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatSendRequest;

    if (!body || (body.type !== "message" && body.type !== "event")) {
      return NextResponse.json(
        { error: "Invalid chat request." },
        { status: 400 }
      );
    }

    await verifyMongoConnection();
    const db = await getDb();
    const chats = db.collection<ChatDocument>(ADMIN_COLLECTIONS.chats);

    const existingId = resolveObjectId(body.conversationId);
    const existing = existingId
      ? await chats.findOne({ _id: existingId })
      : null;
    const now = new Date();

    // ---- Event: persist a transcript entry without generating a reply. ----
    if (body.type === "event") {
      const content = String(body.content ?? "").trim();
      const event = String(body.event ?? "").trim() || "event";

      const record: ChatMessageRecord = {
        role: "event",
        content: content.slice(0, 2000),
        event,
        meta: body.meta,
        at: now,
      };

      const conversationId = await appendRecords(
        chats,
        existing?._id ?? null,
        [record],
        now
      );

      return NextResponse.json({ conversationId } satisfies ChatSendResponse);
    }

    // ---- Message: persist the question, generate + persist a reply. ----
    const content = String(body.content ?? "").trim();
    if (!content) {
      return NextResponse.json(
        { error: "Please enter a message." },
        { status: 400 }
      );
    }
    if (content.length > CHAT_MESSAGE_MAX_LENGTH) {
      return NextResponse.json(
        {
          error: `Please keep your message under ${CHAT_MESSAGE_MAX_LENGTH} characters.`,
        },
        { status: 400 }
      );
    }

    const priorTurns: ChatTurn[] = (existing?.messages ?? [])
      .filter(
        (m): m is ChatMessageRecord & { role: "user" | "assistant" } =>
          m.role === "user" || m.role === "assistant"
      )
      .slice(-HISTORY_WINDOW)
      .map((m) => ({ role: m.role, content: m.content }));

    const isTeluguStyle = (text: string) => {
      const lower = text.toLowerCase();
      return TELUGU_STYLE_RE.test(lower) || TELUGU_FOLLOW_UP_RE.test(lower);
    };

    // ---- Reply to a "Do you know why others…?" follow-up question. ----
    const pendingFollowUp = getPendingFollowUp(existing?.messages ?? []);
    const followUpReply = pendingFollowUp
      ? classifyFollowUpReply(content)
      : null;

    if (pendingFollowUp && followUpReply) {
      const baseReply =
        followUpReply === "explain"
          ? FOLLOW_UPS[pendingFollowUp].answer
          : FOLLOW_UP_KNOWN_REPLY;
      const reply = isTeluguStyle(content)
        ? await localizeReply(baseReply, content)
        : baseReply;

      const conversationId = await appendRecords(
        chats,
        existing?._id ?? null,
        [
          { role: "user", content, at: now },
          {
            role: "assistant",
            content: reply,
            meta: {
              kind: "follow_up_answer",
              followUpId: pendingFollowUp,
              customerKnew: followUpReply === "known",
            },
            at: new Date(),
          },
        ],
        now
      );

      return NextResponse.json({
        conversationId,
        reply,
        followUpAnswered: true,
      } satisfies ChatSendResponse);
    }

    // Interiors / renovation questions (cost, quantities, labour, rates,
    // brands, colours, trends) are answered exactly from the rate config, and
    // only for what was asked. Everything else goes to the AI assistant.
    const interiors = answerInteriorsQuestion(
      content,
      priorTurns.filter((turn) => turn.role === "user").map((turn) => turn.content)
    );

    let reply: string;
    let storedReply: string;
    let estimate: InteriorEstimate | undefined;
    let assistantMeta: Record<string, unknown> | undefined;

    if (interiors) {
      reply = TELUGU_STYLE_RE.test(content.toLowerCase())
        ? await localizeReply(interiors.reply, content)
        : interiors.reply;
      storedReply = reply;
      estimate = interiors.estimate;
    } else {
      reply = await generateChatReply([
        ...priorTurns,
        { role: "user", content },
      ]);
      storedReply = reply;
    }

    if (estimate) {
      // Keep the full breakdown in the transcript for the admin console and
      // for follow-up questions.
      storedReply = `${reply}\n\n${estimateToText(estimate)}`;
      assistantMeta = {
        kind: "interior_estimate",
        property: estimate.propertyLabel,
        carpetAreaSqft: estimate.carpetAreaSqft,
        scope: estimate.scope,
        tier: estimate.tier,
        trades: estimate.lines.map((line) => line.trade).join(", "),
        grandTotal: estimate.grandTotal,
        ...(estimate.budget
          ? { budget: estimate.budget, budgetFit: estimate.budgetFit }
          : {}),
      };
    }

    const userRecord: ChatMessageRecord = {
      role: "user",
      content,
      at: now,
    };
    const assistantRecord: ChatMessageRecord = {
      role: "assistant",
      content: storedReply,
      ...(assistantMeta ? { meta: assistantMeta } : {}),
      at: new Date(),
    };

    // Ask one related "Do you know why others…?" question, never repeating one.
    const followUp = pickFollowUp({
      customerMessage: content,
      reply,
      hasEstimate: Boolean(estimate),
      interiors: Boolean(interiors),
      alreadyAsked: askedFollowUps(existing?.messages ?? []),
    });
    let followUpQuestion: string | undefined;
    if (followUp) {
      followUpQuestion = isTeluguStyle(content)
        ? await localizeReply(followUp.question, content)
        : followUp.question;
    }

    const records: ChatMessageRecord[] = [userRecord, assistantRecord];
    if (followUp && followUpQuestion) {
      records.push({
        role: "assistant",
        content: followUpQuestion,
        meta: { kind: "follow_up_question", followUpId: followUp.id },
        at: new Date(),
      });
    }

    const conversationId = await appendRecords(
      chats,
      existing?._id ?? null,
      records,
      now
    );

    return NextResponse.json({
      conversationId,
      reply,
      ...(estimate ? { estimate } : {}),
      ...(followUp && followUpQuestion
        ? { followUp: { id: followUp.id, question: followUpQuestion } }
        : {}),
    } satisfies ChatSendResponse);
  } catch (error) {
    console.error("[POST /api/chat]", error);

    if (isMongoConnectionError(error)) {
      return NextResponse.json(
        { error: getMongoConnectionErrorMessage() },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to process chat message",
      },
      { status: 500 }
    );
  }
}

/**
 * The follow-up question waiting for an answer: the latest user/assistant
 * message is an assistant follow-up question (events in between are ignored).
 */
function getPendingFollowUp(messages: ChatMessageRecord[]): FollowUpId | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message.role === "event") continue;
    if (
      message.role === "assistant" &&
      message.meta?.kind === "follow_up_question" &&
      isFollowUpId(message.meta.followUpId)
    ) {
      return message.meta.followUpId;
    }
    return null;
  }
  return null;
}

function askedFollowUps(messages: ChatMessageRecord[]): Set<string> {
  const asked = new Set<string>();
  for (const message of messages) {
    if (
      message.meta?.kind === "follow_up_question" &&
      typeof message.meta.followUpId === "string"
    ) {
      asked.add(message.meta.followUpId);
    }
  }
  return asked;
}

async function appendRecords(
  collection: Collection<ChatDocument>,
  conversationId: ObjectId | null,
  records: ChatMessageRecord[],
  now: Date
): Promise<string> {
  if (conversationId) {
    await collection.updateOne(
      { _id: conversationId },
      {
        $push: { messages: { $each: records } },
        $set: { updatedAt: now },
      }
    );
    return conversationId.toString();
  }

  const doc: ChatDocument = {
    messages: records,
    source: "homepage_chatbot",
    createdAt: now,
    updatedAt: now,
  };
  const result = await collection.insertOne(doc);
  return result.insertedId.toString();
}
