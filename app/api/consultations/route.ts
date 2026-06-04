import { NextResponse } from "next/server";
import { ADMIN_COLLECTIONS } from "@/lib/admin/db/collections";
import { getDb } from "@/lib/mongodb";
import { isValidConsultation } from "@/lib/validation";
import type { ConsultationDocument } from "@/types/database";
import type { ConsultationFormData, ConsultationSource } from "@/types/consultation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { consultation, source } = body as {
      consultation?: unknown;
      source?: ConsultationSource;
    };

    if (!isValidConsultation(consultation)) {
      return NextResponse.json(
        { error: "Please provide name, mobile number, and address." },
        { status: 400 }
      );
    }

    const form = consultation as ConsultationFormData;
    const now = new Date();

    const doc: ConsultationDocument = {
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      email: form.email.trim(),
      source: source === "homepage_hero" ? "homepage_hero" : "homepage_hero",
      createdAt: now,
    };

    const db = await getDb();
    const result = await db
      .collection<ConsultationDocument>(ADMIN_COLLECTIONS.consultations)
      .insertOne(doc);

    return NextResponse.json({
      consultationId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("[POST /api/consultations]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to save consultation request",
      },
      { status: 500 }
    );
  }
}
