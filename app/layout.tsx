import type { Metadata } from "next";
import OnehabitatWhatsAppButton from "@/components/onehabitat/WhatsAppButton";
import { inter, manrope } from "@/lib/fonts";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/utils/constants";
import "material-symbols/outlined.css";
import "./globals.css";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
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
        <OnehabitatWhatsAppButton />
      </body>
    </html>
  );
}
