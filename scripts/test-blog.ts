// scripts/test-blog.ts
import fs from 'fs/promises';
import path from 'path';
import { BlogPost } from '@/types/blog';
import { createPost, updatePost, deletePost, getPostBySlug } from '@/utils/blog';

async function testBlogOperations() {
  console.log('Testing blog operations...');

  // Test creating a post
  const testPost: Partial<BlogPost> = {
    title: 'Test Post',
    content: '# Test Content\n\nThis is a test post.',
    excerpt: 'Test excerpt',
    author: 'Test Author',
    categories: ['test'],
    tags: ['test'],
    status: 'draft'
  };

  try {
    // Test post creation
    console.log('Creating test post...');
    const createdPost = await createPost(testPost);
    console.log('Created post:', createdPost);

    // Test post retrieval
    console.log('Retrieving post...');
    const retrievedPost = await getPostBySlug(createdPost.slug);
    console.log('Retrieved post:', retrievedPost);

    // Test post update
    console.log('Updating post...');
    const updatedPost = await updatePost(createdPost.slug, {
      title: 'Updated Test Post',
      content: '# Updated Content\n\nThis post has been updated.'
    });
    console.log('Updated post:', updatedPost);

    // Test post deletion
    console.log('Deleting post...');
    await deletePost(createdPost.slug);
    console.log('Post deleted successfully');

    console.log('All blog operations completed successfully!');
  } catch (error) {
    console.error('Error during blog operations test:', error);
    throw error;
  }
}

// Run the tests
testBlogOperations().catch(console.error);