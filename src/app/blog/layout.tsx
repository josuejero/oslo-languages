// src/app/blog/layout.tsx
import Container from "@/components/templates/Container";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container size="narrow" padding="default">
      {children}
    </Container>
  );
}