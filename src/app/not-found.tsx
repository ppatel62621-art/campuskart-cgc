import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";

export default function NotFound() {
  return (
    <Container className="py-20 text-center">
      <h1 className="font-display text-4xl text-ink">This stall is empty</h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-ink-muted">
        The page you wanted is not on CampusKart yet.
      </p>
      <Button href="/" className="mt-6">
        Back to campus
      </Button>
    </Container>
  );
}
