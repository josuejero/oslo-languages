import React from 'react';
import { format, parseISO } from 'date-fns';

interface CourseSession {
  id: string;
  courseId: string;
  startDate: string;
  endDate: string;
  availableSeats: number;
  schedule: string;
}

interface CourseCalendarProps {
  sessions: CourseSession[];
  onSessionSelect?: (session: CourseSession) => void;
}

export default function CourseCalendar({ sessions, onSessionSelect }: CourseCalendarProps) {
  const sortedSessions = [...sessions].sort(
    (a, b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime()
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold">Upcoming Course Dates</h3>
      </div>
      
      <div className="divide-y">
        {sortedSessions.map((session) => (
          <div
            key={session.id}
            className="p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium">
                  {format(parseISO(session.startDate), 'MMMM d, yyyy')} - {' '}
                  {format(parseISO(session.endDate), 'MMMM d, yyyy')}
                </p>
                <p className="text-sm text-gray-600">{session.schedule}</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex px-2 py-1 text-sm rounded-full ${
                  session.availableSeats > 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {session.availableSeats > 0
                    ? `${session.availableSeats} seats available`
                    : 'Waitlist only'
                  }
                </span>
              </div>
            </div>
            
            <button
              onClick={() => onSessionSelect?.(session)}
              className={`w-full mt-4 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                session.availableSeats > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {session.availableSeats > 0 ? 'Select Date' : 'Join Waitlist'}
            </button>
          </div>
        ))}

        {sortedSessions.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No upcoming sessions scheduled
          </div>
        )}
      </div>
    </div>
  );
}