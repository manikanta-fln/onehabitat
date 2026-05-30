import { NextResponse } from "next/server";
import { verifyMongoConnection } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function GET() {
  try {
    await verifyMongoConnection();
    return NextResponse.json({
      ok: true,
      message: "MongoDB connection successful",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "MongoDB connection failed",
      },
      { status: 503 }
    );
  }
}
