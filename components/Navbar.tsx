"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { CONTACT_HREF, MAIN_NAV_LINKS } from "@/utils/constants";

type NavbarProps = {
  brandName?: string;
  brandHref?: string;
  action?: ReactNode;
};

function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  if (href.startsWith("/#")) {
    return false;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar({
  brandName = "Fixora",
  brandHref = "/",
  action,
}: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
      <div className="flex justify-between items-center w-full px-margin-desktop py-4 max-w-7xl mx-auto">
        <Link
          href={brandHref}
          className="font-headline text-headline-md font-bold text-primary"
        >
          {brandName}
        </Link>
        <div className="hidden md:flex gap-gutter items-center">
          {MAIN_NAV_LINKS.map(({ label, href }) => {
            const active = isNavLinkActive(pathname, href);

            return (
              <Link
                key={href}
                href={href}
                className={
                  active
                    ? "text-secondary font-bold border-b-2 border-secondary pb-1 font-label text-label-lg"
                    : "text-on-surface-variant hover:text-secondary transition-colors duration-200 font-label text-label-lg"
                }
              >
                {label}
              </Link>
            );
          })}
        </div>
        {action ?? (
          <Link
            href={CONTACT_HREF}
            className="bg-primary-container text-on-primary-container px-md py-sm rounded-DEFAULT font-label text-label-lg hover:scale-95 active:scale-90 transition-transform inline-flex items-center"
          >
            Contact
          </Link>
        )}
      </div>
    </nav>
  );
}
