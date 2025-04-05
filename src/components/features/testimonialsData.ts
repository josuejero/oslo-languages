// testimonialsData.ts
// Defines the type of each testimonial and exports a data array.

export type Testimonial = {
  id: number;
  name: string;
  role: string;
  image: string;
  course: string;
  text: string;
  rating: number;
};

// Hardcoded list of testimonials, could eventually come from an API or CMS
export const testimonialsData: Testimonial[] = [
  {
    id: 1,
    name: "Maria Johnson",
    role: "Software Developer",
    image: "/testimonials/maria.jpg",
    course: "Norwegian A1",
    text: "The Norwegian course at Oslo Languages exceeded my expectations...",
    rating: 5
  },
  {
    id: 2,
    name: "Thomas Berg",
    role: "Business Consultant",
    image: "/testimonials/thomas.jpg",
    course: "Business English",
    text: "Their Business English course helped me significantly improve...",
    rating: 5
  },
  {
    id: 3,
    name: "Sofia Garcia",
    role: "Student",
    image: "/testimonials/sofia.jpg",
    course: "Spanish B1",
    text: "Love the interactive teaching style! Made learning Spanish fun...",
    rating: 5
  }
];
