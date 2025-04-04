// src/app/(marketing)/layout.tsx
import Container from "@/components/common/Container";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container size="wide" padding="large">
      {children}
    </Container>
  );
}