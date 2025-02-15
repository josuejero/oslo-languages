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
    // Inject Tailwind Typography classes for headings and paragraphs
    let styledContent = cleanContent
      .replace(/<h1>/g, '<h1 class="prose-h1">')
      .replace(/<h2>/g, '<h2 class="prose-h2">')
      .replace(/<p>/g, '<p class="prose-p">');
    // If a code block has a language class on the <code> element,
    // propagate it to the wrapping <pre> for syntax highlighting.
    styledContent = styledContent.replace(/<pre>\s*<code class="([^"]+)">/g, '<pre class="$1"><code class="$1">');

  return (
    <div
    data-testid="rich-content"
      className={`prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: styledContent }}
    />
  );
}