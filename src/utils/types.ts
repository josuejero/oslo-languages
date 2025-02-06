export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt?: string;
  updatedAt?: string;
  status: 'draft' | 'published';
  categories: string[];
  tags: string[];
  coverImage?: string;
  readingTime?: string;
}

export interface PostMetadata {
  title: string;
  date: string;
  excerpt: string;
  author: string;
  categories: string[];
  tags: string[];
  status: 'draft' | 'published';
  coverImage?: string;
}