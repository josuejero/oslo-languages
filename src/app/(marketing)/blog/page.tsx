
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import AnimateOnScroll from "@/components/common/animation/AnimateOnScroll";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import FeaturedPost from "./FeaturedPost";
import NewsletterSignup from "@/components/features/NewsletterSignup";

export const metadata: Metadata = {
  title: "Language Learning Blog | Oslo Languages",
  description: "Tips, insights, and news about language learning and our school.",
};


interface BlogPostSummary {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  slug: string;
  imageUrl: string;
  category: string;
  readTime?: string;
  featured?: boolean;
}


async function getBlogPosts(): Promise<BlogPostSummary[]> {
  
  return [
    {
      id: 1,
      title: "5 Tips to Improve Your Norwegian Pronunciation",
      excerpt: "Master the unique sounds of Norwegian with these effective pronunciation techniques that will help you sound more like a native speaker.",
      date: "April 1, 2025",
      author: "Maria Berg",
      slug: "improve-norwegian-pronunciation",
      imageUrl: "/images/placeholder.png",
      category: "Norwegian",
      readTime: "5 min read",
      featured: true
    },
    {
      id: 2,
      title: "Common English Mistakes Made by Norwegian Speakers",
      excerpt: "Avoid these typical errors that Norwegian native speakers make when learning English and improve your fluency quickly.",
      date: "March 25, 2025",
      author: "John Smith",
      slug: "english-mistakes-norwegian-speakers",
      imageUrl: "/images/placeholder.png",
      category: "English",
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "The History of Spanish Influence in Norway",
      excerpt: "Explore the surprising historical connections between Spain and Norway and how they've shaped language and culture.",
      date: "March 15, 2025",
      author: "Sofia Garcia",
      slug: "spanish-influence-norway",
      imageUrl: "/images/placeholder.png",
      category: "Spanish",
      readTime: "10 min read"
    },
    {
      id: 4,
      title: "Mastering Norwegian Prepositions",
      excerpt: "A comprehensive guide to using Norwegian prepositions correctly in everyday conversation.",
      date: "March 10, 2025",
      author: "Erik Hansen",
      slug: "norwegian-prepositions",
      imageUrl: "/images/placeholder.png",
      category: "Norwegian",
      readTime: "8 min read"
    },
  ];
}

export default async function Blog() {
  const blogPosts = await getBlogPosts();
  const featuredPost = blogPosts.find(post => post.featured) || blogPosts[0];
  const regularPosts = blogPosts.filter(post => post.id !== featuredPost.id);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <AnimateOnScroll animation="animate-fadeIn">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
              Language Learning Blog
            </h1>
            <p className="text-lg md:text-xl text-center text-gray-700 max-w-3xl mx-auto mb-12">
              Explore tips, insights, and stories to enhance your language learning journey
            </p>
          </AnimateOnScroll>

          {}
          <div className="max-w-4xl mx-auto mb-12">
            <AnimateOnScroll animation="animate-fadeIn" delay={200}>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-grow">
                    <SearchBar />
                  </div>
                  <div>
                    <CategoryFilter />
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <AnimateOnScroll animation="animate-fadeIn">
            <h2 className="text-2xl font-bold mb-8 text-gray-800 flex items-center">
              <span className="w-10 h-1 bg-blue-500 rounded-full mr-3"></span>
              Featured Article
            </h2>
          </AnimateOnScroll>
          
          <AnimateOnScroll animation="animate-fadeIn" delay={100}>
            <FeaturedPost post={featuredPost} />
          </AnimateOnScroll>
        </div>
      </section>

      {}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <AnimateOnScroll animation="animate-fadeIn">
            <h2 className="text-2xl font-bold mb-8 text-gray-800 flex items-center">
              <span className="w-10 h-1 bg-blue-500 rounded-full mr-3"></span>
              Latest Articles
            </h2>
          </AnimateOnScroll>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post, index) => (
              <AnimateOnScroll 
                key={post.id}
                animation="animate-fadeIn" 
                delay={100 + (index * 100)}
              >
                <BlogPostCard post={post} />
              </AnimateOnScroll>
            ))}
          </div>
          
          {}
          <div className="mt-16">
            <AnimateOnScroll animation="animate-fadeIn" delay={400}>
              <Pagination currentPage={1} totalPages={3} />
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimateOnScroll animation="animate-fadeIn">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                Stay Updated with Our Latest Content
              </h2>
              <NewsletterSignup />
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}


function BlogPostCard({ post }: { post: BlogPostSummary }) {
  return (
    <article className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
      <div className="relative h-56 w-full overflow-hidden">
      <Image 
  src="/images/placeholder.png" 
  alt={post.title} 
  fill
  className="object-cover transition-transform duration-500 group-hover:scale-110"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
        <div className="absolute top-4 left-4">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
            {post.category}
          </span>
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {post.readTime}
          </span>
          <span className="mx-2">•</span>
          <span>{post.date}</span>
        </div>
        <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors">
          <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
            {post.title}
          </Link>
        </h3>
        <p className="text-gray-600 mb-4 flex-grow">{post.excerpt}</p>
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            By {post.author}
          </div>
          <Link 
            href={`/blog/${post.slug}`}
            className="text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center"
          >
            Read More
            <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}


function Pagination({ currentPage, totalPages }: { currentPage: number, totalPages: number }) {
  return (
    <div className="flex justify-center">
      <nav className="inline-flex rounded-md shadow-sm">
        <Link 
          href="#" 
          className="py-2 px-4 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-700"
          aria-label="Previous page"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <Link
            key={page}
            href="#" 
            className={`py-2 px-4 ${
              page === currentPage 
                ? "bg-blue-600 text-white border border-blue-600 hover:bg-blue-700" 
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            } transition-colors`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </Link>
        ))}
        <Link 
          href="#" 
          className="py-2 px-4 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-700"
          aria-label="Next page"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </nav>
    </div>
  );
}