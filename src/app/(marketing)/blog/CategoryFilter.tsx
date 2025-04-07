// src/app/(marketing)/blog/_components/CategoryFilter.tsx
'use client';

import { useState } from 'react';

export default function CategoryFilter() {
  const [category, setCategory] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    // Implement filtering functionality here
    console.log('Filtering by category:', e.target.value);
  };
  
  return (
    <div className="w-full">
      <select
        value={category}
        onChange={handleChange}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white text-gray-700"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 1rem', // Adjusted from 0.75rem to 1rem
          backgroundSize: '1rem'
        }}
      >
        <option value="">All Categories</option>
        <option value="Norwegian">Norwegian</option>
        <option value="English">English</option>
        <option value="Spanish">Spanish</option>
        <option value="School News">School News</option>
      </select>
    </div>
  );
}