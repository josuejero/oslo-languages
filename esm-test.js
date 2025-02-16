// esm-test.ts
import { remark } from 'remark';
import html from 'remark-html';

async function processMarkdown() {
  const inputMarkdown = '# Hello from esm-test';
  try {
    const processed = await remark().use(html).process(inputMarkdown);
    console.log('Processed HTML:', processed.toString());
  } catch (error) {
    console.error('Error processing markdown:', error);
  }
}

processMarkdown();
