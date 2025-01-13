// src/components/blog/TableOfContents.tsx
import { useState, useEffect, RefObject } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TableOfContentsProps {
  contentRef: RefObject<HTMLDivElement>;
  maxDepth?: number;
}

interface HeadingData {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ 
  contentRef, 
  maxDepth = 3 
}: TableOfContentsProps) {
  const [headings, setHeadings] = useState<HeadingData[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!contentRef.current) return;

    // Get all headings up to the specified depth
    const validHeadingLevels = Array.from(
      { length: maxDepth }, 
      (_, i) => `h${i + 2}`
    ).join(', ');
    
    const elements = Array.from(
      contentRef.current.querySelectorAll(validHeadingLevels)
    ) as HTMLHeadingElement[];

    // Process headings
    const headingData = elements.map((heading) => {
      // Add IDs to headings if they don't have them
      if (!heading.id) {
        heading.id = heading.textContent?.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') || `heading-${Math.random().toString(36).substr(2, 9)}`;
      }

      return {
        id: heading.id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1)),
      };
    });

    setHeadings(headingData);

    // Set up intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { 
        rootMargin: '-20% 0px -60% 0px',
        threshold: 1.0 
      }
    );

    elements.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, [contentRef, maxDepth]);

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="bg-gray-50 rounded-lg p-4 mb-8 border border-gray-200"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Table of Contents
        </h2>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? "Expand table of contents" : "Collapse table of contents"}
        >
          {isCollapsed ? (
            <ChevronDown className="w-5 h-5" aria-hidden="true" />
          ) : (
            <ChevronUp className="w-5 h-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <ul 
          className="space-y-2" 
          role="list"
          aria-label="Page sections"
        >
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{
                paddingLeft: `${(heading.level - 2) * 1}rem`
              }}
            >
              <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(heading.id)?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest',
                  });
                }}
                className={`
                  block py-1 px-2 rounded
                  text-sm 
                  ${activeId === heading.id
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-600 hover:text-blue-600'
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                `}
                aria-current={activeId === heading.id ? 'location' : undefined}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}