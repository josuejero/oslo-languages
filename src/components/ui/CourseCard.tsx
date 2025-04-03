// src/components/ui/CourseCard.tsx
import Link from 'next/link';
import Image from 'next/image';

interface CourseCardProps {
  title: string;
  level: string;
  description: string;
  imageUrl?: string;
  slug: string;
}

export default function CourseCard({ 
  title, 
  level, 
  description, 
  imageUrl = '/images/default-course.jpg',
  slug 
}: CourseCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image 
          src={imageUrl} 
          alt={title} 
          fill 
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">{level}</p>
        <p className="text-gray-700 mb-4">{description}</p>
        <Link 
          href={`/contact?course=${slug}`} 
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 inline-block"
        >
          Inquire Now
        </Link>
      </div>
    </div>
  );
}