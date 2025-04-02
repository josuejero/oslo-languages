// src/pages/admin/index.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui';

export default function AdminRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/admin/dashboard');
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner />
    </div>
  );
}