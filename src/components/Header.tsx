import React, { useState, useRef, useEffect } from "react";
import { Search, Heart, Clock, Menu, X, Play, LogOut, Settings, Award } from "lucide-react";
import { Movie } from "../types";
import { SAMPLE_MOVIES } from "../data/movies";

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  setSelectedMovieId: (id: string | null) => void;
  watchlistCount: number;
  recentCount: number;
  onSearch: (query: string) => void;
}

export default function Header({
  currentTab,
  setCurrentTab,
  setSelectedMovieId,
  watchlistCount,
  recentCount,
  onSearch,
}: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update suggestions live
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSuggestions([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = SAMPLE_MOVIES.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.genres.some((g) => g.toLowerCase().includes(q)) ||
        m.year.toString().includes(q)
    );
    setSuggestions(filtered.slice(0, 5));
  }, [searchQuery]);

  const handleSuggestionClick = (movie: Movie) => {
    setSelectedMovieId(movie.id);
    setCurrentTab("movie-details");
    setSearchQuery("");
    setSearchFocused(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setCurrentTab("search");
      setSearchFocused(false);
    }
  };

  const handleLogoClick = () => {
    setCurrentTab("home");
    setSelectedMovieId(null);
    setSearchQuery("");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-brand-charcoal/80 border-b border-zinc-800/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo and Main Nav Desktop */}
        <div className="flex items-center gap-8">
          <button
            onClick={handleLogoClick}
            id="nav-logo"
            className="flex items-center gap-2 text-2xl font-black tracking-tighter text-brand-red cursor-pointer transition transform hover:scale-105"
          >
            <div className="p-1 px-2.5 bg-brand-red text-white font-bold rounded-lg flex items-center justify-center shadow-lg shadow-brand-red/30">
              <Play className="fill-current w-5 h-5" />
            </div>
            <span className="font-display uppercase">Stream<span className="text-white font-light">X</span></span>
          </button>

          {/* Nav items for desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-300">
            <button
              onClick={() => {
                setCurrentTab("home");
                setSelectedMovieId(null);
              }}
              className={`hover:text-brand-red cursor-pointer transition ${
                currentTab === "home" ? "text-brand-red font-semibold" : ""
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                onSearch("");
                setCurrentTab("search");
              }}
              className={`hover:text-brand-red cursor-pointer transition ${
                currentTab === "search" ? "text-brand-red font-semibold" : ""
              }`}
            >
              Browse
            </button>
            <button
              onClick={() => setCurrentTab("watchlist")}
              className={`hover:text-brand-red cursor-pointer transition flex items-center gap-2 ${
                currentTab === "watchlist" ? "text-brand-red font-semibold" : ""
              }`}
            >
              Watchlist
              {watchlistCount > 0 && (
                <span className="px-1.5 py-0.5 text-xs bg-brand-red text-white font-bold rounded-full">
                  {watchlistCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Search, Favorites & Profile Desktop */}
        <div className="flex items-center gap-4">
          {/* Live Search Bar */}
          <div ref={searchRef} className="relative hidden sm:block w-48 lg:w-72">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Titles, genres, years..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-brand-red/60 focus:ring-1 focus:ring-brand-red/60 rounded-full py-1.5 pl-10 pr-4 text-xs font-medium text-white placeholder-zinc-500 outline-none transition duration-300"
                />
                <Search className="absolute left-3.5 top-2 w-4 h-4 text-zinc-500" />
              </div>
            </form>

            {/* Suggestions Dropdown Popup */}
            {searchFocused && (suggestions.length > 0 || searchQuery.trim().length > 0) && (
              <div className="absolute right-0 mt-2 w-80 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl z-50">
                <div className="p-3 border-b border-zinc-900 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Instant Suggestions
                  </span>
                  {searchQuery.trim() && (
                    <button
                      onClick={handleSearchSubmit}
                      className="text-[10px] text-brand-red hover:underline font-bold"
                    >
                      View all
                    </button>
                  )}
                </div>

                {suggestions.length === 0 ? (
                  <div className="p-6 text-center text-xs text-zinc-500">
                    No matching movies found.
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-900/60 max-h-80 overflow-y-auto">
                    {suggestions.map((movie) => (
                      <button
                        key={movie.id}
                        onClick={() => handleSuggestionClick(movie)}
                        className="w-full text-left p-2.5 hover:bg-zinc-900/50 flex gap-3 transition"
                      >
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="w-10 h-14 object-cover rounded shadow"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate leading-tight">
                            {movie.title}
                          </p>
                          <div className="flex gap-2 items-center mt-1 text-[11px] text-zinc-400">
                            <span>{movie.year}</span>
                            <span>•</span>
                            <span className="text-zinc-500">{movie.genres.slice(0, 2).join(", ")}</span>
                          </div>
                          <div className="flex gap-2 items-center mt-0.5 text-[10px]">
                            <span className="text-amber-500 font-bold">★ {movie.rating}</span>
                            <span className="bg-zinc-800 px-1 py-0.2 rounded text-[9px] text-zinc-300 font-bold uppercase">
                              {movie.quality}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick List Favorites Shortcut */}
          <button
            onClick={() => setCurrentTab("watchlist")}
            title="My Watchlist"
            className="p-2 text-zinc-400 hover:text-brand-red cursor-pointer transition relative"
          >
            <Heart className={`w-5 h-5 ${currentTab === "watchlist" ? "fill-brand-red text-brand-red" : ""}`} />
            {watchlistCount > 0 && (
              <span className="absolute -top-1 -right-1 leading-none flex h-4 w-4 items-center justify-center rounded-full bg-brand-red text-[9px] font-bold text-white ring-2 ring-brand-charcoal">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Profile Section */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-brand-red/60 rounded-full p-0.5"
            >
              <div className="relative h-8 w-8 rounded-full overflow-hidden border border-zinc-700 hover:border-brand-red transition">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop"
                  alt="User Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
            </button>

            {/* Profile Dropdown */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl z-50">
                <div className="p-4 bg-zinc-900 border-b border-zinc-800">
                  <p className="text-sm font-bold text-white">Fahad Waran</p>
                  <p className="text-xs text-zinc-500 truncate mb-2">fahadwaran@gmail.com</p>
                  <div className="flex items-center gap-1 px-2 py-1 bg-brand-red/10 border border-brand-red/20 rounded text-[10px] text-brand-red font-semibold w-fit">
                    <Award className="w-3 h-3" /> Ultra HD VIP member
                  </div>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => {
                      setCurrentTab("watchlist");
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-900 hover:text-white rounded-md flex items-center gap-2 transition"
                  >
                    <Heart className="w-4 h-4 text-zinc-400" /> My Watchlist ({watchlistCount})
                  </button>
                  <button
                    onClick={() => {
                      onSearch("");
                      setCurrentTab("search");
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-900 hover:text-white rounded-md flex items-center gap-2 transition"
                  >
                    <Clock className="w-4 h-4 text-zinc-400" /> Recently Viewed ({recentCount})
                  </button>
                  <button
                    onClick={() => setProfileDropdownOpen(false)}
                    className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-900 hover:text-white rounded-md flex items-center gap-2 transition"
                  >
                    <Settings className="w-4 h-4 text-zinc-400" /> Account Settings
                  </button>
                </div>
                <div className="p-1 border-t border-zinc-900">
                  <button
                    onClick={() => setProfileDropdownOpen(false)}
                    className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-md flex items-center gap-2 transition"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hamburger menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-brand-red transition cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-900 bg-zinc-950 px-4 py-4 space-y-3 shadow-xl flex flex-col items-stretch">
          {/* Quick search */}
          <form
            onSubmit={(e) => {
              handleSearchSubmit(e);
              setMobileMenuOpen(false);
            }}
            className="relative"
          >
            <input
              type="text"
              placeholder="Search movies, genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 pl-9 pr-4 text-xs font-medium text-white outline-none"
            />
            <Search className="absolute left-3 top-2 w-4 h-4 text-zinc-500" />
          </form>

          {/* Menu links */}
          <button
            onClick={() => {
              setCurrentTab("home");
              setSelectedMovieId(null);
              setMobileMenuOpen(false);
            }}
            className={`text-left px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:bg-zinc-900 transition ${
              currentTab === "home" ? "bg-zinc-900 text-brand-red font-bold" : ""
            }`}
          >
            Home
          </button>
          <button
            onClick={() => {
              onSearch("");
              setCurrentTab("search");
              setMobileMenuOpen(false);
            }}
            className={`text-left px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:bg-zinc-900 transition ${
              currentTab === "search" ? "bg-zinc-900 text-brand-red font-bold" : ""
            }`}
          >
            Browse/Search Catalog
          </button>
          <button
            onClick={() => {
              setCurrentTab("watchlist");
              setMobileMenuOpen(false);
            }}
            className={`text-left px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:bg-zinc-900 transition flex justify-between items-center ${
              currentTab === "watchlist" ? "bg-zinc-900 text-brand-red font-bold" : ""
            }`}
          >
            Watchlist
            {watchlistCount > 0 && (
              <span className="px-1.5 py-0.5 bg-brand-red text-white text-xs font-bold rounded-full">
                {watchlistCount}
              </span>
            )}
          </button>
        </div>
      )}
    </header>
  );
}
