// src/app/page.tsx
import Link from "next/link";
import CourseCard from "@/components/ui/CourseCard";

// Sample data - these would eventually come from your CMS or API
const courses = [
  {
    title: "Norwegian for Beginners",
    level: "A1-A2",
    description: "Perfect for newcomers to Norway. Learn essential vocabulary and basic conversation.",
    slug: "norwegian-beginners",
    imageUrl: "/images/norwegian.jpg"
  },
  {
    title: "Business English",
    level: "B1-C1",
    description: "Improve your professional English skills for the workplace.",
    slug: "business-english",
    imageUrl: "/images/english.jpg"
  },
  {
    title: "Spanish Conversation",
    level: "A2-B2",
    description: "Practice your Spanish speaking skills in real-life scenarios.",
    slug: "spanish-conversation",
    imageUrl: "/images/spanish.jpg"
  }
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-gray-900">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col items-center justify-center text-white text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Learn Languages in Oslo</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">Norwegian, English, and Spanish courses tailored to your needs</p>
          <Link 
            href="/contact" 
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-full text-lg transition-colors"
          >
            Inquire Now
          </Link>
        </div>
      </section>

      {/* Courses Overview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Language Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">What Our Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="italic mb-4">&quot;The Norwegian course helped me integrate into society quickly. The teachers are incredibly supportive and the methods are effective.&quot;</p>
              <p className="font-semibold">- Maria, Student from Spain</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="italic mb-4">&quot;I&apos;ve tried many language schools, but Oslo Languages stands out because of their conversation-focused approach. I can finally speak English confidently at work.&quot;</p>
              <p className="font-semibold">- Lars, Business Professional</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}