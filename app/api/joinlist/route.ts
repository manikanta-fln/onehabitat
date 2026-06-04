import { NextResponse } from "next/server";
import { ADMIN_COLLECTIONS } from "@/lib/admin/db/collections";
import { getDb } from "@/lib/mongodb";
import { isValidWaitlist } from "@/lib/validation";
import type { JoinlistDocument } from "@/types/database";
import type { WaitlistFormData, WaitlistSource } from "@/types/waitlist";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { entry, source } = body as {
      entry?: unknown;
      source?: WaitlistSource;
    };

    if (!isValidWaitlist(entry)) {
      return NextResponse.json(
        { error: "Please provide your name and a valid email address." },
        { status: 400 }
      );
    }

    const form = entry as WaitlistFormData;
    const now = new Date();

    const doc: JoinlistDocument = {
      fullName: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      source:
        source === "app_launch_section" ? "app_launch_section" : "app_launch_section",
      createdAt: now,
    };

    const db = await getDb();
    const result = await db
      .collection<JoinlistDocument>(ADMIN_COLLECTIONS.joinlist)
      .insertOne(doc);

    return NextResponse.json({
      joinlistId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("[POST /api/joinlist]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to join the waitlist",
      },
      { status: 500 }
    );
  }
}
