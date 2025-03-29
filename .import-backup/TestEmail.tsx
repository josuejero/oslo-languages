import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function TestEmail() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const sendTestEmail = async () => {
    setStatus('loading');
    try {
      const baseUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : process.env.NEXT_PUBLIC_BASE_URL;
        
      const response = await fetch(`${baseUrl}/api/test-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Failed to send email');
      
      setStatus('success');
      setMessage('Test email sent successfully! Check your inbox.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Failed to send test email');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-4">SendGrid Integration Test</h2>
      
      {status !== 'idle' && (
        <Alert 
          variant={status === 'success' ? 'success' : 'destructive'}
          className="mb-4"
        >
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      
      <button
        onClick={sendTestEmail}
        disabled={status === 'loading'}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
      >
        {status === 'loading' ? 'Sending...' : 'Send Test Email'}
      </button>
    </div>
  );
}