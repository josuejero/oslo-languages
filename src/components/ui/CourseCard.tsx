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
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white h-full flex flex-col">
      <div className="relative h-48 w-full">
        <Image 
          src={imageUrl} 
          alt={title} 
          fill 
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <div className="mb-auto">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {level}
            </span>
          </div>
          <p className="text-gray-600 mb-4">{description}</p>
        </div>
        <Link 
          href={`/contact?course=${slug}`} 
          className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors text-center"
        >
          Inquire Now
        </Link>
      </div>
    </div>
  );
}