
import Container from "@/components/common/Container";

export default function BlogLayout({
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