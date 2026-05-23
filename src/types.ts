export interface Comment {
  id: string;
  username: string;
  rating: number;
  comment: string;
  timestamp: string;
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  year: number;
  genres: string[];
  rating: number;
  duration: string;
  quality: "480p" | "720p" | "1080p" | "4K";
  posterUrl: string;
  backdropUrl: string;
  videoUrl: string;
  trailerId: string; // YouTube video ID or similar
  cast: string[];
  director: string;
  isTrending?: boolean;
  isPopular?: boolean;
  isTopRated?: boolean;
  isLatest?: boolean;
  isFeatured?: boolean;
  comments: Comment[];
  views: number;
}

export type Category =
  | "Action"
  | "Adventure"
  | "Thriller"
  | "Horror"
  | "Sci-Fi"
  | "Drama"
  | "Comedy"
  | "Romance"
  | "Animation"
  | "Documentary"
  | "Crime"
  | "Mystery"
  | "War"
  | "Family"
  | "Fantasy";

export const CATEGORIES: Category[] = [
  "Action",
  "Adventure",
  "Thriller",
  "Horror",
  "Sci-Fi",
  "Drama",
  "Comedy",
  "Romance",
  "Animation",
  "Documentary",
  "Crime",
  "Mystery",
  "War",
  "Family",
  "Fantasy"
];
