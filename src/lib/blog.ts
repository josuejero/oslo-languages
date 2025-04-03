// src/lib/blog.ts
import fs from 'fs';
import path from 'path';

const dataDirectory = path.join(process.cwd(), 'data');
const blogFile = path.join(dataDirectory, 'blog-posts.json');

// Ensure the data directory exists
if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory, { recursive: true });
}

// Ensure the blog file exists
if (!fs.existsSync(blogFile)) {
  fs.writeFileSync(blogFile, JSON.stringify([]), 'utf8');
}

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
}

export function getAllPosts(): BlogPost[] {
  const fileContents = fs.readFileSync(blogFile, 'utf8');
  return JSON.parse(fileContents);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const posts = getAllPosts();
  return posts.find(post => post.slug === slug);
}

export function savePost(post: BlogPost): void {
  const posts = getAllPosts();
  const existingPostIndex = posts.findIndex(p => p.id === post.id);
  
  if (existingPostIndex >= 0) {
    // Update existing post
    posts[existingPostIndex] = post;
  } else {
    // Add new post with a new ID
    post.id = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
    posts.push(post);
  }
  
  fs.writeFileSync(blogFile, JSON.stringify(posts, null, 2), 'utf8');
}

export function deletePost(id: number): void {
  const posts = getAllPosts();
  const updatedPosts = posts.filter(post => post.id !== id);
  fs.writeFileSync(blogFile, JSON.stringify(updatedPosts, null, 2), 'utf8');
}