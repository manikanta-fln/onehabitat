import type { AIRecommendation } from "@/types/upload-issue";

function DiagnosticList({
  title,
  items,
  icon,
}: {
  title: string;
  items: string[];
  icon: string;
}) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-lg border border-outline-variant/10 bg-surface-container-low p-md">
      <h4 className="mb-sm flex items-center gap-xs font-headline text-headline-sm leading-snug text-on-surface">
        <span className="material-symbols-outlined shrink-0 text-xl text-secondary">
          {icon}
        </span>
        <span>{title}</span>
      </h4>
      <ul className="space-y-sm">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-sm text-left font-body text-body-sm leading-relaxed text-on-surface-variant"
          >
            <span className="material-symbols-outlined mt-0.5 shrink-0 text-base text-primary">
              check_circle
            </span>
            <span className="min-w-0 flex-1">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function IssueDiagnosticDetails({
  diagnostic,
}: {
  diagnostic: NonNullable<AIRecommendation["diagnostic"]>;
}) {
  return (
    <div className="flex flex-col gap-md text-left">
      {typeof diagnostic.confidence_score === "number" ? (
        <p className="font-body text-body-sm text-on-surface-variant">
          AI confidence:{" "}
          <strong className="font-semibold text-on-surface">
            {diagnostic.confidence_score}%
          </strong>
        </p>
      ) : null}

      <DiagnosticList
        title="Visible observations"
        items={diagnostic.visible_observations}
        icon="visibility"
      />

      <DiagnosticList
        title="Possible causes"
        items={diagnostic.possible_causes}
        icon="help"
      />

      <div className="rounded-lg border border-outline-variant/10 bg-surface-container-low p-md">
        <h4 className="mb-sm font-headline text-headline-sm leading-snug text-on-surface">
          Recommended service
        </h4>
        <p className="font-body text-body-sm leading-relaxed text-on-surface-variant">
          {diagnostic.recommended_solution.primary_service_required}
        </p>
        <p className="mt-sm font-body text-body-sm leading-relaxed text-on-surface-variant">
          Professional:{" "}
          <span className="font-medium text-on-surface">
            {diagnostic.recommended_solution.recommended_professional.replace(/_/g, " ")}
          </span>
        </p>
      </div>

      <div className="rounded-lg border border-outline-variant/10 p-md text-left">
        <p className="font-label text-label-sm leading-snug text-on-surface-variant">
          Urgency
        </p>
        <p className="mt-xs font-body text-body-sm leading-relaxed text-on-surface-variant">
          {diagnostic.urgency_reason}
        </p>
      </div>

      {diagnostic.safety_warnings.length > 0 ? (
        <div className="rounded-lg border border-error/20 bg-error-container/20 p-md">
          <h4 className="mb-sm font-headline text-headline-sm leading-snug text-on-error-container">
            Safety warnings
          </h4>
          <ul className="space-y-sm">
            {diagnostic.safety_warnings.map((warning) => (
              <li
                key={warning}
                className="font-body text-body-sm leading-relaxed text-on-error-container"
              >
                {warning}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <DiagnosticList
        title="Questions for customer"
        items={diagnostic.questions_for_customer}
        icon="quiz"
      />

      <div className="rounded-lg border border-outline-variant/10 p-md text-left">
        <p className="font-label text-label-sm leading-snug text-on-surface-variant">
          Service complexity
        </p>
        <p className="mt-xs font-body text-body-sm leading-relaxed text-on-surface-variant capitalize">
          {diagnostic.estimated_service_complexity.replace(/_/g, " ")}
        </p>
      </div>

      <div className="rounded-lg border border-outline-variant/10 p-md text-left">
        <p className="font-label text-label-sm leading-snug text-on-surface-variant">
          Limitations
        </p>
        <p className="mt-xs font-body text-body-sm leading-relaxed text-on-surface-variant">
          {diagnostic.limitations}
        </p>
      </div>
    </div>
  );
}

export function IssueRecommendationSummary({
  recommendation,
}: {
  recommendation: AIRecommendation;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center rounded-full bg-surface-container-high px-3 py-1 font-label text-label-sm capitalize">
          {recommendation.severity} priority
        </span>
        <span className="inline-flex items-center rounded-full bg-surface-container-high px-3 py-1 font-label text-label-sm">
          {recommendation.category}
        </span>
        {typeof recommendation.confidenceScore === "number" ? (
          <span className="inline-flex items-center rounded-full bg-primary-container px-3 py-1 font-label text-label-sm text-on-primary-container">
            {recommendation.confidenceScore}% confidence
          </span>
        ) : null}
      </div>

      <p className="font-body text-body-md text-on-surface-variant">{recommendation.summary}</p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-surface-container-low p-4">
          <p className="font-label text-label-sm text-on-surface-variant">Estimated cost</p>
          <p className="mt-1 font-headline text-headline-sm">{recommendation.estimatedCost}</p>
        </div>
        <div className="rounded-xl bg-surface-container-low p-4">
          <p className="font-label text-label-sm text-on-surface-variant">Duration</p>
          <p className="mt-1 font-headline text-headline-sm">{recommendation.estimatedDuration}</p>
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-headline text-headline-sm">Recommended approach</h3>
        <ul className="space-y-2">
          {recommendation.solutions.map((solution) => (
            <li key={solution} className="flex gap-2 font-body text-body-sm">
              <span className="material-symbols-outlined text-primary text-base">check_circle</span>
              {solution}
            </li>
          ))}
        </ul>
      </div>

      {recommendation.recommendedBookingCta ? (
        <div className="rounded-xl border border-primary/20 bg-primary-container/20 p-4">
          <p className="font-label text-label-sm text-on-surface-variant">Booking CTA</p>
          <p className="mt-1 font-body text-body-sm">{recommendation.recommendedBookingCta}</p>
        </div>
      ) : null}

      {recommendation.diagnostic ? (
        <div>
          <h3 className="mb-4 font-headline text-headline-sm">AI diagnostic details</h3>
          <IssueDiagnosticDetails diagnostic={recommendation.diagnostic} />
        </div>
      ) : null}
    </div>
  );
}
