"use client";

import type { ReactNode } from "react";

type FilterBarProps = {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
};

export function FilterBar({ children, columns = 4 }: FilterBarProps) {
  const gridClass =
    columns === 1
      ? "grid-cols-1"
      : columns === 2
        ? "grid-cols-1 md:grid-cols-2"
        : columns === 3
          ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
          : "grid-cols-1 md:grid-cols-2 xl:grid-cols-4";

  return (
    <div
      className={`grid gap-4 rounded-2xl border border-outline-variant/10 bg-white p-4 shadow-sm sm:p-5 ${gridClass}`}
    >
      {children}
    </div>
  );
}

export function FilterField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="admin-field min-w-0">
      <span className="admin-label">{label}</span>
      {children}
    </label>
  );
}

export function filterSelectClassName() {
  return "admin-select";
}

export function filterInputClassName() {
  return "admin-input !py-2.5 !text-body-sm";
}
