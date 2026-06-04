"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  BRAND_LOGO_SRC,
  BRAND_NAME,
  CONTACT_HREF,
  MAIN_NAV_LINKS,
} from "@/utils/constants";

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

function navLinkClass(active: boolean, mobile = false): string {
  if (mobile) {
    return active
      ? "block rounded-DEFAULT bg-surface-container-low px-md py-sm font-label text-label-lg font-bold text-secondary"
      : "block rounded-DEFAULT px-md py-sm font-label text-label-lg text-on-surface-variant hover:bg-surface-container-low hover:text-secondary transition-colors";
  }

  return active
    ? "text-secondary font-bold border-b-2 border-secondary pb-1 font-label text-label-lg"
    : "text-on-surface-variant hover:text-secondary transition-colors duration-200 font-label text-label-lg";
}

type MobileNavMenuProps = {
  pathname: string;
  action?: ReactNode;
};

function MobileNavMenu({ pathname, action }: MobileNavMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const mobileAction = action ?? (
    <Link
      href={CONTACT_HREF}
      onClick={closeMenu}
      className="inline-flex w-full items-center justify-center rounded-DEFAULT bg-primary-container px-md py-sm font-label text-label-lg text-on-primary-container transition-transform hover:scale-95 active:scale-90"
    >
      Contact
    </Link>
  );

  useEffect(() => {
    if (!menuOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen, closeMenu]);

  return (
    <>
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-DEFAULT text-on-surface-variant hover:bg-surface-container-low transition-colors lg:hidden"
        aria-expanded={menuOpen}
        aria-controls="mobile-nav-menu"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className="material-symbols-outlined text-2xl">
          {menuOpen ? "close" : "menu"}
        </span>
      </button>

      {menuOpen && (
        <div
          id="mobile-nav-menu"
          className="absolute left-0 right-0 top-full border-t border-outline-variant/10 bg-white/95 backdrop-blur-md lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-xs px-margin-mobile py-md">
            {MAIN_NAV_LINKS.map(({ label, href }) => {
              const active = isNavLinkActive(pathname, href);

              return (
                <Link
                  key={href}
                  href={href}
                  className={navLinkClass(active, true)}
                  onClick={closeMenu}
                >
                  {label}
                </Link>
              );
            })}
            <div className="pt-sm">{mobileAction}</div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Navbar({
  brandName = BRAND_NAME,
  brandHref = "/",
  action,
}: NavbarProps) {
  const pathname = usePathname();

  const defaultAction = (
    <Link
      href={CONTACT_HREF}
      className="bg-primary-container text-on-primary-container px-md py-sm rounded-DEFAULT font-label text-label-lg hover:scale-95 active:scale-90 transition-transform inline-flex items-center justify-center"
    >
      Contact
    </Link>
  );

  const actionNode = action ?? defaultAction;

  return (
    <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
      <div className="relative mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-sm px-margin-mobile sm:h-[4.75rem] lg:px-margin-desktop">
        <Link
          href={brandHref}
          className="flex shrink-0 items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label={`${brandName} home`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BRAND_LOGO_SRC}
            alt={brandName}
            width={785}
            height={439}
            className="h-12 w-auto max-h-[3.25rem] max-w-[min(17.5rem,72vw)] object-contain object-left sm:h-14 sm:max-h-[3.75rem] lg:h-16 lg:max-h-[4rem] lg:max-w-[20rem]"
          />
        </Link>

        <div className="hidden items-center gap-gutter lg:flex">
          {MAIN_NAV_LINKS.map(({ label, href }) => {
            const active = isNavLinkActive(pathname, href);

            return (
              <Link key={href} href={href} className={navLinkClass(active)}>
                {label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-sm">
          <div className="hidden lg:block">{actionNode}</div>
          <MobileNavMenu key={pathname} pathname={pathname} action={action} />
        </div>
      </div>
    </nav>
  );
}
