// src/app/blog/[slug]/page.tsx
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

// This would be imported from the centralized types file
interface BlogPostFull {
  id: number;
  title: string;
  content: string;
  date: string;
  author: string;
  imageUrl: string;
  category: string;
  relatedPosts: number[];
}

// This would be imported from the centralized types file
interface RelatedPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  slug: string;
}

// This would come from a database or CMS via a data fetching function
async function getBlogPostBySlug(slug: string): Promise<BlogPostFull | null> {
  // Placeholder data for demonstration
  const blogPosts: Record<string, BlogPostFull> = {
    "improve-norwegian-pronunciation": {
      id: 1,
      title: "5 Tips to Improve Your Norwegian Pronunciation",
      content: `
        <p>Learning to pronounce Norwegian correctly can be challenging for non-native speakers, but with consistent practice and the right techniques, you can make significant improvements.</p>
        
        <h2>1. Master the Unique Norwegian Sounds</h2>
        <p>Norwegian has several sounds that don't exist in English. The "y" sound (like in "by"), the "ø" sound (like in "søt"), and the "u" sound (like in "du") are particularly challenging. Listen carefully to native speakers and practice these sounds in isolation before incorporating them into words.</p>
        
        <h2>2. Listen and Imitate</h2>
        <p>One of the best ways to improve your pronunciation is to listen to native speakers and imitate their speech patterns. Use language learning apps, podcasts, or Norwegian TV shows to expose yourself to authentic pronunciation.</p>
        
        <h2>3. Record Yourself Speaking</h2>
        <p>Recording yourself speaking Norwegian and comparing it to native speakers can help you identify areas where your pronunciation needs improvement. Many language learning apps have speech recognition features that can provide instant feedback.</p>
        
        <h2>4. Focus on Rhythm and Intonation</h2>
        <p>Norwegian has a distinctive rhythm and melody. Pay attention to the rise and fall of pitch in sentences and try to replicate these patterns in your own speech.</p>
        
        <h2>5. Practice Minimal Pairs</h2>
        <p>Practice words that differ by just one sound, such as "lys" (light) and "lus" (louse). This helps train your ear to distinguish between similar sounds and improves your pronunciation accuracy.</p>
        
        <p>Consistent practice using these techniques will help you develop more natural-sounding Norwegian pronunciation over time.</p>
      `,
      date: "April 1, 2025",
      author: "Maria Berg",
      imageUrl: "/images/blog/pronunciation.jpg",
      category: "Norwegian",
      relatedPosts: [2, 3]
    }
  };
  
  return blogPosts[slug] || null;
}

// This would come from a database or CMS via a data fetching function
async function getRelatedPosts(postIds: number[]): Promise<RelatedPost[]> {
  // Placeholder data for demonstration
  return [
    {
      id: 2,
      title: "Common English Mistakes Made by Norwegian Speakers",
      excerpt: "Avoid these typical errors that Norwegian native speakers make when learning English.",
      date: "April 25, 2025",
      slug: "english-mistakes-norwegian-speakers"
    }
  ];
}

// Format date function - would be imported from utils
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: "Post Not Found | Oslo Languages",
      description: "The requested blog post could not be found."
    };
  }
  
  return {
    title: `${post.title} | Oslo Languages Blog`,
    description: post.content.substring(0, 160).replace(/<[^>]*>/g, "")
  };
}

export default async function BlogPost({ params }: Props) {
  const post = await getBlogPostBySlug(params.slug);
  
  if (!post) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <p>The blog post you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/blog" className="text-blue-600 hover:text-blue-800">
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }
  
  const relatedPosts = await getRelatedPosts(post.relatedPosts);
  
  return (
    <article className="py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full mb-4">
          {post.category}
        </span>
        
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="text-gray-600 mb-8">
          By {post.author} | {formatDate(post.date)}
        </div>
        
        <div className="relative h-96 w-full mb-8">
          <Image 
            src={post.imageUrl} 
            alt={post.title} 
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 1024px) 100vw, 800px"
          />
        </div>
        
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map(relatedPost => (
                <div key={relatedPost.id} className="card">
                  <h3 className="text-xl font-medium mb-2">
                    <Link href={`/blog/${relatedPost.slug}`} className="hover:text-blue-600">
                      {relatedPost.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-2">{formatDate(relatedPost.date)}</p>
                  <p className="text-gray-700">
                    {relatedPost.excerpt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}