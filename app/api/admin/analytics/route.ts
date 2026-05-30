import { NextResponse } from "next/server";
import {
  handleAdminRouteError,
  requireAdmin,
} from "@/lib/admin/auth/require-auth";
import {
  exportAnalyticsCsv,
  exportAnalyticsExcel,
  getAnalyticsData,
} from "@/lib/admin/services/analytics-service";
import { parseDateRange } from "@/lib/admin/utils/pagination";

export async function GET(request: Request) {
  try {
    await requireAdmin(request, "analytics:read");
    const { searchParams } = new URL(request.url);
    const { from, to } = parseDateRange(searchParams);
    const data = await getAnalyticsData(from, to);
    return NextResponse.json(data);
  } catch (error) {
    return handleAdminRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin(request, "analytics:export");
    const body = await request.json();
    const format = body.format === "xlsx" ? "xlsx" : "csv";
    const type = body.type;
    const from = typeof body.from === "string" ? body.from : undefined;
    const to = typeof body.to === "string" ? body.to : undefined;

    if (!["issues", "bookings", "customers"].includes(type)) {
      return NextResponse.json({ error: "Invalid export type" }, { status: 400 });
    }

    if (format === "xlsx") {
      const buffer = await exportAnalyticsExcel(type, from, to);
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${type}-export.xlsx"`,
        },
      });
    }

    const csv = await exportAnalyticsCsv(type, from, to);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${type}-export.csv"`,
      },
    });
  } catch (error) {
    return handleAdminRouteError(error);
  }
}
