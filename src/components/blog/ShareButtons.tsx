// src/components/blog/ShareButtons.tsx
import { Twitter, Linkedin, Mail } from 'lucide-react';
import { useState } from 'react';


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

// Define a ShareButton component to handle aria-pressed state
  function ShareButton({ link }: { link: typeof shareLinks[0] }) {
      const [pressed, setPressed] = useState(false);
      const handleClick = () => {
        setPressed(true);
        if(link.name === 'Email') {
          window.location.href = link.href;
        } else {
          window.open(link.href, '_blank', 'noopener,noreferrer');
        }
        setTimeout(() => setPressed(false), 1000);
      };
  
      const Icon = link.icon;
      return (
        <li key={link.name}>
          <button
            type="button"
            onClick={handleClick}
            aria-label={`Share on ${link.name}`}
            aria-pressed={pressed}
            className={`
              inline-flex items-center justify-center w-8 h-8
              ${link.color} hover:opacity-80 transition-opacity
              focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full
            `}
          >
            <Icon className="w-5 h-5" aria-hidden="true" />
          </button>
        </li>
      );
    }
  
    return (
      <div role="region" aria-label="Share this post" className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Share:</span>
        <ul className="flex gap-4" role="list">
          {shareLinks.map((link) => (
            <ShareButton key={link.name} link={link} />
          ))}
        </ul>
      </div>
    );
}