#!/usr/bin/env node
// scripts/blog-cli.ts

import { program } from 'commander';
import inquirer from 'inquirer';
import { createPost, deletePost, listPosts, PostMetadata } from './blog-manager';

program
  .version('1.0.0')
  .description('Oslo Languages Blog Management CLI');

program
  .command('create')
  .description('Create a new blog post')
  .action(async () => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Post title:',
        validate: (input) => input.length > 0
      },
      {
        type: 'input',
        name: 'excerpt',
        message: 'Post excerpt:',
        validate: (input) => input.length > 0
      },
      {
        type: 'input',
        name: 'author',
        message: 'Author name:',
        validate: (input) => input.length > 0
      },
      {
        type: 'input',
        name: 'categories',
        message: 'Categories (comma-separated):',
        filter: (input) => input.split(',').map((cat: string) => cat.trim())
      },
      {
        type: 'input',
        name: 'tags',
        message: 'Tags (comma-separated):',
        filter: (input) => input.split(',').map((tag: string) => tag.trim())
      },
      {
        type: 'list',
        name: 'status',
        message: 'Post status:',
        choices: ['draft', 'published']
      },
      {
        type: 'input',
        name: 'coverImage',
        message: 'Cover image path (optional):',
      },
      {
        type: 'editor',
        name: 'content',
        message: 'Post content (in Markdown):',
      }
    ]);

    const metadata: PostMetadata = {
      title: answers.title,
      excerpt: answers.excerpt,
      author: answers.author,
      categories: answers.categories,
      tags: answers.tags,
      status: answers.status as 'draft' | 'published',
      coverImage: answers.coverImage || undefined,
      date: new Date().toISOString()
    };

    try {
      const { slug, id } = await createPost(metadata, answers.content);
      console.log(`Post created successfully!\nSlug: ${slug}\nID: ${id}`);
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  });

program
  .command('list')
  .description('List all blog posts')
  .option('-s, --status <status>', 'Filter by status (draft/published)')
  .action(async (options) => {
    try {
      const posts = await listPosts(options.status);
      console.table(posts.map(post => ({
        Title: post.title,
        Author: post.author,
        Status: post.status,
        Date: post.publishedAt
      })));
    } catch (error) {
      console.error('Failed to list posts:', error);
    }
  });

program
  .command('delete <slug>')
  .description('Delete a blog post')
  .action(async (slug) => {
    try {
      await deletePost(slug);
      console.log(`Post ${slug} deleted successfully!`);
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  });

program.parse(process.argv);