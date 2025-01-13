// src/components/blog/RichContent.tsx
import DOMPurify from 'isomorphic-dompurify';

interface RichContentProps {
  content: string;
  className?: string;
}

export default function RichContent({ content, className = '' }: RichContentProps) {
  const config = {
    ALLOWED_TAGS: [
      'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'a', 'img',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'table', 'thead', 'tbody',
      'tr', 'th', 'td'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel',
      'width', 'height', 'style'
    ],
    ADD_ATTR: ['target'],
    FORCE_BODY: true,
  };

  const cleanContent = DOMPurify.sanitize(content, config);

  return (
    <div
      className={`prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanContent }}
    />
  );
}