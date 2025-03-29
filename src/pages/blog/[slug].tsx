// src/pages/blog/[slug].tsx
import { GetStaticProps, GetStaticPaths } from 'next';
// Import necessary functions and types from modules/blog
import { getPostBySlug, getAllPosts } from '@/modules/blog/operations';
import type { BlogPost as BlogPostType } from '@/modules/blog/types';

import BlogPostComponent from '@/components/blog/BlogPost';
import BlogSEO from '@/components/seo/BlogSEO';
import { logger } from '@/utils/logger';

interface BlogPostPageProps {
    post: BlogPostType;
}

/**
 * BlogPostPage component renders a single blog post page.
 *
 * @param {BlogPostPageProps} props - The props for the page.
 * @returns {JSX.Element} The rendered blog post page.
 */
export default function BlogPostPage({ post }: BlogPostPageProps) {
    return (
        <>
          <BlogSEO post={post} />
          <BlogPostComponent post={post} />
        </>
      );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const posts = await getAllPosts();
    const paths = posts.map((post) => ({
      params: { slug: post.slug }
    }));

    return {
      paths,
      fallback: 'blocking'
    };
  } catch (error) {
    logger.error('Failed to generate blog post paths:', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    return {
      paths: [],
      fallback: 'blocking'
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    const post = await getPostBySlug(slug);

    if (!post) {
      return {
        notFound: true
      };
    }

    return {
      props: {
        post
      },
      revalidate: 3600 // Revalidate every hour
    };
  } catch (error) {
    logger.error('Failed to fetch blog post:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      slug: params?.slug
    });
    
    return {
      notFound: true
    };
  }
};
