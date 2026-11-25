"use client";

import type { BudgetFit, InteriorEstimate } from "@/types/interiors";
import {
  formatINR,
  formatLakh,
  formatNumber,
  SCOPE_LABELS,
  TIER_LABELS,
} from "@/lib/interiors/format";

const FIT_STYLES: Record<
  BudgetFit,
  { bg: string; text: string; icon: string; label: string }
> = {
  within: {
    bg: "bg-secondary-container",
    text: "text-on-secondary-container",
    icon: "check_circle",
    label: "Within budget",
  },
  slightly_over: {
    bg: "bg-tertiary-container",
    text: "text-on-tertiary-container",
    icon: "info",
    label: "Slightly over budget",
  },
  over: {
    bg: "bg-error-container",
    text: "text-on-error-container",
    icon: "warning",
    label: "Over budget",
  },
};

const chip =
  "inline-flex items-center rounded-full px-sm py-xs font-label text-label-sm leading-none";

export function InteriorEstimateCard({ estimate }: { estimate: InteriorEstimate }) {
  const fit = estimate.budgetFit ? FIT_STYLES[estimate.budgetFit] : null;

  return (
    <div className="flex flex-col gap-sm text-left">
      <div className="flex flex-wrap items-center gap-xs">
        <span className={`${chip} bg-primary text-on-primary`}>
          Indicative estimate
        </span>
        <span className={`${chip} bg-surface-container text-on-surface-variant`}>
          {SCOPE_LABELS[estimate.scope]}
        </span>
        <span className={`${chip} bg-surface-container text-on-surface-variant`}>
          {TIER_LABELS[estimate.tier]}
        </span>
      </div>

      <h3 className="font-headline text-headline-sm leading-snug text-primary">
        {estimate.propertyLabel} · ~{formatNumber(estimate.carpetAreaSqft)} sqft
      </h3>

      <div className="rounded-lg border border-outline-variant/10 bg-surface-container-low p-sm">
        <p className="font-label text-label-sm text-on-surface-variant">
          Estimated total
        </p>
        <p className="font-headline text-headline-sm font-semibold leading-snug text-primary">
          {formatLakh(estimate.grandTotal)}
        </p>
        <p className="font-body text-body-sm text-on-surface-variant">
          ≈ {formatINR(estimate.perSqft)}/sqft · Materials{" "}
          {formatLakh(estimate.materialTotal)} · Labour{" "}
          {formatLakh(estimate.labourTotal)}
        </p>
      </div>

      {fit && estimate.budget ? (
        <div className={`rounded-lg p-sm ${fit.bg} ${fit.text}`}>
          <p className="flex items-center gap-xs font-label text-label-sm">
            <span className="material-symbols-outlined text-base">{fit.icon}</span>
            {fit.label} ({formatLakh(estimate.budget)})
          </p>
          {estimate.budgetAdvice ? (
            <p className="mt-xs font-body text-body-sm leading-relaxed">
              {estimate.budgetAdvice}
            </p>
          ) : null}
        </div>
      ) : null}

      <ul className="flex flex-col gap-xs">
        {estimate.lines.map((line) => (
          <li
            key={line.trade}
            className="rounded-lg border border-outline-variant/10 p-sm"
          >
            <div className="flex items-start justify-between gap-sm">
              <p className="flex min-w-0 items-center gap-xs font-label text-label-sm text-on-surface">
                <span className="material-symbols-outlined shrink-0 text-base text-primary">
                  {line.icon}
                </span>
                {line.label}
              </p>
              <p className="shrink-0 font-headline text-body-md font-semibold text-primary">
                {formatLakh(line.total)}
              </p>
            </div>
            <ul className="mt-xs space-y-0.5">
              {line.quantities.map((q) => (
                <li
                  key={q.item}
                  className="flex justify-between gap-sm font-body text-body-sm text-on-surface-variant"
                >
                  <span className="min-w-0">{q.item}</span>
                  <span className="shrink-0 text-on-surface">
                    {formatNumber(q.quantity)} {q.unit}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-xs font-body text-[11px] leading-snug text-on-surface-variant">
              Material {formatINR(line.materialCost)} (@{" "}
              {formatINR(line.materialRate)}) · Labour{" "}
              {formatINR(line.labourCost)} (@ {formatINR(line.labourRate)}) per{" "}
              {line.rateUnit}
            </p>
            <p className="font-body text-[11px] leading-snug text-on-surface-variant">
              Brands: {line.brands.join(", ")}
            </p>
          </li>
        ))}
      </ul>

      <EstimateSection title="Material guidance" icon="construction">
        {estimate.lines.map((line) => (
          <li key={line.trade}>
            <span className="font-semibold text-on-surface">{line.label}:</span>{" "}
            {line.guidance}
          </li>
        ))}
      </EstimateSection>

      {estimate.assumptions.length > 0 ? (
        <ul className="list-disc space-y-0.5 pl-md font-body text-[11px] leading-snug text-on-surface-variant">
          {estimate.assumptions.map((assumption) => (
            <li key={assumption}>{assumption}</li>
          ))}
        </ul>
      ) : null}

      <p className="font-body text-[11px] leading-snug text-on-surface-variant/80">
        {estimate.disclaimer}
      </p>
    </div>
  );
}

function EstimateSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group rounded-lg border border-outline-variant/10 p-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between font-label text-label-sm text-primary">
        <span className="flex items-center gap-xs">
          <span className="material-symbols-outlined text-base">{icon}</span>
          {title}
        </span>
        <span className="material-symbols-outlined text-base transition-transform group-open:rotate-180">
          expand_more
        </span>
      </summary>
      <ul className="mt-sm list-disc space-y-xs pl-md font-body text-body-sm leading-relaxed text-on-surface-variant">
        {children}
      </ul>
    </details>
  );
}
