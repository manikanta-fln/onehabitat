import type { InteriorEstimate } from "@/types/interiors";

export type ChatSource = "homepage_chatbot";

/** A customer text question that should receive a generated reply. */
export type ChatMessageRequest = {
  type: "message";
  conversationId?: string;
  content: string;
  source?: ChatSource;
};

/**
 * A transcript event that should be persisted but not answered
 * (e.g. an image was analyzed, or a booking was confirmed).
 */
export type ChatEventRequest = {
  type: "event";
  conversationId?: string;
  event: string;
  content: string;
  meta?: Record<string, unknown>;
  source?: ChatSource;
};

export type ChatSendRequest = ChatMessageRequest | ChatEventRequest;

export type ChatSendResponse = {
  conversationId: string;
  /** Present for "message" requests. */
  reply?: string;
  /** Present when the message produced an interiors / renovation estimate. */
  estimate?: InteriorEstimate;
};

/** A single message as shown in the admin console. */
export type AdminChatMessageView = {
  role: "user" | "assistant" | "event";
  content: string;
  event?: string;
  meta?: Record<string, unknown>;
  at: string | null;
};

/** A conversation row for the admin chats table + transcript drawer. */
export type AdminChatRow = {
  id: string;
  source: string;
  preview: string;
  messageCount: number;
  userMessageCount: number;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
  messages: AdminChatMessageView[];
};
