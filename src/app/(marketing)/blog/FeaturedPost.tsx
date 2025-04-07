// src/app/(marketing)/blog/_components/FeaturedPost.tsx
'use client';

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

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
}

export default function FeaturedPost({ post }: { post: BlogPostSummary }) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="grid md:grid-cols-5 gap-0">
        <div className="md:col-span-3 relative h-64 md:h-full min-h-[300px] order-1 md:order-1">
          <Image 
            src={post.imageUrl} 
            alt={post.title} 
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent md:hidden"></div>
          <div className="absolute top-4 left-4">
            <motion.span 
              className="inline-block px-4 py-1 text-sm font-semibold bg-blue-500 text-white rounded-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {post.category}
            </motion.span>
          </div>
        </div>
        
        <div className="md:col-span-2 p-6 md:p-8 flex flex-col justify-center order-2 md:order-2">
          <div className="hidden md:block mb-4">
            <motion.span 
              className="inline-block px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-800 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {post.category}
            </motion.span>
          </div>
          
          <motion.h3 
            className="text-2xl md:text-3xl font-bold mb-4 leading-tight text-gray-800" // Added text-gray-800
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
              {post.title}
            </Link>
          </motion.h3>
          
          <motion.p 
            className="text-gray-600 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {post.excerpt}
          </motion.p>
          
          <motion.div 
            className="flex items-center justify-between mt-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {post.readTime}
              </div>
              <div className="text-sm text-gray-500">
                {post.date}
              </div>
            </div>
            
            <Link 
              href={`/blog/${post.slug}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              Read Article
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </article>
  );
}