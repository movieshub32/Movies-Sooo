import React from "react";
import { Play, Download, Star, Heart } from "lucide-react";
import { Movie } from "../types";
import { motion } from "motion/react";

interface MovieCardProps {
  key?: string | number;
  movie: Movie;
  onPlayClick: (movie: Movie) => void;
  onDetailsClick: (movie: Movie) => void;
  onDownloadClick?: (movie: Movie) => void;
  watchlist: string[];
  toggleWatchlist: (movieId: string) => void;
}

export default function MovieCard({
  movie,
  onPlayClick,
  onDetailsClick,
  onDownloadClick,
  watchlist,
  toggleWatchlist,
}: MovieCardProps) {
  const isFavorite = watchlist.includes(movie.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="relative flex-none w-44 sm:w-52 md:w-56 bg-brand-card rounded-xl overflow-hidden border border-zinc-900 shadow-lg group cursor-pointer transition select-none h-[280px] sm:h-[320px] md:h-[350px]"
    >
      {/* Poster Image */}
      <img
        src={movie.posterUrl}
        alt={movie.title}
        loading="lazy"
        className="w-full h-full object-cover transition duration-500 scale-100 group-hover:scale-105"
        onClick={() => onDetailsClick(movie)}
      />

      {/* Basic Bottom Info bar when NOT hovered (fades out on hover) */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/85 to-transparent p-3 pt-8 pb-3 flex flex-col gap-1 transition-opacity duration-300 group-hover:opacity-0 pointer-events-none">
        <h3 className="text-sm font-bold text-white truncate leading-snug">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between text-[11px] text-zinc-400">
          <span>{movie.year}</span>
          <div className="flex items-center gap-1">
            <span className="text-amber-500 font-bold">★ {movie.rating}</span>
          </div>
        </div>
      </div>

      {/* Hover Information Layer & Action Controls (fades in on hover) */}
      <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-sm p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between z-10">
        
        {/* Top Details & Wishlist trigger */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-wrap gap-1">
            <span className="bg-brand-red text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded leading-none">
              {movie.quality}
            </span>
            <span className="bg-zinc-800 text-zinc-300 text-[9px] font-bold px-1.5 py-0.5 rounded leading-none">
              {movie.duration}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWatchlist(movie.id);
            }}
            className={`p-1.5 rounded-lg border transition ${
              isFavorite
                ? "bg-brand-red/20 border-brand-red text-brand-red"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? "fill-brand-red" : ""}`} />
          </button>
        </div>

        {/* Mid-to-bottom detail context */}
        <div className="space-y-2 mt-auto" onClick={() => onDetailsClick(movie)}>
          <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            <span>{movie.rating} IMDb</span>
            <span className="text-zinc-500 font-normal">({movie.year})</span>
          </div>

          <h3 className="text-sm font-extrabold text-white leading-tight line-clamp-2">
            {movie.title}
          </h3>

          <p className="text-[10px] text-zinc-400 font-medium leading-normal line-clamp-3">
            {movie.description}
          </p>

          <div className="text-[9px] text-zinc-500 flex flex-wrap gap-1 pt-1 leading-none font-bold">
            {movie.genres.map((g) => (
              <span key={g} className="bg-zinc-900 border border-zinc-800/80 px-1.5 py-0.5 rounded-full text-zinc-400">
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* CTA triggers */}
        <div className="flex gap-2.5 mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlayClick(movie);
            }}
            className="flex-1 py-1.5 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 transition cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current text-white" /> Watch
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onDownloadClick) onDownloadClick(movie);
            }}
            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 rounded-lg flex items-center justify-center transition cursor-pointer"
            title="Download Movie"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </motion.div>
  );
}
