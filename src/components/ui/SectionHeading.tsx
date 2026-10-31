export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-campus-700">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-3 text-sm leading-6 text-ink-muted sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
