import React, { useState, useEffect, useMemo } from "react";
import {
  Flame,
  Sparkles,
  History,
  Heart,
  TrendingUp,
  SlidersHorizontal,
  ChevronRight,
  Tv,
  Film,
  Search,
  Star,
  Check,
  AlertCircle
} from "lucide-react";

import Header from "./components/Header";
import HeroSlider from "./components/HeroSlider";
import CategoryList from "./components/CategoryList";
import MovieCard from "./components/MovieCard";
import MovieDetailsView from "./components/MovieDetailsView";
import CustomVideoPlayer from "./components/CustomVideoPlayer";
import Footer from "./components/Footer";

import { SAMPLE_MOVIES } from "./data/movies";
import { Movie, Category, Comment } from "./types";

export default function App() {
  // Tab/Page Navigation state
  const [currentTab, setCurrentTab] = useState<string>("home"); // home, search, watchlist, movie-details, watch-player
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);

  // Dynamic movie list to preserve user ratings/comments in memory
  const [moviesList, setMoviesList] = useState<Movie[]>(() => {
    const saved = localStorage.getItem("streamx_custom_movies");
    return saved ? JSON.parse(saved) : SAMPLE_MOVIES;
  });

  // Watchlist & History state loaded from client localStorage
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    const saved = localStorage.getItem("streamx_watchlist");
    return saved ? JSON.parse(saved) : ["stellaris", "whisperer"]; // default presets for beautiful first impressions
  });

  const [recentViews, setRecentViews] = useState<string[]>(() => {
    const saved = localStorage.getItem("streamx_recent_views");
    return saved ? JSON.parse(saved) : ["neon-rain"];
  });

  // Search dashboard and category filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [selectedYear, setSelectedYear] = useState<number | "All">("All");
  const [selectedRating, setSelectedRating] = useState<number | "All">("All");
  const [sortBy, setSortBy] = useState<"rating" | "year" | "views">("views");
  const [showFilters, setShowFilters] = useState(false);

  // Skeleton loading states
  const [isLoading, setIsLoading] = useState(true);

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem("streamx_custom_movies", JSON.stringify(moviesList));
  }, [moviesList]);

  useEffect(() => {
    localStorage.setItem("streamx_watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem("streamx_recent_views", JSON.stringify(recentViews));
  }, [recentViews]);

  // Simulate global page launch loading skeleton for UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [currentTab, selectedMovieId]);

  // Watchlist/Favorites core methods
  const toggleWatchlist = (movieId: string) => {
    setWatchlist((prev) => {
      if (prev.includes(movieId)) {
        return prev.filter((id) => id !== movieId);
      } else {
        return [...prev, movieId];
      }
    });
  };

  // Add comments & calculate new average IMDb score dynamically
  const handleAddComment = (movieId: string, rawCmt: Omit<Comment, "id" | "timestamp">) => {
    setMoviesList((prevMovies) => {
      return prevMovies.map((movie) => {
        if (movie.id !== movieId) return movie;

        // Construct complete review object
        const newCmt: Comment = {
          ...rawCmt,
          id: `cmt-${Date.now()}`,
          timestamp: "Just now"
        };

        const updatedComments = [newCmt, ...movie.comments];
        
        // Dynamically compute adjusted IMDb profile score based on user reviews
        const totalCommentRating = updatedComments.reduce((sum, c) => sum + c.rating, 0);
        const avg = parseFloat((totalCommentRating / updatedComments.length).toFixed(1));
        const finalCalculatedRating = parseFloat(((movie.rating * 4 + avg) / 5).toFixed(1)); // weighted blend

        return {
          ...movie,
          comments: updatedComments,
          rating: finalCalculatedRating
        };
      });
    });
  };

  // Delete evaluation feedback
  const handleDeleteComment = (movieId: string, commentId: string) => {
    setMoviesList((prevMovies) => {
      return prevMovies.map((movie) => {
        if (movie.id !== movieId) return movie;
        const filtered = movie.comments.filter((c) => c.id !== commentId);
        return {
          ...movie,
          comments: filtered
        };
      });
    });
  };

  // Access matching active movie object safely
  const activeMovie = useMemo(() => {
    return moviesList.find((m) => m.id === selectedMovieId) || moviesList[0];
  }, [selectedMovieId, moviesList]);

  // Browse selection actions
  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovieId(movie.id);
    setCurrentTab("movie-details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlayClick = (movie: Movie) => {
    setSelectedMovieId(movie.id);
    setCurrentTab("watch-player");
    setIsLoading(true);

    // Append to recently viewed (history queues)
    setRecentViews((prev) => {
      const filtered = prev.filter((id) => id !== movie.id);
      return [movie.id, ...filtered].slice(0, 10); // cap history logs at 10 items
    });
  };

  // 4. Recommendation & Category filtering for standard grid sections
  const moviesTrending = useMemo(() => moviesList.filter((m) => m.isTrending), [moviesList]);
  const moviesPopular = useMemo(() => moviesList.filter((m) => m.isPopular), [moviesList]);
  const moviesTopRated = useMemo(() => moviesList.filter((m) => m.isTopRated), [moviesList]);
  const moviesLatest = useMemo(() => moviesList.filter((m) => m.isLatest), [moviesList]);
  
  // Custom recommended algorithms (IMDb score is > 8.0)
  const moviesRecommended = useMemo(() => {
    return moviesList.filter((m) => m.rating >= 8.0);
  }, [moviesList]);

  // Return continue watching files lists (matching recentViews IDs in correct order)
  const moviesContinueWatching = useMemo(() => {
    return recentViews
      .map((id) => moviesList.find((m) => m.id === id))
      .filter((m): m is Movie => !!m);
  }, [recentViews, moviesList]);

  // Core filter method for Browse section
  const filteredMovies = useMemo(() => {
    return moviesList
      .filter((m) => {
        // Search term check
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          q === "" ||
          m.title.toLowerCase().includes(q) ||
          m.genres.some((g) => g.toLowerCase().includes(q)) ||
          m.year.toString().includes(q);

        // Genre filter check
        const matchesCategory = selectedCategory === "All" || m.genres.includes(selectedCategory);

        // Year filter check
        const matchesYear = selectedYear === "All" || m.year === selectedYear;

        // Rating filter check
        const matchesRating = selectedRating === "All" || m.rating >= selectedRating;

        return matchesQuery && matchesCategory && matchesYear && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "year") return b.year - a.year;
        return b.views - a.views; // default sorting: total views
      });
  }, [moviesList, searchQuery, selectedCategory, selectedYear, selectedRating, sortBy]);

  // Favorites matches list
  const watchListMovies = useMemo(() => {
    return moviesList.filter((m) => watchlist.includes(m.id));
  }, [moviesList, watchlist]);

  // Reset all search criteria
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedYear("All");
    setSelectedRating("All");
    setSortBy("views");
  };

  return (
    <div className="min-h-screen bg-brand-charcoal text-zinc-100 flex flex-col justify-between selection:bg-brand-red selection:text-white transition-all">
      {/* 1. Translucent frosted sticky header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        setSelectedMovieId={setSelectedMovieId}
        watchlistCount={watchlist.length}
        recentCount={recentViews.length}
        onSearch={(q) => {
          setSearchQuery(q);
          setCurrentTab("search");
        }}
      />

      <main className="flex-grow">
        
        {/* VIEW DETECTOR TAB SWITCHBOARD */}
        
        {/* CASE A: Custom Active Video Player mode */}
        {currentTab === "watch-player" ? (
          <div className="bg-black py-4">
            <div className="max-w-7xl mx-auto px-4">
              <CustomVideoPlayer
                videoUrl={activeMovie.videoUrl}
                movieTitle={activeMovie.title}
                onExit={() => {
                  setCurrentTab("movie-details");
                }}
              />
            </div>
          </div>
        ) : null}

        {/* CASE B: Movie Sheet Detailed Metadata */}
        {currentTab === "movie-details" ? (
          <MovieDetailsView
            movie={activeMovie}
            movies={moviesList}
            onPlayClick={handlePlayClick}
            onMovieSelect={handleMovieSelect}
            watchlist={watchlist}
            toggleWatchlist={toggleWatchlist}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
          />
        ) : null}

        {/* CASE C: Home dashboard overview */}
        {currentTab === "home" ? (
          <div>
            {/* 1. Splendid auto rotating header sliders */}
            <HeroSlider
              movies={moviesList}
              onPlayClick={handlePlayClick}
              onDetailsClick={handleMovieSelect}
              watchlist={watchlist}
              toggleWatchlist={toggleWatchlist}
            />

            {/* 2. Scrolling Catalog Horizontal Filter strip */}
            <div className="bg-zinc-950/40 backdrop-blur border-b border-zinc-900/60 sticky top-18 z-30">
              <CategoryList
                selectedCategory={selectedCategory}
                setSelectedCategory={(cat) => {
                  setSelectedCategory(cat);
                  setCurrentTab("search");
                }}
              />
            </div>

            {/* Skeleton state if loading, or grid segments */}
            {isLoading ? (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
                {[1, 2, 3].map((rowIndex) => (
                  <div key={rowIndex} className="space-y-4">
                    <div className="h-6 w-48 bg-zinc-800 rounded skeleton-pulse" />
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-3">
                      {[1, 2, 4, 5].map((cardIndex) => (
                        <div
                          key={cardIndex}
                          className="w-44 sm:w-52 md:w-56 h-[280px] sm:h-[320px] md:h-[350px] bg-zinc-900 rounded-xl skeleton-pulse flex-none"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
                
                {/* 1. CONTINUE WATCHING (Recently viewed stream) */}
                {moviesContinueWatching.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-lg md:text-xl font-bold font-display text-white flex items-center gap-2 border-l-4 border-amber-500 pl-3 leading-none">
                      <History className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
                      <span>Continue Watching / Recents</span>
                    </h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth">
                      {moviesContinueWatching.map((movie) => (
                        <MovieCard
                          key={movie.id}
                          movie={movie}
                          onPlayClick={handlePlayClick}
                          onDetailsClick={handleMovieSelect}
                          watchlist={watchlist}
                          toggleWatchlist={toggleWatchlist}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. TRENDING NOW SECTION */}
                <div className="space-y-4">
                  <h2 className="text-lg md:text-xl font-bold font-display text-white flex items-center gap-2 border-l-4 border-brand-red pl-3 leading-none">
                    <Flame className="w-5 h-5 text-brand-red fill-current" />
                    <span>Trending Movies</span>
                  </h2>
                  <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth">
                    {moviesTrending.map((movie) => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        onPlayClick={handlePlayClick}
                        onDetailsClick={handleMovieSelect}
                        watchlist={watchlist}
                        toggleWatchlist={toggleWatchlist}
                      />
                    ))}
                  </div>
                </div>

                {/* 3. LATEST RELEASES */}
                <div className="space-y-4">
                  <h2 className="text-lg md:text-xl font-bold font-display text-white flex items-center gap-2 border-l-4 border-brand-red pl-3 leading-none">
                    <Sparkles className="w-4.5 h-4.5 text-brand-red animate-pulse" />
                    <span>Latest Releases</span>
                  </h2>
                  <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth">
                    {moviesLatest.map((movie) => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        onPlayClick={handlePlayClick}
                        onDetailsClick={handleMovieSelect}
                        watchlist={watchlist}
                        toggleWatchlist={toggleWatchlist}
                      />
                    ))}
                  </div>
                </div>

                {/* 4. RECOMMENDATIONS (IMDb Rating > 8) */}
                <div className="space-y-4">
                  <h2 className="text-lg md:text-xl font-bold font-display text-white flex items-center gap-2 border-l-4 border-brand-red pl-3 leading-none">
                    <TrendingUp className="w-4.5 h-4.5 text-brand-red" />
                    <span>StreamX Top Recommended</span>
                  </h2>
                  <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth">
                    {moviesRecommended.map((movie) => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        onPlayClick={handlePlayClick}
                        onDetailsClick={handleMovieSelect}
                        watchlist={watchlist}
                        toggleWatchlist={toggleWatchlist}
                      />
                    ))}
                  </div>
                </div>

                {/* 5. POPULAR CINEMA */}
                <div className="space-y-4">
                  <h2 className="text-lg md:text-xl font-bold font-display text-white flex items-center gap-2 border-l-4 border-brand-red pl-3 leading-none">
                    <Film className="w-4.5 h-4.5 text-brand-red" />
                    <span>Popular Cinema</span>
                  </h2>
                  <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth">
                    {moviesPopular.map((movie) => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        onPlayClick={handlePlayClick}
                        onDetailsClick={handleMovieSelect}
                        watchlist={watchlist}
                        toggleWatchlist={toggleWatchlist}
                      />
                    ))}
                  </div>
                </div>

                {/* 6. TOP RATED FILMS */}
                <div className="space-y-4">
                  <h2 className="text-lg md:text-xl font-bold font-display text-white flex items-center gap-2 border-l-4 border-brand-red pl-3 leading-none">
                    <Star className="w-4.5 h-4.5 fill-brand-red text-brand-red" />
                    <span>Critically Acclaimed / Top-Rated</span>
                  </h2>
                  <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth">
                    {moviesTopRated.map((movie) => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        onPlayClick={handlePlayClick}
                        onDetailsClick={handleMovieSelect}
                        watchlist={watchlist}
                        toggleWatchlist={toggleWatchlist}
                      />
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        ) : null}

        {/* CASE D: Advanced Search Catalog Grid */}
        {currentTab === "search" ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
              <div>
                <h1 className="text-2xl font-black font-display text-white">Advanced Search & Filter</h1>
                <p className="text-xs text-zinc-500 mt-1">
                  Discovered <strong className="text-brand-red font-mono font-bold">{filteredMovies.length}</strong> spectacular movies matching criteria
                </p>
              </div>

              {/* Reset/filters buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-zinc-801"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" /> {showFilters ? "Hide Panel" : "Filter Board"}
                </button>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-brand-red/10 border border-brand-red/20 text-brand-red hover:bg-brand-red hover:text-white transition rounded-lg text-xs font-black cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            </div>

            {/* Expandable Advanced Filtrations Dash */}
            {showFilters && (
              <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-805/65 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-medium text-xs text-zinc-400">
                {/* Category/Genre dropdown select */}
                <div className="space-y-1.5">
                  <label className="text-zinc-500">Pick Genre Filter</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as Category | "All")}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white outline-none"
                  >
                    <option value="All">All Categories / Genres</option>
                    {SAMPLE_MOVIES.reduce<string[]>((acc, cur) => {
                      cur.genres.forEach((g) => {
                        if (!acc.includes(g)) acc.push(g);
                      });
                      return acc;
                    }, []).map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Release Year Dropdown select */}
                <div className="space-y-1.5">
                  <label className="text-zinc-500">Release Era</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedYear(val === "All" ? "All" : parseInt(val));
                    }}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white outline-none"
                  >
                    <option value="All">All Years</option>
                    {[2026, 2025, 2024].map((year) => (
                      <option key={year} value={year}>
                        {year} Releases
                      </option>
                    ))}
                  </select>
                </div>

                {/* IMDb benchmark rating select */}
                <div className="space-y-1.5">
                  <label className="text-zinc-500">Benchmark IMDb Score</label>
                  <select
                    value={selectedRating}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedRating(val === "All" ? "All" : parseFloat(val));
                    }}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white outline-none"
                  >
                    <option value="All">All Ratings</option>
                    <option value="8.5">★ 8.5+ Highly Acclaimed</option>
                    <option value="8.0">★ 8.0+ Superb</option>
                    <option value="7.5">★ 7.5+ Great Watch</option>
                    <option value="7.0">★ 7.0+ Decent</option>
                  </select>
                </div>

                {/* Sorting options select */}
                <div className="space-y-1.5">
                  <label className="text-zinc-500">Sort Catalog By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "rating" | "year" | "views")}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white outline-none"
                  >
                    <option value="views">Most Viewed Plays</option>
                    <option value="rating">Highest IMDb Ratings</option>
                    <option value="year">Latest Release Year</option>
                  </select>
                </div>
              </div>
            )}

            {/* Quick Live Search text box */}
            <div className="relative">
              <input
                type="text"
                placeholder="Type title, genre keywords, specific years, directors, or actors to fetch instantly..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/60 border border-zinc-805 rounded-xl py-3 pl-11 pr-4 text-xs font-semibold placeholder-zinc-500 text-white outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition"
              />
              <Search className="absolute left-4 top-3.5 w-4.5 h-4.5 text-zinc-500" />
            </div>

            {/* Movies grid display */}
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pt-4">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div
                    key={idx}
                    className="w-full h-[280px] sm:h-[320px] md:h-[350px] bg-zinc-900/40 rounded-xl skeleton-pulse"
                  />
                ))}
              </div>
            ) : filteredMovies.length === 0 ? (
              <div className="p-16 rounded-3xl bg-zinc-950/40 border border-zinc-900 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-brand-red/70 mx-auto" />
                <h3 className="text-sm font-bold text-white">No Movies Match Your Filters</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                  We currently lack matches fitting your parameters. Try clearing some selections or broadening search phrases!
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-brand-red text-white text-xs font-bold rounded-lg mt-2 cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pt-4 justify-items-center">
                {filteredMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onPlayClick={handlePlayClick}
                    onDetailsClick={handleMovieSelect}
                    watchlist={watchlist}
                    toggleWatchlist={toggleWatchlist}
                  />
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* CASE E: Watchlist (Favorites Catalog) */}
        {currentTab === "watchlist" ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <div className="border-b border-zinc-900 pb-5">
              <h1 className="text-2xl font-black font-display text-white flex items-center gap-2">
                <Heart className="w-6 h-6 text-brand-red fill-current" />
                <span>My StreamX Watchlist</span>
              </h1>
              <p className="text-xs text-zinc-500 mt-1">
                You have queued <span className="text-brand-red font-mono font-bold">{watchListMovies.length}</span> films for offline/online viewing
              </p>
            </div>

            {watchListMovies.length === 0 ? (
              <div className="p-16 rounded-3xl bg-zinc-950/40 border border-zinc-900 text-center space-y-3">
                <Heart className="w-10 h-10 text-zinc-800 mx-auto" />
                <h3 className="text-sm font-bold text-white">Your Watchlist is Hollow</h3>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
                  Browse the catalog, explore thumbnails, and press the heart icon to list films here!
                </p>
                <button
                  onClick={() => {
                    setCurrentTab("home");
                    setSelectedCategory("All");
                  }}
                  className="px-5 py-2.5 bg-brand-red text-white text-xs font-bold rounded-xl mt-2 cursor-pointer transition transform hover:scale-105"
                >
                  Browse Home Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 justify-items-center">
                {watchListMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onPlayClick={handlePlayClick}
                    onDetailsClick={handleMovieSelect}
                    watchlist={watchlist}
                    toggleWatchlist={toggleWatchlist}
                  />
                ))}
              </div>
            )}
          </div>
        ) : null}

      </main>

      {/* 2. Unified Footer System */}
      <Footer
        setCurrentTab={setCurrentTab}
        setSelectedCategory={setSelectedCategory}
      />
    </div>
  );
}
