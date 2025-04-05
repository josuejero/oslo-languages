// src/app/blog/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Language Learning Blog | Oslo Languages",
  description: "Tips, insights, and news about language learning and our school.",
};

// This would be imported from the centralized types file
interface BlogPostSummary {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  slug: string;
  imageUrl: string;
  category: string;
}

// This would come from a database or CMS via a data fetching function
async function getBlogPosts(): Promise<BlogPostSummary[]> {
  // Placeholder data for demonstration
  return [
    {
      id: 1,
      title: "5 Tips to Improve Your Norwegian Pronunciation",
      excerpt: "Master the unique sounds of Norwegian with these effective pronunciation techniques.",
      date: "April 1, 2025",
      author: "Maria Berg",
      slug: "improve-norwegian-pronunciation",
      imageUrl: "/images/blog/pronunciation.jpg",
      category: "Norwegian"
    },
    {
      id: 2,
      title: "Common English Mistakes Made by Norwegian Speakers",
      excerpt: "Avoid these typical errors that Norwegian native speakers make when learning English.",
      date: "March 25, 2025",
      author: "John Smith",
      slug: "english-mistakes-norwegian-speakers",
      imageUrl: "/images/blog/english-mistakes.jpg",
      category: "English"
    },
  ];
}

export default async function Blog() {
  const blogPosts = await getBlogPosts();

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Language Learning Blog</h1>
        
        {/* Filter/Search UI - would be a client component */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <input 
                type="text" 
                placeholder="Search blog posts..." 
                className="form-input"
              />
            </div>
            <div>
              <select className="form-input w-full md:w-auto">
                <option value="">All Categories</option>
                <option value="Norwegian">Norwegian</option>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="School News">School News</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Blog Post Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
        
        {/* Pagination - would be generated dynamically based on post count */}
        <Pagination currentPage={1} totalPages={3} />
      </div>
    </section>
  );
}

// Reusable blog post card component
function BlogPostCard({ post }: { post: BlogPostSummary }) {
  return (
    <article className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image 
          src={post.imageUrl} 
          alt={post.title} 
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full mb-2">
          {post.category}
        </span>
        <h2 className="text-xl font-bold mb-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
            {post.title}
          </Link>
        </h2>
        <p className="text-gray-600 text-sm mb-2">
          By {post.author} | {post.date}
        </p>
        <p className="text-gray-700 mb-4">
          {post.excerpt}
        </p>
        <Link 
          href={`/blog/${post.slug}`}
          className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
        >
          Read More →
        </Link>
      </div>
    </article>
  );
}

// Pagination component
function Pagination({ currentPage, totalPages }: { currentPage: number, totalPages: number }) {
  return (
    <div className="mt-12 flex justify-center">
      <nav className="inline-flex rounded-md shadow">
        <a href="#" className="py-2 px-4 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50">
          Previous
        </a>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <a 
            key={page}
            href="#" 
            className={`py-2 px-4 ${
              page === currentPage 
                ? "bg-blue-500 text-white border border-blue-500 hover:bg-blue-600" 
                : "bg-white border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {page}
          </a>
        ))}
        <a href="#" className="py-2 px-4 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50">
          Next
        </a>
      </nav>
    </div>
  );
}