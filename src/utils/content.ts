// src/lib/content.ts
import fs from 'fs/promises';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export interface PageContent {
  title: string;
  content: string;
  lastUpdated?: string;
}

export async function getPageContent(section: string): Promise<PageContent> {
  try {
    const filePath = path.join(CONTENT_DIR, `${section}.json`);
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch {
    return {
      title: '',
      content: '',
    };
  }
}
export async function updatePageContent(
  section: string,
  content: PageContent
): Promise<void> {
  const filePath = path.join(CONTENT_DIR, `${section}.json`);
  await fs.writeFile(
    filePath,
    JSON.stringify({
      ...content,
      lastUpdated: new Date().toISOString()
    }, null, 2)
  );
}