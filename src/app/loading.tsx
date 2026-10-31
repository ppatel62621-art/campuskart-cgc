import { Container } from "@/components/layout/Container";

export default function Loading() {
  return (
    <Container className="py-20">
      <div className="h-8 w-48 animate-pulse rounded-full bg-stone-200" />
      <div className="mt-6 h-40 animate-pulse rounded-3xl bg-stone-200" />
    </Container>
  );
}
