// scripts/blog-manager.ts
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { v4 as uuidv4 } from 'uuid';
import { BlogPost } from '../src/lib/blog/operations';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');
const DRAFTS_DIR = path.join(process.cwd(), 'content/drafts');

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

async function ensureDirectories() {
  await fs.mkdir(POSTS_DIR, { recursive: true });
  await fs.mkdir(DRAFTS_DIR, { recursive: true });
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

async function createPost(metadata: PostMetadata, content: string) {
  await ensureDirectories();
  
  const slug = generateSlug(metadata.title);
  const id = uuidv4();
  const date = new Date().toISOString();
  
  const postData = {
    ...metadata,
    id,
    slug,
    createdAt: date,
    updatedAt: date
  };

  const fileContent = matter.stringify(content, postData);
  const targetDir = metadata.status === 'draft' ? DRAFTS_DIR : POSTS_DIR;
  const filePath = path.join(targetDir, `${slug}.md`);

  await fs.writeFile(filePath, fileContent, 'utf8');
  return { slug, id };
}

async function updatePost(slug: string, updates: Partial<PostMetadata>, newContent?: string) {
  const oldFilePath = path.join(POSTS_DIR, `${slug}.md`);
  const oldContent = await fs.readFile(oldFilePath, 'utf8');
  const { data: oldData, content: oldContentBody } = matter(oldContent);

  const updatedData = {
    ...oldData,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  const fileContent = matter.stringify(newContent || oldContentBody, updatedData);
  
  // If status changed, move the file
  if (updates.status) {
    const targetDir = updates.status === 'draft' ? DRAFTS_DIR : POSTS_DIR;
    const newFilePath = path.join(targetDir, `${slug}.md`);
    await fs.unlink(oldFilePath);
    await fs.writeFile(newFilePath, fileContent, 'utf8');
  } else {
    await fs.writeFile(oldFilePath, fileContent, 'utf8');
  }
}

async function deletePost(slug: string) {
  const postsPath = path.join(POSTS_DIR, `${slug}.md`);
  const draftsPath = path.join(DRAFTS_DIR, `${slug}.md`);

  try {
    await fs.unlink(postsPath);
  } catch {
    try {
      await fs.unlink(draftsPath);
    } catch {
      throw new Error(`Post ${slug} not found`);
    }
  }
}

async function listPosts(status?: 'draft' | 'published'): Promise<BlogPost[]> {
  const dirs = status === 'draft' ? [DRAFTS_DIR] 
            : status === 'published' ? [POSTS_DIR]
            : [POSTS_DIR, DRAFTS_DIR];

  const posts: BlogPost[] = [];

  for (const dir of dirs) {
    try {
      const files = await fs.readdir(dir);
      for (const file of files) {
        if (!file.endsWith('.md')) continue;

        const content = await fs.readFile(path.join(dir, file), 'utf8');
        const { data, content: postContent } = matter(content);
        const slug = file.replace('.md', '');

        posts.push({
          ...data,
          slug,
          content: postContent,
        } as BlogPost);
      }
    } catch (error) {
      console.error(`Error reading directory ${dir}:`, error);
    }
  }

  return posts.sort((a, b) => 
    new Date((b as unknown as PostMetadata).date).getTime() - new Date((a as unknown as PostMetadata).date).getTime()
  );
}

export {
  createPost,
  updatePost,
  deletePost,
  listPosts,
  generateSlug,
};
export type { PostMetadata as BlogPostMetadata };