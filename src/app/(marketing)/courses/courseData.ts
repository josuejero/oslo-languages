

export type CourseColor = 'blue' | 'indigo' | 'rose';


export interface Course {
  id: string;
  title: string;
  level: string;
  language: string;
  schedule: string;
  description: string;
  icon: string;
  color: CourseColor;
  accent: string;
}


export const courses: Course[] = [
  {
    id: 'norwegian-a1',
    title: 'Norwegian Beginner Course (A1)',
    level: 'A1',
    language: 'Norwegian',
    schedule: 'Morning & Evening Classes',
    description: 'Start your Norwegian language journey with our comprehensive beginner course.',
    icon: '/images/icons/norwegian.png',
    color: 'blue',
    accent: 'emerald'
  },
  {
    id: 'business-english',
    title: 'Business English',
    level: 'B1-C1',
    language: 'English',
    schedule: 'Flexible Schedule',
    description: 'Enhance your professional English skills with our specialized business course.',
    icon: '/images/icons/english.png',
    color: 'indigo',
    accent: 'amber'
  },
  {
    id: 'spanish-a2',
    title: 'Spanish Elementary Course (A2)',
    level: 'A2',
    language: 'Spanish',
    schedule: 'Afternoon Classes',
    description: 'Build on your basic Spanish knowledge with our elementary level course.',
    icon: '/images/icons/spanish.png',
    color: 'rose',
    accent: 'violet'
  },
  {
    id: 'norwegian-a2',
    title: 'Norwegian Intermediate (A2)',
    level: 'A2',
    language: 'Norwegian',
    schedule: 'Evening Classes',
    description: 'Continue your Norwegian language development with our intermediate course.',
    icon: '/images/icons/norwegian.png',
    color: 'blue',
    accent: 'cyan'
  },
  {
    id: 'conversational-english',
    title: 'Conversational English',
    level: 'A2-B2',
    language: 'English',
    schedule: 'Weekend Classes',
    description: 'Focus on speaking and listening skills in everyday situations.',
    icon: '/images/icons/english.png',
    color: 'indigo',
    accent: 'amber'
  },
  {
    id: 'spanish-b1',
    title: 'Spanish Intermediate (B1)',
    level: 'B1',
    language: 'Spanish',
    schedule: 'Morning Classes',
    description: 'Advance your Spanish skills with our comprehensive intermediate course.',
    icon: '/images/icons/spanish.png',
    color: 'rose',
    accent: 'amber'
  }
];