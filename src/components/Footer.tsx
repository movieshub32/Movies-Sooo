import React, { useState } from "react";
import { Play, Facebook, Twitter, Instagram, Youtube, Send, CheckCircle } from "lucide-react";
import { Category } from "../types";

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  setSelectedCategory: (category: Category | "All") => void;
}

export default function Footer({ setCurrentTab, setSelectedCategory }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const handleGenreClick = (genre: Category) => {
    setSelectedCategory(genre);
    setCurrentTab("search");
    window.scrollTo({ top: 320, behavior: "smooth" });
  };

  return (
    <footer className="bg-brand-charcoal text-zinc-400 text-xs border-t border-zinc-900/80 pt-16 pb-12 font-medium">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Quicklinks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-zinc-900/85">
          
          {/* Col 1: Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-black text-brand-red">
              <div className="p-1 px-2.5 bg-brand-red text-white font-bold rounded flex items-center justify-center">
                <Play className="fill-current w-4.5 h-4.5" />
              </div>
              <span className="font-display tracking-tight uppercase">Stream<span className="text-white font-light">X</span></span>
            </div>
            <p className="leading-relaxed text-zinc-500 max-w-sm">
              Discover, watch, and download hundreds of cinematic masterpieces matching standard 4K Ultra HD formats. Your premium commercial-free streaming paradise.
            </p>
            
            {/* Socials */}
            <div className="flex gap-2.5 pt-1">
              <a href="#" className="p-2 bg-zinc-950 hover:bg-brand-red text-zinc-500 hover:text-white rounded-lg transition">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-zinc-950 hover:bg-brand-red text-zinc-500 hover:text-white rounded-lg transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-zinc-950 hover:bg-brand-red text-zinc-500 hover:text-white rounded-lg transition">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-zinc-950 hover:bg-brand-red text-zinc-500 hover:text-white rounded-lg transition">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation shortcuts */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">StreamX Links</h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => {
                    setCurrentTab("home");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-white cursor-pointer transition"
                >
                  Go to Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setCurrentTab("search");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-white cursor-pointer transition"
                >
                  Browse Movies
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentTab("watchlist");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-white cursor-pointer transition"
                >
                  My Watchlist
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Premium Account VIP Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy Policy & Disclaimer
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Category quick filters */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Top Stream Genres</h4>
            <div className="grid grid-cols-2 gap-x-2 gap-y-2.5">
              <button onClick={() => handleGenreClick("Action")} className="text-left hover:text-white transition font-medium cursor-pointer">
                Action Movies
              </button>
              <button onClick={() => handleGenreClick("Sci-Fi")} className="text-left hover:text-white transition font-medium cursor-pointer">
                Sci-Fi & Cyberpunk
              </button>
              <button onClick={() => handleGenreClick("Thriller")} className="text-left hover:text-white transition font-medium cursor-pointer">
                Thrillers
              </button>
              <button onClick={() => handleGenreClick("Horror")} className="text-left hover:text-white transition font-medium cursor-pointer">
                Horror
              </button>
              <button onClick={() => handleGenreClick("Adventure")} className="text-left hover:text-white transition font-medium cursor-pointer">
                Adventure
              </button>
              <button onClick={() => handleGenreClick("Comedy")} className="text-left hover:text-white transition font-medium cursor-pointer">
                Comedy
              </button>
            </div>
          </div>

          {/* Col 4: Newsletter Subscription Box */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Stream Alerts</h4>
            <p className="leading-relaxed text-zinc-500">
              Subscribe to stay updated with latest additions, cinema trailer alerts, and VIP discounts.
            </p>

            {subscribed ? (
              <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 font-semibold rounded-lg flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 flex-none" />
                <span>Subscribed! Check your inbox soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 font-medium">
                <input
                  type="email"
                  placeholder="Enter email adress..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-zinc-950 border border-zinc-805 rounded-lg py-2 px-3 text-xs text-white placeholder-zinc-650 outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition"
                  required
                />
                <button
                  type="submit"
                  className="p-2 px-3 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg transition cursor-pointer flex items-center justify-center"
                  title="Subscribe Now"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Copywrite lines bottom layout */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-zinc-500 gap-4">
          <p>© 2026 StreamX Movie Streaming Portal. Designed with Netflix-style premium aesthetic. All files are royalty-clean.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline transition">FAQ & Help</a>
            <span>•</span>
            <a href="#" className="hover:underline transition font-semibold text-brand-red">Fahad’s Special UHD Pass</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
