// src/components/courses/__tests__/CourseCalendar.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import CourseCalendar from '../CourseCalendar';
import { format } from 'date-fns';

const mockSessions = [
  {
    id: '1',
    courseId: 'course1',
    startDate: '2025-02-28T00:00:00.000Z',
    endDate: '2025-04-30T00:00:00.000Z',
    availableSeats: 5,
    schedule: 'Mon & Wed 18:00-20:00'
  },
  {
    id: '2',
    courseId: 'course1',
    startDate: '2025-04-01T00:00:00Z',
    endDate: '2025-06-01T00:00:00Z',
    availableSeats: 0,
    schedule: 'Tue & Thu 18:00-20:00'
  }
];

describe('CourseCalendar', () => {
  it('renders all sessions sorted by date', () => {
    render(<CourseCalendar sessions={mockSessions} />);
    
    const startDate = format(new Date(mockSessions[0].startDate), 'MMMM d, yyyy');
    const endDate = format(new Date(mockSessions[0].endDate), 'MMMM d, yyyy');
    const dateText = `${startDate} - ${endDate}`;
    
    expect(screen.getByText(dateText)).toBeInTheDocument();
  });

  it('shows correct availability status', () => {
    render(<CourseCalendar sessions={mockSessions} />);
    
    expect(screen.getByText('5 seats available')).toBeInTheDocument();
    expect(screen.getByText('Waitlist only')).toBeInTheDocument();
  });

  it('calls onSessionSelect when session is selected', () => {
    const onSessionSelect = jest.fn();
    render(<CourseCalendar sessions={mockSessions} onSessionSelect={onSessionSelect} />);
    
    const selectButtons = screen.getAllByRole('button');
    fireEvent.click(selectButtons[0]);
    
    expect(onSessionSelect).toHaveBeenCalledWith(mockSessions[0]);
  });

  it('shows empty state when no sessions are available', () => {
    render(<CourseCalendar sessions={[]} />);
    
    expect(screen.getByText('No upcoming sessions scheduled')).toBeInTheDocument();
  });

  it('displays correct button text based on availability', () => {
    render(<CourseCalendar sessions={mockSessions} />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveTextContent('Select Date');
    expect(buttons[1]).toHaveTextContent('Join Waitlist');
  });

  it('handles undefined onSessionSelect prop', () => {
    render(<CourseCalendar sessions={mockSessions} />);
    
    const selectButton = screen.getAllByRole('button')[0];
    expect(() => fireEvent.click(selectButton)).not.toThrow();
  });

  it('applies correct styles based on availability', () => {
    render(<CourseCalendar sessions={mockSessions} />);
    
    const availableStatus = screen.getByText('5 seats available');
    const waitlistStatus = screen.getByText('Waitlist only');
    
    expect(availableStatus).toHaveClass('bg-green-100', 'text-green-800');
    expect(waitlistStatus).toHaveClass('bg-red-100', 'text-red-800');
  });
});