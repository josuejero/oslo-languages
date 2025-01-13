// src/components/blog/ShareButtons.tsx
import { Twitter, Linkedin, Mail } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url: string;
  description: string;
}

export default function ShareButtons({ title, url, description }: ShareButtonsProps) {
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${url}`
    : url;

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = [
    {
      name: 'Twitter',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: Twitter,
      color: 'text-[#1DA1F2]'
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
      icon: Linkedin,
      color: 'text-[#0A66C2]'
    },
    {
      name: 'Email',
      href: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
      icon: Mail,
      color: 'text-gray-600'
    }
  ];

  return (
    <div 
      role="region" 
      aria-label="Share this post" 
      className="flex items-center gap-4"
    >
      <span className="text-sm font-medium text-gray-700">Share:</span>
      <ul className="flex gap-4" role="list">
        {shareLinks.map((link) => {
          const Icon = link.icon;
          return (
            <li key={link.name}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  inline-flex items-center justify-center w-8 h-8
                  ${link.color} hover:opacity-80 transition-opacity
                  focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full
                `}
                aria-label={`Share on ${link.name}`}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}