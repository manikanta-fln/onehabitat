import { NextResponse } from "next/server";
import { parseImageFromFormData } from "@/lib/form-file";
import { saveIssueImage } from "@/lib/issue-images";
import { getDb } from "@/lib/mongodb";
import type { IssueDocument } from "@/types/database";
import { mockAnalyzeIssue } from "@/utils/mockAiAnalysis";

export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const parsed = await parseImageFromFormData(formData, "file");

    if (!parsed) {
      return NextResponse.json(
        { error: "No valid image file provided" },
        { status: 400 }
      );
    }

    if (parsed.sizeBytes > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "Image must be under 5MB" },
        { status: 400 }
      );
    }

    const recommendation = await mockAnalyzeIssue();
    const now = new Date();
    const db = await getDb();

    const issue: IssueDocument = {
      image: {
        fileName: parsed.fileName,
        mimeType: parsed.mimeType,
        sizeBytes: parsed.sizeBytes,
      },
      recommendation,
      status: "analyzed",
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection<IssueDocument>("issues").insertOne(issue);
    const issueId = result.insertedId.toString();

    const savedImageId = await saveIssueImage(db, result.insertedId, parsed);
    const imageId = savedImageId.toString();

    await db.collection<IssueDocument>("issues").updateOne(
      { _id: result.insertedId },
      {
        $set: {
          imageId: savedImageId,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      issueId,
      imageId,
      recommendation,
      saved: true,
    });
  } catch (error) {
    console.error("[POST /api/issues/analyze]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to analyze issue",
      },
      { status: 500 }
    );
  }
}
