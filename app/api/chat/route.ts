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
  type ChatTurn,
} from "@/lib/ai/chat-assistant";
import { CHAT_MESSAGE_MAX_LENGTH } from "@/lib/ai/constants";
import type { ChatDocument, ChatMessageRecord } from "@/types/database";
import type { ChatSendRequest, ChatSendResponse } from "@/types/chat";

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

    const reply = await generateChatReply([
      ...priorTurns,
      { role: "user", content },
    ]);

    const userRecord: ChatMessageRecord = {
      role: "user",
      content,
      at: now,
    };
    const assistantRecord: ChatMessageRecord = {
      role: "assistant",
      content: reply,
      at: new Date(),
    };

    const conversationId = await appendRecords(
      chats,
      existing?._id ?? null,
      [userRecord, assistantRecord],
      now
    );

    return NextResponse.json({
      conversationId,
      reply,
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
