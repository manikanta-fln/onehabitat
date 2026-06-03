import { NextResponse } from "next/server";
import { analyzeHomeServicesImage } from "@/lib/ai/home-services-diagnostic";
import { parseImageFromFormData } from "@/lib/form-file";
import { saveIssueImage } from "@/lib/issue-images";
import { getDb, getMongoConnectionErrorMessage, isMongoConnectionError, verifyMongoConnection } from "@/lib/mongodb";
import type { IssueAnalysisResult, IssueDocument } from "@/types/database";
import { mockAnalyzeIssue } from "@/utils/mockAiAnalysis";

export const runtime = "nodejs";
/** Must match AI_ANALYSIS_TIMEOUT_SECONDS in lib/ai/constants.ts (3 minutes). */
export const maxDuration = 180;

async function getRecommendation(file: NonNullable<Awaited<ReturnType<typeof parseImageFromFormData>>>) {
  if (process.env.OPENAI_API_KEY?.trim()) {
    return analyzeHomeServicesImage(file);
  }

  console.warn(
    "[POST /api/issues/analyze] OPENAI_API_KEY not set — using mock analysis for development"
  );
  return mockAnalyzeIssue();
}

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

    await verifyMongoConnection();

    const recommendation = await getRecommendation(parsed);
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

    const analysisResult: IssueAnalysisResult = {
      issueId,
      imageId,
      recommendation,
      saved: true,
      analyzedAt: now,
    };

    await db.collection<IssueDocument>("issues").updateOne(
      { _id: result.insertedId },
      {
        $set: {
          imageId: savedImageId,
          analysisResult,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error("[POST /api/issues/analyze]", error);

    if (isMongoConnectionError(error)) {
      return NextResponse.json(
        { error: getMongoConnectionErrorMessage() },
        { status: 503 }
      );
    }

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
