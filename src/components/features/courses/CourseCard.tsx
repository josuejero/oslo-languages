
import Link from 'next/link';
import Image from 'next/image';


export interface CourseCardProps {
  title: string;
  level: string;
  description: string;
  imageUrl?: string; 
  slug: string;
  ctaText?: string;
  ctaPath?: string;
}

export default function CourseCard({ 
  title, 
  level, 
  description, 
  imageUrl = '/images/default-course.jpg',
  slug,
  ctaText = 'Inquire Now',
  ctaPath = `/contact?course=${slug}`
}: CourseCardProps) {
  return (
    
    
    <div className="card flex flex-col h-full transition-all duration-300 hover:shadow-lg animate-fadeIn">
      <div className="relative h-48 w-full">
        <Image 
          src={imageUrl} 
          alt={title} 
          fill 
          className="object-cover rounded-t-lg"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <div className="mb-auto">
          <div className="flex justify-between items-start mb-2">
            {}
            <h3 className="font-semibold text-lg text-text-primary">{title}</h3>
            {}
            <span className="bg-status-success text-text-inverse text-xs px-2 py-1 rounded-full">
              {level}
            </span>
          </div>
          {}
          <p className="text-text-secondary mb-4">{description}</p>
        </div>
        <Link 
          href={ctaPath}
          className="bg-action-primary hover:bg-action-primaryHover text-text-inverse text-center py-2 px-4 rounded 
                     transition-all duration-300 hover:-translate-y-1 transform focus:ring-2 focus:ring-focus-ring focus:outline-none"
        >
          {ctaText}
        </Link>
      </div>
    </div>
  );
}