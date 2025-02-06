export const post = {
  title: "About Oslo Languages",
  coverImage: "/images/about-cover.jpg"
};

export const teachers = [
  {
    name: "Marta Hansen",
    role: "Norwegian Language Instructor",
    bio: "10+ years experience teaching Norwegian to international students",
    image: "/images/teachers/marta.jpg",
    languages: ["Norwegian", "English", "Swedish"]
  },
  {
    name: "James Smith",
    role: "English Language Specialist",
    bio: "Cambridge CELTA certified with focus on business English",
    image: "/images/teachers/james.jpg",
    languages: ["English", "Norwegian"]
  },
  {
    name: "Carmen Rodriguez",
    role: "Spanish Language Teacher",
    bio: "Native Spanish speaker with 5 years teaching experience",
    image: "/images/teachers/carmen.jpg",
    languages: ["Spanish", "English", "Norwegian"]
  }
] as const;