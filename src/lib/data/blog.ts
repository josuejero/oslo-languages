
import fs from 'fs';
import path from 'path';


export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  date: string;
  author: string;
  imageUrl?: string;
  category: string;
  tags?: string[];
  relatedPosts?: number[];
}


const DATA_PATH = path.join(process.cwd(), 'src/data/blog/posts.json');


function readPostsFile(): BlogPost[] {
  if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, JSON.stringify([]), 'utf8');
    return [];
  }
  const fileContent = fs.readFileSync(DATA_PATH, 'utf8');
  return JSON.parse(fileContent);
}


function writePostsFile(posts: BlogPost[]): void {
  const dirPath = path.dirname(DATA_PATH);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  fs.writeFileSync(DATA_PATH, JSON.stringify(posts, null, 2), 'utf8');
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const posts = readPostsFile();
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = readPostsFile();
  return posts.find(post => post.slug === slug) || null;
}

export async function savePost(post: BlogPost): Promise<BlogPost> {
  const posts = readPostsFile();
  
  if (post.id) {
    
    const index = posts.findIndex(p => p.id === post.id);
    if (index !== -1) {
      posts[index] = { ...post };
      writePostsFile(posts);
      return post;
    }
  }
  
  
  const newPost = {
    ...post,
    id: Math.max(0, ...posts.map(p => p.id)) + 1
  };
  posts.push(newPost);
  writePostsFile(posts);
  return newPost;
}

export async function deletePost(id: number): Promise<BlogPost> {
  const posts = readPostsFile();
  const index = posts.findIndex(post => post.id === id);
  
  if (index === -1) {
    throw new Error(`Post with id ${id} not found`);
  }
  
  const deletedPost = posts[index];
  posts.splice(index, 1);
  writePostsFile(posts);
  
  return deletedPost;
}