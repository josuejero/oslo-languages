// src/app/(marketing)/layout.tsx
import Container from "@/components/common/Container";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove the "large" padding that's causing the 48px top/bottom
  return (
    <Container size="wide" padding="none">
      {children}
    </Container>
  );
}