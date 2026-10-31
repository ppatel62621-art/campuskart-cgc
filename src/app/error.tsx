"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container className="py-20 text-center">
      <h1 className="font-display text-4xl text-ink">Something broke</h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-ink-muted">
        The page hit an unexpected error. Try again, or head back to the campus home.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button href="/" variant="outline">
          Home
        </Button>
      </div>
    </Container>
  );
}
