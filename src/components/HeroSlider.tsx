import { useState, useEffect } from "react";
import { Play, Info, Heart, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Movie } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface HeroSliderProps {
  movies: Movie[];
  onPlayClick: (movie: Movie) => void;
  onDetailsClick: (movie: Movie) => void;
  watchlist: string[];
  toggleWatchlist: (movieId: string) => void;
}

export default function HeroSlider({
  movies,
  onPlayClick,
  onDetailsClick,
  watchlist,
  toggleWatchlist,
}: HeroSliderProps) {
  const featuredMovies = movies.filter((m) => m.isFeatured || m.isTrending).slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Setup auto-changing featured slide interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 7000); // changes every 7 seconds
    return () => clearInterval(timer);
  }, [featuredMovies.length]);

  if (featuredMovies.length === 0) return null;

  const currentMovie = featuredMovies[currentIndex];
  const inWatchlist = watchlist.includes(currentMovie.id);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  };

  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] bg-brand-charcoal overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Backdrop Wallpaper */}
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 scale-105"
               style={{ backgroundImage: `url(${currentMovie.backdropUrl})` }} />

          {/* Premium Film Shading Gradients (Bottom, Left & Top shadow masks) */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/40 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal via-brand-charcoal/50 to-transparent" />

          {/* Featured Contents */}
          <div className="absolute inset-x-0 bottom-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-24 flex flex-col justify-end h-full">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="max-w-xl space-y-4"
            >
              {/* Badge */}
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-brand-red text-white text-[10px] font-black uppercase tracking-wider rounded">
                  Featured Movie
                </span>
                <span className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  {currentMovie.rating} IMDb
                </span>
                <span className="text-zinc-400 text-xs">•</span>
                <span className="text-zinc-300 text-xs font-semibold">{currentMovie.year}</span>
                <span className="text-zinc-400 text-xs">•</span>
                <span className="text-zinc-300 text-xs font-semibold">{currentMovie.duration}</span>
                <span className="px-1.5 py-0.2 bg-zinc-800 text-zinc-300 text-[9px] font-bold rounded uppercase">
                  {currentMovie.quality}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black font-display text-white leading-tight tracking-tight drop-shadow-md">
                {currentMovie.title}
              </h1>

              {/* Description */}
              <p className="text-zinc-300 text-sm md:text-base leading-relaxed line-clamp-3 md:line-clamp-4 drop-shadow">
                {currentMovie.description}
              </p>

              {/* Genres Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentMovie.genres.map((g) => (
                  <span
                    key={g}
                    className="px-2.5 py-0.5 text-xs bg-zinc-900/80 border border-zinc-800 text-zinc-300 rounded-full"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <button
                  onClick={() => onPlayClick(currentMovie)}
                  id="featured-play-btn"
                  className="px-6 py-3 bg-brand-red hover:bg-red-700 text-white font-bold rounded-xl flex items-center gap-2 transition transform hover:scale-[1.03] shadow-lg shadow-brand-red/30 cursor-pointer text-sm"
                >
                  <Play className="w-4 h-4 fill-current text-white" /> Watch Now
                </button>

                <button
                  onClick={() => onDetailsClick(currentMovie)}
                  className="px-5 py-3 bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold rounded-xl flex items-center gap-2 transition cursor-pointer text-sm"
                >
                  <Info className="w-4 h-4" /> View Details
                </button>

                <button
                  onClick={() => toggleWatchlist(currentMovie.id)}
                  title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-center ${
                    inWatchlist
                      ? "bg-brand-red/15 border-brand-red text-brand-red hover:bg-brand-red/25"
                      : "bg-zinc-900/80 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${inWatchlist ? "fill-brand-red" : ""}`} />
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Manual Left/Right navigation widgets */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-brand-red text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer border border-zinc-800/40 z-10"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-brand-red text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer border border-zinc-800/40 z-10"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Index Dot indicator overlays */}
      <div className="absolute right-8 bottom-8 flex gap-2 z-10">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? "w-6 bg-brand-red" : "w-1.5 bg-zinc-600 hover:bg-zinc-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
