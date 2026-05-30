import { getDb } from "@/lib/mongodb";
import {
  getAnalyticsSummary,
  exportOperationalData,
} from "@/lib/admin/repositories/analytics";
import { serializeDate, serializeId } from "@/lib/admin/utils/serialize";
import * as XLSX from "xlsx";
import type { BookingDocument, CustomerDocument, IssueDocument } from "@/types/database";

export async function getAnalyticsData(from?: string, to?: string) {
  const db = await getDb();
  return getAnalyticsSummary(db, from, to);
}

function toCsvRow(values: (string | number | null | undefined)[]) {
  return values
    .map((value) => {
      const text = value == null ? "" : String(value);
      if (/[",\n]/.test(text)) {
        return `"${text.replace(/"/g, '""')}"`;
      }
      return text;
    })
    .join(",");
}

export async function exportAnalyticsCsv(
  type: "issues" | "bookings" | "customers",
  from?: string,
  to?: string
) {
  const db = await getDb();
  const rows = await exportOperationalData(db, type, from, to);

  if (type === "issues") {
    const header = [
      "id",
      "detectedIssue",
      "category",
      "severity",
      "status",
      "archived",
      "createdAt",
    ];
    const body = rows.map((row) => {
      const issue = row as unknown as IssueDocument;
      return toCsvRow([
        serializeId(issue._id),
        issue.recommendation.detectedIssue,
        issue.recommendation.category,
        issue.recommendation.severity,
        issue.status,
        (issue as IssueDocument & { archived?: boolean }).archived ? "yes" : "no",
        serializeDate(issue.createdAt),
      ]);
    });
    return [toCsvRow(header), ...body].join("\n");
  }

  if (type === "bookings") {
    const header = [
      "id",
      "customerName",
      "email",
      "phone",
      "preferredDate",
      "status",
      "issue",
      "createdAt",
    ];
    const body = rows.map((row) => {
      const booking = row as unknown as BookingDocument & {
        status?: string;
      };
      return toCsvRow([
        serializeId(booking._id),
        booking.booking.fullName,
        booking.booking.email,
        booking.booking.phone,
        booking.booking.preferredDate,
        booking.status ?? "pending",
        booking.recommendation.detectedIssue,
        serializeDate(booking.createdAt),
      ]);
    });
    return [toCsvRow(header), ...body].join("\n");
  }

  const header = ["id", "fullName", "email", "phone", "bookingCount", "createdAt"];
  const body = rows.map((row) => {
    const customer = row as unknown as CustomerDocument;
    return toCsvRow([
      serializeId(customer._id),
      customer.fullName,
      customer.email,
      customer.phone,
      customer.bookingCount,
      serializeDate(customer.createdAt),
    ]);
  });
  return [toCsvRow(header), ...body].join("\n");
}

export async function exportAnalyticsExcel(
  type: "issues" | "bookings" | "customers",
  from?: string,
  to?: string
) {
  const csv = await exportAnalyticsCsv(type, from, to);
  const workbook = XLSX.read(csv, { type: "string" });
  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;
}
