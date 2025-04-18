


export type Testimonial = {
  id: number;
  name: string;
  role: string;
  image: string;
  course: string;
  text: string;
  rating: number;
};


export const testimonialsData: Testimonial[] = [
  {
    id: 1,
    name: "Maria Johnson",
    role: "Software Developer",
    image: "/images/placeholder.png",
    course: "Norwegian A1",
    text: "The Norwegian course at Oslo Languages exceeded my expectations...",
    rating: 5
  },
  {
    id: 2,
    name: "Thomas Berg",
    role: "Business Consultant",
    image: "/images/placeholder.png",
    course: "Business English",
    text: "Their Business English course helped me significantly improve...",
    rating: 5
  },
  {
    id: 3,
    name: "Sofia Garcia",
    role: "Student",
    image: "/images/placeholder.png",
    course: "Spanish B1",
    text: "Love the interactive teaching style! Made learning Spanish fun...",
    rating: 5
  }
];
