import React, { useState, useMemo } from "react";
import {
  Play,
  Download,
  Star,
  Plus,
  Heart,
  Calendar,
  Clock,
  User,
  Film,
  Share2,
  Trash2,
  Facebook,
  Twitter,
  Link2,
  Check,
  Send
} from "lucide-react";
import { Movie, Comment } from "../types";
import MovieCard from "./MovieCard";
import DownloadSection from "./DownloadSection";

interface MovieDetailsViewProps {
  movie: Movie;
  movies: Movie[]; // for Related Movies recommendation engine
  onPlayClick: (movie: Movie) => void;
  onMovieSelect: (movie: Movie) => void;
  watchlist: string[];
  toggleWatchlist: (movieId: string) => void;
  onAddComment: (movieId: string, comment: Omit<Comment, "id" | "timestamp">) => void;
  onDeleteComment?: (movieId: string, commentId: string) => void;
}

export default function MovieDetailsView({
  movie,
  movies,
  onPlayClick,
  onMovieSelect,
  watchlist,
  toggleWatchlist,
  onAddComment,
  onDeleteComment,
}: MovieDetailsViewProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "trailer" | "download" | "reviews">("overview");
  const [copied, setCopied] = useState(false);
  
  // Rating form state
  const [username, setUsername] = useState("");
  const [starRating, setStarRating] = useState(5);
  const [commentText, setCommentText] = useState("");
  const [errorText, setErrorText] = useState("");

  const inWatchlist = watchlist.includes(movie.id);

  // Recommendation engine: matching movies sharing at least one genre, excluding self
  const relatedMovies = useMemo(() => {
    return movies
      .filter((m) => m.id !== movie.id && m.genres.some((g) => movie.genres.includes(g)))
      .slice(0, 5);
  }, [movie, movies]);

  const handleShareCopy = () => {
    const shareUrl = `${window.location.origin}/movie/${movie.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !commentText.trim()) {
      setErrorText("Please fill out both name and review comment fields.");
      return;
    }
    setErrorText("");
    
    onAddComment(movie.id, {
      username: username.trim(),
      rating: starRating,
      comment: commentText.trim(),
    });

    // Reset Form
    setUsername("");
    setStarRating(5);
    setCommentText("");
    setActiveTab("reviews");
  };

  return (
    <div className="w-full pb-16">
      
      {/* 1. Backdrop Banner Header & Overlay */}
      <div className="relative w-full h-[40vh] md:h-[55vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-102 filter blur-[1px]"
          style={{ backgroundImage: `url(${movie.backdropUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/65 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal/70 to-transparent" />
      </div>

      {/* 2. Core Profile Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 md:-mt-44 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Block: Elevated film Poster graphic */}
          <div className="w-52 sm:w-64 flex-none bg-zinc-950 p-1 border border-zinc-800 rounded-2xl shadow-2xl mx-auto lg:mx-0">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full rounded-xl object-cover aspect-[2/3] shadow-lg"
            />
          </div>

          {/* Right Block: Content specs header */}
          <div className="flex-1 space-y-5 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <span className="px-2 py-0.5 bg-brand-red text-white text-xs font-black uppercase rounded">
                {movie.quality}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-500" />
                {movie.rating} IMDb
              </span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-300 text-xs font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {movie.year}
              </span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-300 text-xs font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {movie.duration}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black font-display text-white leading-none">
              {movie.title}
            </h1>

            {/* Creators credits block */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-zinc-400 font-medium">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-brand-red" />
                Director: <strong className="text-zinc-200 ml-0.5">{movie.director}</strong>
              </span>
              <span className="hidden sm:inline text-zinc-700">|</span>
              <span className="flex items-center gap-1">
                <Film className="w-3.5 h-3.5 text-brand-red" />
                Cast: <strong className="text-zinc-200 ml-0.5">{movie.cast.join(", ")}</strong>
              </span>
            </div>

            {/* Paragraph descriptor */}
            <p className="text-zinc-300 text-sm md:text-base leading-relaxed lg:max-w-3xl">
              {movie.description}
            </p>

            {/* Inline Genres */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
              {movie.genres.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 text-xs font-semibold bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-full"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Main Primary CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-3">
              <button
                onClick={() => onPlayClick(movie)}
                className="px-6 py-3 bg-brand-red hover:bg-red-700 text-white font-bold rounded-xl flex items-center gap-2 transition transform hover:scale-[1.03] cursor-pointer text-sm shadow-lg shadow-brand-red/20"
              >
                <Play className="w-4 h-4 fill-current text-white" /> Play Movie Now
              </button>

              <button
                onClick={() => setActiveTab("download")}
                className="px-5 py-3 bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold rounded-xl flex items-center gap-2 transition cursor-pointer text-sm"
              >
                <Download className="w-4 h-4" /> Download Files
              </button>

              <button
                onClick={() => toggleWatchlist(movie.id)}
                className={`px-4 py-3 border rounded-xl transition cursor-pointer text-sm flex items-center gap-2 ${
                  inWatchlist
                    ? "bg-brand-red/15 border-brand-red text-brand-red hover:bg-brand-red/25"
                    : "bg-zinc-900/80 border-zinc-700 text-zinc-300 hover:text-white"
                }`}
              >
                <Heart className={`w-4 h-4 ${inWatchlist ? "fill-brand-red" : ""}`} />
                <span>{inWatchlist ? "My Wishlisted" : "Add to Watchlist"}</span>
              </button>

              {/* Share link tool */}
              <div className="relative">
                <button
                  onClick={handleShareCopy}
                  title="Share Movie Link"
                  className="p-3 bg-zinc-900 border border-zinc-805 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer flex items-center"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                </button>
                {copied && (
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-green-600 text-white text-[10px] rounded shadow-lg font-bold">
                    Copied!
                  </span>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3. Central Tabs Navigation Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="border-b border-zinc-800 flex items-center justify-start gap-4 md:gap-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 text-sm font-semibold border-b-2 transition flex-none cursor-pointer ${
              activeTab === "overview"
                ? "border-brand-red text-white"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            Film Overview
          </button>
          <button
            onClick={() => setActiveTab("trailer")}
            className={`py-3 text-sm font-semibold border-b-2 transition flex-none cursor-pointer ${
              activeTab === "trailer"
                ? "border-brand-red text-white"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            Watch Official Trailer
          </button>
          <button
            onClick={() => setActiveTab("download")}
            className={`py-3 text-sm font-semibold border-b-2 transition flex-none cursor-pointer ${
              activeTab === "download"
                ? "border-brand-red text-white"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            Hi-Speed Quality Downloads
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`py-3 text-sm font-semibold border-b-2 transition flex-none cursor-pointer ${
              activeTab === "reviews"
                ? "border-brand-red text-white"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            Ratings & Reviews ({movie.comments.length})
          </button>
        </div>

        {/* Tab Context Switchboard */}
        <div className="mt-8">
          
          {/* Tab: Overview Info */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-base font-bold text-white">Plot Summary</h3>
                <p className="text-zinc-400 leading-relaxed">{movie.description}</p>
                <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Viewing Perks Available</h4>
                  <ul className="grid grid-cols-2 gap-2 text-xs text-zinc-400 font-medium">
                    <li>• Ultra HD Streaming (4K UHD)</li>
                    <li>• Dolby Vision Atmos Channels</li>
                    <li>• Multi-language CC/Subtitles</li>
                    <li>• Offline local downloads enabled</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">Specifications</h3>
                <div className="divide-y divide-zinc-800/60 font-medium">
                  <div className="py-2.5 flex justify-between">
                    <span className="text-zinc-500 text-xs">Director</span>
                    <span className="text-zinc-200 text-xs">{movie.director}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-zinc-500 text-xs">Release Date</span>
                    <span className="text-zinc-200 text-xs">{movie.year}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-zinc-500 text-xs">Runtime</span>
                    <span className="text-zinc-200 text-xs">{movie.duration}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-zinc-500 text-xs">Network Quality</span>
                    <span className="bg-brand-red/10 border border-brand-red/20 px-1.5 py-0.2 rounded text-[10px] text-brand-red font-black uppercase">
                      {movie.quality}
                    </span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-zinc-500 text-xs">Total Views</span>
                    <span className="text-zinc-300 text-xs font-mono">
                      {movie.views.toLocaleString()} plays
                    </span>
                  </div>
                </div>

                {/* Social icons box */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Share with Friends</span>
                  <div className="flex gap-2.5 mt-2">
                    <button className="p-2.5 bg-zinc-900 hover:bg-[#3b5998] text-zinc-400 hover:text-white rounded-lg transition cursor-pointer">
                      <Facebook className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 bg-zinc-900 hover:bg-[#1da1f2] text-zinc-400 hover:text-white rounded-lg transition cursor-pointer">
                      <Twitter className="w-4 h-4" />
                    </button>
                    <button onClick={handleShareCopy} className="p-2.5 bg-zinc-900 hover:bg-brand-red text-zinc-400 hover:text-white rounded-lg transition cursor-pointer">
                      <Link2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Trailer embed panel */}
          {activeTab === "trailer" && (
            <div className="w-full h-full aspect-video rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950/80 shadow-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${movie.trailerId}?autoplay=1`}
                title={`${movie.title} - Official Movie Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                referrerPolicy="no-referrer"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          )}

          {/* Tab: Quality downloads simulator */}
          {activeTab === "download" && (
            <div className="max-w-3xl">
              <DownloadSection movie={movie} />
            </div>
          )}

          {/* Tab: Ratings and reviews block */}
          {activeTab === "reviews" && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              
              {/* Left Column: Review submit form */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-base font-bold text-white">Share Your Review</h3>
                <p className="text-xs text-zinc-400">Your comments help others decide what to stream!</p>
                
                <form onSubmit={handleSubmitReview} className="space-y-4 font-medium">
                  {errorText && (
                    <div className="p-3 bg-red-955/20 border border-red-900 text-red-400 text-xs rounded-lg flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" />
                      {errorText}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400">Your Full Name</label>
                    <input
                      type="text"
                      placeholder="Username (e.g., JaneDoe)"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full text-xs p-3 rounded-lg bg-zinc-900 border border-zinc-800 focus:border-brand-red focus:ring-1 focus:ring-brand-red text-white placeholder-zinc-500 outline-none transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400 block">Star Rating</label>
                    <div className="flex items-center gap-1.5 pt-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setStarRating(star)}
                          title={`${star} out of 10`}
                          className="focus:outline-none transition cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= starRating
                                ? "text-amber-500 fill-amber-500"
                                : "text-zinc-600 hover:text-amber-500"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-mono font-bold text-amber-500 ml-2">{starRating}/10</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400">Detailed Review Comments</label>
                    <textarea
                      rows={4}
                      placeholder="Write your movie feedback here..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="w-full text-xs p-3 rounded-lg bg-zinc-900 border border-zinc-800 focus:border-brand-red focus:ring-1 focus:ring-brand-red text-white placeholder-zinc-500 outline-none transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Review
                  </button>
                </form>
              </div>

              {/* Right Column: Existing comments list */}
              <div className="lg:col-span-3 space-y-4">
                <h3 className="text-base font-bold text-white">Streamer Feedbacks</h3>
                
                {movie.comments.length === 0 ? (
                  <div className="p-8 text-center bg-zinc-900/30 border border-zinc-800 rounded-xl text-xs text-zinc-500 font-medium">
                    No active reviews left yet. Be the first to express feedback!
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
                    {movie.comments.map((cmt) => (
                      <div
                        key={cmt.id}
                        className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex gap-3 group"
                      >
                        <div className="h-9 w-9 rounded-full bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-brand-red font-bold text-xs uppercase flex-none">
                          {cmt.username.slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-white truncate">{cmt.username}</p>
                            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 rounded text-[10px] text-amber-500 font-black">
                              ★ {cmt.rating}/10
                            </div>
                          </div>
                          <p className="text-[11px] text-zinc-500 font-semibold mt-0.5">{cmt.timestamp}</p>
                          <p className="text-xs text-zinc-350 leading-relaxed mt-2">{cmt.comment}</p>
                        </div>
                        {onDeleteComment && (
                          <button
                            onClick={() => onDeleteComment(movie.id, cmt.id)}
                            className="p-1 px-1.5 text-zinc-650 hover:text-red-400 hover:bg-red-500/10 rounded transition self-start leading-none opacity-0 group-hover:opacity-100"
                            title="Delete Feed"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </div>

      {/* 4. Recommendation row: Related Movies */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-5">
        <h2 className="text-lg md:text-xl font-bold font-display text-white border-l-4 border-brand-red pl-3 leading-none">
          Related & Suggested Movies
        </h2>

        {relatedMovies.length === 0 ? (
          <p className="text-xs text-zinc-500">No related movies discovered in these genres.</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth">
            {relatedMovies.map((m) => (
              <MovieCard
                key={m.id}
                movie={m}
                onPlayClick={onPlayClick}
                onDetailsClick={onMovieSelect}
                watchlist={watchlist}
                toggleWatchlist={toggleWatchlist}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

// Inline fallback alert icon
function AlertCircle(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}
