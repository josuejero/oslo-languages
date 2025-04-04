// src/app/admin/layout.tsx
import { redirect } from 'next/navigation';
import Container from "@/components/templates/Container";
import { cookies } from 'next/headers';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Simple server-side authentication check
  const cookieStore = cookies();
  const isAuthenticated = cookieStore.has('admin_authenticated');
  
  // If not authenticated and not on login page, redirect to login
  const isLoginPage = typeof window !== 'undefined' && 
    window.location.pathname === '/admin/login';
    
  if (!isAuthenticated && !isLoginPage) {
    redirect('/admin/login');
  }

  return (
    <Container size="default" padding="default" className="bg-gray-50">
      {children}
    </Container>
  );
}