// src/lib/blog.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  categories: string[];
  tags: string[];
  coverImage: string;
  content: string;
};

export async function getPostSlugs() {
  const fileNames = await fs.promises.readdir(postsDirectory);
  return fileNames.filter(fileName => fileName.endsWith('.md'));
}

export async function getPostBySlug(slug: string): Promise<BlogPost> {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = path.join(postsDirectory, `${realSlug}.md`);
  const fileContents = await fs.promises.readFile(fullPath, 'utf8');
  
  // Parse the frontmatter
  const { data, content } = matter(fileContents);
  
  // Convert markdown to HTML
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(content);

  return {
    slug: realSlug,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    author: data.author,
    categories: data.categories || [],
    tags: data.tags || [],
    coverImage: data.coverImage,
    content: processedContent.toString()
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const slugs = await getPostSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => await getPostBySlug(slug))
  );
  
  // Sort posts by date in descending order
  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => 
    post.categories.some(cat => cat.toLowerCase() === category.toLowerCase())
  );
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => 
    post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

export function generatePostPath(slug: string): string {
  return `/blog/${slug}`;
}