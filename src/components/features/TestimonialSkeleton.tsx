// TestimonialSkeleton.tsx
'use client';

export default function TestimonialSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 relative">
      <div className="animate-pulse">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
          </div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
