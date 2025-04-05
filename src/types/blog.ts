export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  imageUrl: string;
  category: string;
  tags?: string[];
  readingTime?: string;
  relatedPosts?: number[];
}

export interface BlogPostSummary extends Omit<BlogPost, 'content'> {
  // BlogPostSummary contains all BlogPost properties except content
}
