export type Review = {
  id: number;
  name: string;
  profession: string;
  avatar: string;
  rating: number;
  comment: string;
};

export const FakeReviews: Review[] = [
  {
    id: 1,
    name: "Ahmed Hassan",
    profession: "Frontend Developer",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment:
      "The courses are very well structured and easy to follow. I learned a lot and was able to apply everything directly to my projects.The courses are very well structured and easy to follow. I learned a lot and was able to apply everything directly to my projects The courses are very well structured and easy to follow. I learned a lot and was able to apply everything directly to my projects.",
  },
  {
    id: 2,
    name: "Sarah Mohamed",
    profession: "UI/UX Designer",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    rating: 4,
    comment:
      "I really enjoyed the learning experience. The content is clear, practical, and presented in a very professional way.",
  },
  {
    id: 3,
    name: "Omar Ali",
    profession: "Backend Developer",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment:
      "Excellent platform for improving your technical skills. The courses helped me understand difficult concepts much more easily.",
  },
  {
    id: 4,
    name: "Mariam Ahmed",
    profession: "Software Engineer",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment:
      "The instructors explain everything clearly and the practical examples make the learning process much easier.The instructors explain everything clearly and the practical examples make the learning process much easier.The instructors explain everything clearly and the practical examples make the learning process much easier.The instructors explain everything clearly and the practical examples make the learning process much easier.The instructors explain everything clearly and the practical examples make the learning process much easier.",
  },
  {
    id: 5,
    name: "Youssef Mohamed",
    profession: "Full Stack Developer",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    rating: 4,
    comment:
      "A great learning platform with useful courses. I especially liked the practical projects and real-world examples.",
  },
  {
    id: 6,
    name: "Nour Ibrahim",
    profession: "Web Developer",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment:
      "Amazing experience from start to finish. The courses are organized, modern, and really helped me improve my skills.",
  },
];
