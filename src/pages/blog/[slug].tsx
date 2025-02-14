// src/pages/blog/[slug].tsx
import { GetStaticProps, GetStaticPaths } from 'next';
// Import necessary functions and types from blog-operations
import { getPostBySlug, getAllPosts, BlogPost as BlogPostOperations } from '@/utils/blog-operations';
// Import BlogPost type from the blog module for display purposes
import { BlogPost as BlogPostComponentType } from '@/utils/blog';

// Combined type to satisfy both BlogSEO (which expects the operations type)
// and BlogPostComponent (which expects the display type) requirements.
type CombinedBlogPost = BlogPostOperations & { date: string };
import BlogPostComponent from '@/components/blog/BlogPost';
import BlogSEO from '@/components/seo/BlogSEO';
import { logger } from '@/utils/logger';

interface BlogPostPageProps {
    // Combined blog post type including fields required by both BlogSEO and BlogPostComponent.
    post: CombinedBlogPost;
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
          {/* Cast to BlogPostComponentType to satisfy the BlogPostComponent's expected type */}
          <BlogPostComponent post={post as unknown as BlogPostComponentType} />
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
    // Fetch the post using the blog-operations module
    const postOperations = await getPostBySlug(slug);

    if (!postOperations) {
      return {
        notFound: true
      };
    }

        // Combine fields from the operations post and add a 'date' field required by the BlogPost component.
        const post: CombinedBlogPost = {
          ...postOperations,
          date: postOperations.publishedAt || postOperations.updatedAt || new Date().toISOString(),
          readingTime: postOperations.readingTime || '1 min read'
        };

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
