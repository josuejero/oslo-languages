// src/pages/debug.tsx (create this new file)
import { useEffect } from 'react';

export default function DebugPage() {
  useEffect(() => {
    console.log('debug: Component mounted');
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
      <p>If you can see this page, basic rendering is working.</p>
    </div>
  );
}