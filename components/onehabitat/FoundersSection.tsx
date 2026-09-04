const FOUNDERS = [
  {
    name: "Reddy",
    role: "Founder",
    focus: "Operations & Execution",
    bio: "Reddy leads the field — building trusted technician networks, quality standards, and delivery systems that turn insights into work completed right the first time.",
    highlights: [
      { icon: "engineering", label: "Field Operations" },
      { icon: "verified", label: "Quality Assurance" },
      { icon: "groups", label: "Expert Network" },
    ],
    initials: "R",
    accent: "from-secondary-container/90 to-secondary-fixed/50",
  },
  {
    name: "Mohan",
    role: "Co-Founder",
    focus: "Product & Technology",
    bio: "Mohan shapes Onehabitat's product vision — blending AI diagnostics with a frictionless homeowner experience. He believes maintenance should start with clarity, not guesswork.",
    highlights: [
      { icon: "psychology", label: "AI-Powered Diagnostics" },
      { icon: "devices", label: "Digital Product Strategy" },
      { icon: "auto_awesome", label: "Customer Experience" },
    ],
    initials: "M",
    accent: "from-primary-container/80 to-primary-fixed/40",
  },
] as const;

export default function FoundersSection() {
  return (
    <section
      id="founders"
      aria-labelledby="founders-heading"
      className="scroll-mt-24 bg-white py-xl"
    >
      <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin-desktop">
        <div className="mx-auto mb-xl max-w-3xl text-center">
          <span className="inline-flex w-fit items-center gap-xs rounded-full border border-primary/20 bg-primary-container/30 px-md py-xs font-label text-label-sm text-on-primary-container">
            <span
              className="h-2 w-2 rounded-full bg-primary-container"
              aria-hidden="true"
            />
            Meet the Founders
          </span>
          <h2
            id="founders-heading"
            className="mt-md font-headline text-headline-lg text-primary"
          >
            Built by Homeowners, for Homeowners
          </h2>
          <p className="mt-md font-body text-body-lg text-on-surface-variant">
            Onehabitat started with a shared belief: every home deserves
            maintenance that is transparent, reliable, and powered by modern
            technology. Reddy and Mohan combined operational excellence with
            product innovation to make that vision real.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-gutter lg:grid-cols-2">
          {FOUNDERS.map((founder) => (
            <article
              key={founder.name}
              className="group relative overflow-hidden rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-lg shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md"
            >
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary-container/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-60"
                aria-hidden="true"
              />

              <div className="relative flex flex-col gap-md sm:flex-row sm:items-start">
                <div
                  className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${founder.accent} shadow-sm`}
                >
                  <span className="font-headline text-headline-md text-primary">
                    {founder.initials}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-label text-label-sm uppercase tracking-wider text-on-surface-variant">
                    {founder.focus}
                  </p>
                  <h3 className="mt-xs font-headline text-headline-md text-on-surface">
                    {founder.name}
                  </h3>
                  <p className="mt-xs font-label text-label-lg text-primary">
                    {founder.role}
                  </p>
                </div>
              </div>

              <p className="relative mt-md font-body text-body-md text-on-surface-variant">
                {founder.bio}
              </p>

              <ul className="relative mt-md flex flex-wrap gap-sm">
                {founder.highlights.map((item) => (
                  <li
                    key={item.label}
                    className="inline-flex items-center gap-xs rounded-full border border-outline-variant/20 bg-white px-sm py-xs font-label text-label-sm text-on-surface-variant"
                  >
                    <span className="material-symbols-outlined text-base text-primary">
                      {item.icon}
                    </span>
                    {item.label}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-xl rounded-xl border border-outline-variant/15 bg-surface-container-low p-lg md:p-xl">
          <div className="grid grid-cols-1 items-center gap-lg md:grid-cols-[1fr_auto]">
            <blockquote className="font-body text-body-lg text-on-surface">
              &ldquo;We&apos;re not just fixing homes — we&apos;re building the
              infrastructure for smarter, stress-free living. From a single leak
              to a full makeover, every homeowner deserves the same standard of
              care.&rdquo;
            </blockquote>
            <div className="flex items-center gap-sm md:flex-col md:items-end md:text-right">
              <div className="flex -space-x-2">
                {FOUNDERS.map((founder) => (
                  <div
                    key={founder.name}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br ${founder.accent} font-label text-label-sm text-primary shadow-sm`}
                    title={founder.name}
                  >
                    {founder.initials}
                  </div>
                ))}
              </div>
              <p className="font-label text-label-sm text-on-surface-variant">
                Reddy &amp; Mohan
                <span className="mt-xs block text-primary">
                  Founder &amp; Co-Founder
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
