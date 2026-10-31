import { Button } from "@/components/ui/Button";

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center">
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">{description}</p>
      {actionLabel && actionHref ? (
        <Button href={actionHref} className="mt-6">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
