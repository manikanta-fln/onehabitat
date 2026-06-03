export type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  to: string;
};

export function getAppBaseUrl(): string {
  const explicit =
    process.env.APP_URL?.trim() || process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return `https://${vercel.replace(/\/$/, "")}`;
  }

  return "http://localhost:3000";
}

export function getSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const from = process.env.SMTP_FROM?.trim();
  const to = process.env.BOOKING_NOTIFICATION_EMAIL?.trim();

  if (!host || !user || !pass || !from || !to) {
    return null;
  }

  const port = Number(process.env.SMTP_PORT?.trim() || "587");
  const secure =
    process.env.SMTP_SECURE?.trim() === "true" ||
    process.env.SMTP_SECURE?.trim() === "1" ||
    port === 465;

  return {
    host,
    port,
    secure,
    user,
    pass,
    from,
    to,
  };
}

export function isBookingNotificationEmailConfigured(): boolean {
  return getSmtpConfig() !== null;
}
