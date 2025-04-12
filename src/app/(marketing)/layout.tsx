
import Container from "@/components/common/Container";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <Container size="full" padding="none">
      {children}
    </Container>
  );
}