import type { Metadata } from "next";
import { inter, manrope } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fixora | Urban Service Excellence",
  description:
    "Upload an issue, get AI analysis, expert guidance, and professional service at your doorstep.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`light ${manrope.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-surface text-on-surface font-body selection:bg-secondary-fixed-dim selection:text-on-secondary-fixed"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
