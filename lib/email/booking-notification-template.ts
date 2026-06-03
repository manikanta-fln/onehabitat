import { escapeHtml } from "@/lib/email/escape-html";
import type { AIRecommendation, BookingFormData } from "@/types/upload-issue";

const ANALYSIS_UNAVAILABLE = "Image analysis is currently unavailable.";

export type BookingNotificationContent = {
  bookingId: string;
  issueId: string;
  customerId: string;
  booking: BookingFormData;
  recommendation: AIRecommendation | null;
  image?: {
    fileName: string;
    mimeType: string;
    sizeBytes: number;
    url: string;
  };
  submittedAt: Date;
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function renderList(items: string[]): string {
  if (items.length === 0) {
    return `<p style="margin:0;color:#555;">None provided</p>`;
  }

  return `<ul style="margin:0;padding-left:20px;color:#333;">${items
    .map((item) => `<li style="margin-bottom:6px;">${escapeHtml(item)}</li>`)
    .join("")}</ul>`;
}

function renderAnalysisSection(recommendation: AIRecommendation | null): string {
  if (!recommendation) {
    return `<p style="margin:0;color:#555;">${ANALYSIS_UNAVAILABLE}</p>`;
  }

  const diagnostic = recommendation.diagnostic;
  const confidence =
    recommendation.confidenceScore ?? diagnostic?.confidence_score ?? null;

  return `
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:8px 0;color:#666;width:180px;vertical-align:top;">Detected issue</td>
        <td style="padding:8px 0;color:#111;">${escapeHtml(recommendation.detectedIssue)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#666;vertical-align:top;">Category</td>
        <td style="padding:8px 0;color:#111;">${escapeHtml(recommendation.category)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#666;vertical-align:top;">Severity</td>
        <td style="padding:8px 0;color:#111;">${escapeHtml(recommendation.severity)}</td>
      </tr>
      ${
        confidence !== null
          ? `<tr>
        <td style="padding:8px 0;color:#666;vertical-align:top;">Confidence</td>
        <td style="padding:8px 0;color:#111;">${escapeHtml(String(confidence))}%</td>
      </tr>`
          : ""
      }
      <tr>
        <td style="padding:8px 0;color:#666;vertical-align:top;">Summary</td>
        <td style="padding:8px 0;color:#111;">${escapeHtml(recommendation.summary)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#666;vertical-align:top;">Estimated cost</td>
        <td style="padding:8px 0;color:#111;">${escapeHtml(recommendation.estimatedCost)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#666;vertical-align:top;">Estimated duration</td>
        <td style="padding:8px 0;color:#111;">${escapeHtml(recommendation.estimatedDuration)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#666;vertical-align:top;">Recommended solutions</td>
        <td style="padding:8px 0;color:#111;">${renderList(recommendation.solutions)}</td>
      </tr>
      ${
        diagnostic
          ? `<tr>
        <td style="padding:8px 0;color:#666;vertical-align:top;">Visible observations</td>
        <td style="padding:8px 0;color:#111;">${renderList(diagnostic.visible_observations)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#666;vertical-align:top;">Possible causes</td>
        <td style="padding:8px 0;color:#111;">${renderList(diagnostic.possible_causes)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#666;vertical-align:top;">Urgency</td>
        <td style="padding:8px 0;color:#111;">${escapeHtml(diagnostic.urgency_reason)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#666;vertical-align:top;">Limitations</td>
        <td style="padding:8px 0;color:#111;">${escapeHtml(diagnostic.limitations)}</td>
      </tr>`
          : ""
      }
    </table>
  `;
}

function section(title: string, body: string): string {
  return `
    <div style="margin-bottom:24px;">
      <h2 style="margin:0 0 12px;font-size:18px;color:#1a1a1a;border-bottom:1px solid #e5e7eb;padding-bottom:8px;">
        ${escapeHtml(title)}
      </h2>
      ${body}
    </div>
  `;
}

export function buildBookingNotificationSubject(
  content: BookingNotificationContent
): string {
  const service = content.recommendation?.category || "Home Service";
  return `New booking request — ${content.booking.fullName} (${service})`;
}

export function buildBookingNotificationHtml(
  content: BookingNotificationContent
): string {
  const submittedAt = content.submittedAt.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const imageSection = content.image
    ? `
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;color:#666;width:180px;">File name</td>
          <td style="padding:8px 0;color:#111;">${escapeHtml(content.image.fileName)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#666;">Type</td>
          <td style="padding:8px 0;color:#111;">${escapeHtml(content.image.mimeType)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#666;">Size</td>
          <td style="padding:8px 0;color:#111;">${escapeHtml(formatBytes(content.image.sizeBytes))}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#666;">View online</td>
          <td style="padding:8px 0;">
            <a href="${escapeHtml(content.image.url)}" style="color:#2563eb;text-decoration:none;">
              ${escapeHtml(content.image.url)}
            </a>
          </td>
        </tr>
      </table>
      <p style="margin:12px 0 0;color:#666;font-size:13px;">
        The uploaded image is also attached to this email when size limits allow.
      </p>
    `
    : `<p style="margin:0;color:#555;">No uploaded image was found for this issue.</p>`;

  const bookingDetails = `
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:8px 0;color:#666;width:180px;">Booking ID</td>
        <td style="padding:8px 0;color:#111;">${escapeHtml(content.bookingId)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#666;">Issue ID</td>
        <td style="padding:8px 0;color:#111;">${escapeHtml(content.issueId)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#666;">Customer ID</td>
        <td style="padding:8px 0;color:#111;">${escapeHtml(content.customerId)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#666;">Submitted at</td>
        <td style="padding:8px 0;color:#111;">${escapeHtml(submittedAt)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#666;">Customer name</td>
        <td style="padding:8px 0;color:#111;">${escapeHtml(content.booking.fullName)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#666;">Phone</td>
        <td style="padding:8px 0;color:#111;">${escapeHtml(content.booking.phone)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#666;">Email</td>
        <td style="padding:8px 0;color:#111;">${escapeHtml(content.booking.email)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#666;">Service address</td>
        <td style="padding:8px 0;color:#111;">${escapeHtml(content.booking.address)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#666;">Preferred date</td>
        <td style="padding:8px 0;color:#111;">${escapeHtml(content.booking.preferredDate)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#666;">Service requested</td>
        <td style="padding:8px 0;color:#111;">${escapeHtml(content.recommendation?.category || "Pending review")}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#666;">Customer notes</td>
        <td style="padding:8px 0;color:#111;">${
          content.booking.notes.trim()
            ? escapeHtml(content.booking.notes)
            : "None provided"
        }</td>
      </tr>
    </table>
  `;

  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#111;">
    <div style="max-width:720px;margin:0 auto;padding:24px;">
      <div style="background:#ffffff;border-radius:12px;padding:28px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <p style="margin:0 0 8px;font-size:13px;color:#2563eb;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;">
          Onehabitat Booking Notification
        </p>
        <h1 style="margin:0 0 12px;font-size:28px;line-height:1.3;color:#111;">
          Booking request submitted successfully
        </h1>
        <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#555;">
          A customer has completed the upload issue flow and submitted a new booking request.
          Review the details below and follow up with the customer as needed.
        </p>

        ${section("Booking request details", bookingDetails)}
        ${section("Uploaded issue image", imageSection)}
        ${section("AI image analysis", renderAnalysisSection(content.recommendation))}
      </div>
      <p style="margin:16px 0 0;font-size:12px;color:#888;text-align:center;">
        This is an automated notification from Onehabitat.
      </p>
    </div>
  </body>
</html>`;
}

export function buildBookingNotificationText(
  content: BookingNotificationContent
): string {
  const recommendation = content.recommendation;
  const lines = [
    "Booking request submitted successfully",
    "",
    "Booking request details",
    `Booking ID: ${content.bookingId}`,
    `Issue ID: ${content.issueId}`,
    `Customer ID: ${content.customerId}`,
    `Customer name: ${content.booking.fullName}`,
    `Phone: ${content.booking.phone}`,
    `Email: ${content.booking.email}`,
    `Address: ${content.booking.address}`,
    `Preferred date: ${content.booking.preferredDate}`,
    `Service: ${recommendation?.category || "Pending review"}`,
    `Notes: ${content.booking.notes.trim() || "None provided"}`,
    "",
    "Uploaded issue image",
    content.image
      ? `File: ${content.image.fileName}\nType: ${content.image.mimeType}\nSize: ${formatBytes(content.image.sizeBytes)}\nURL: ${content.image.url}`
      : "No uploaded image was found for this issue.",
    "",
    "AI image analysis",
  ];

  if (!recommendation) {
    lines.push(ANALYSIS_UNAVAILABLE);
  } else {
    lines.push(
      `Detected issue: ${recommendation.detectedIssue}`,
      `Category: ${recommendation.category}`,
      `Severity: ${recommendation.severity}`,
      `Summary: ${recommendation.summary}`,
      `Estimated cost: ${recommendation.estimatedCost}`,
      `Estimated duration: ${recommendation.estimatedDuration}`,
      `Solutions: ${recommendation.solutions.join("; ") || "None provided"}`
    );
  }

  return lines.join("\n");
}
