import React, { useState } from 'react';
import { format, parseISO, isFuture } from 'date-fns';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Session {
  id: string;
  startDate: string;
  endDate: string;
  availableSeats: number;
  schedule: string;
  location: string;
  isOnline: boolean;
}

interface Props {
  sessions: Session[];
  onSessionSelect: (session: Session) => void;
}

export default function CourseCalendar({ sessions, onSessionSelect }: Props) {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // Filter out past sessions and sort by date
  const availableSessions = sessions
    .filter(session => isFuture(parseISO(session.startDate)))
    .sort((a, b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime());

  const handleSessionSelect = (session: Session) => {
    setSelectedSessionId(session.id);
    onSessionSelect(session);
  };

  if (availableSessions.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No upcoming sessions are currently scheduled. Please contact us for more information.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Available Sessions</h3>
      <div className="grid gap-4">
        {availableSessions.map((session) => (
          <div
            key={session.id}
            className={`p-4 rounded-lg border transition-colors ${
              selectedSessionId === session.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <button
              onClick={() => handleSessionSelect(session)}
              className="w-full text-left"
              disabled={session.availableSeats === 0}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">
                    {format(parseISO(session.startDate), 'MMMM d, yyyy')} - {' '}
                    {format(parseISO(session.endDate), 'MMMM d, yyyy')}
                  </p>
                  <p className="text-sm text-gray-600">{session.schedule}</p>
                  <p className="text-sm text-gray-600">
                    {session.isOnline ? 'Online Course' : `Location: ${session.location}`}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    session.availableSeats > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {session.availableSeats > 0
                    ? `${session.availableSeats} seats available`
                    : 'Waitlist only'
                  }
                </span>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}