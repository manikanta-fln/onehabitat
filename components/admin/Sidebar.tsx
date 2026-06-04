"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BRAND_NAME } from "@/utils/constants";
import { useAdminSession } from "@/hooks/admin/use-admin-session";
import { adminLogout } from "@/services/admin/api-client";

export const ADMIN_NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/issues", label: "Issues", icon: "report" },
  { href: "/admin/bookings", label: "Bookings", icon: "event_available" },
  { href: "/admin/consultations", label: "Consultations", icon: "support_agent" },
  { href: "/admin/customers", label: "Customers", icon: "groups" },
  { href: "/admin/analytics", label: "Analytics", icon: "monitoring" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
  { href: "/admin/users", label: "Users", icon: "shield_person" },
] as const;

function NavLinks({
  pathname,
  onNavigate,
  className = "",
}: {
  pathname: string;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <nav className={`space-y-1 ${className}`}>
      {ADMIN_NAV_ITEMS.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-xl px-3 py-3 font-label text-label-lg leading-none transition-all ${
              active
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined shrink-0 text-[1.375rem] leading-none">
              {item.icon}
            </span>
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function UserSummary() {
  const { data } = useAdminSession();

  return (
    <div className="rounded-xl bg-surface-container-low p-4 text-left">
      <p className="font-label text-label-sm text-on-surface-variant">Signed in as</p>
      <p className="mt-1 truncate font-headline text-headline-sm">
        {data?.user.name ?? "Admin"}
      </p>
      <p className="truncate font-body text-body-sm text-on-surface-variant">
        {data?.user.email}
      </p>
    </div>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [menuState, setMenuState] = useState({ open: false, path: pathname });
  const isMenuOpen = menuState.open && menuState.path === pathname;

  function closeMenu() {
    setMenuState({ open: false, path: pathname });
  }

  function toggleMenu() {
    if (isMenuOpen) {
      closeMenu();
      return;
    }

    setMenuState({ open: true, path: pathname });
  }

  useEffect(() => {
    function handleResize() {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setMenuState({ open: false, path: pathname });
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuState({ open: false, path: pathname });
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen, pathname]);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] flex-col border-r border-outline-variant/15 bg-white/95 backdrop-blur-xl lg:flex">
        <div className="flex h-16 shrink-0 items-center border-b border-outline-variant/10 px-6">
          <div className="min-w-0 text-left">
            <p className="truncate font-headline text-headline-sm text-primary">
              {BRAND_NAME}
            </p>
            <p className="truncate font-label text-label-sm text-on-surface-variant">
              Admin Console
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          <NavLinks pathname={pathname} />
        </div>

        <div className="shrink-0 border-t border-outline-variant/10 p-4">
          <UserSummary />
        </div>
      </aside>

      <header className="admin-mobile-header lg:hidden">
        <button
          type="button"
          className="admin-mobile-menu-button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="admin-mobile-nav-drawer"
          onClick={toggleMenu}
        >
          <span className="material-symbols-outlined text-[1.5rem] leading-none">
            {isMenuOpen ? "close" : "menu"}
          </span>
        </button>

        <div className="min-w-0 flex-1 text-left">
          <p className="truncate font-headline text-headline-sm text-primary">
            {BRAND_NAME}
          </p>
          <p className="truncate font-label text-[11px] text-on-surface-variant">
            Admin Console
          </p>
        </div>
      </header>

      {isMenuOpen ? (
        <div className="admin-mobile-nav lg:hidden">
          <button
            type="button"
            className="admin-mobile-nav__backdrop"
            aria-label="Close navigation menu"
            onClick={closeMenu}
          />
          <aside
            id="admin-mobile-nav-drawer"
            className="admin-mobile-nav__drawer"
            aria-label="Admin navigation"
          >
            <div className="flex items-center justify-between gap-3 border-b border-outline-variant/10 px-4 py-4">
              <div className="min-w-0 text-left">
                <p className="truncate font-headline text-headline-sm text-primary">
                  {BRAND_NAME}
                </p>
                <p className="truncate font-label text-label-sm text-on-surface-variant">
                  Admin Console
                </p>
              </div>
              <button
                type="button"
                className="admin-modal-close"
                aria-label="Close navigation menu"
                onClick={closeMenu}
              >
                <span className="material-symbols-outlined leading-none">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4">
              <NavLinks pathname={pathname} onNavigate={closeMenu} />
            </div>

            <div className="shrink-0 space-y-3 border-t border-outline-variant/10 p-4">
              <UserSummary />
              <button
                type="button"
                onClick={() => void adminLogout()}
                className="admin-btn-secondary w-full"
              >
                <span className="material-symbols-outlined text-[1.125rem] leading-none">
                  logout
                </span>
                Sign out
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
