import { Category, CATEGORIES } from "../types";
import { Compass } from "lucide-react";

interface CategoryListProps {
  selectedCategory: Category | "All";
  setSelectedCategory: (category: Category | "All") => void;
}

export default function CategoryList({
  selectedCategory,
  setSelectedCategory,
}: CategoryListProps) {
  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 py-3 border-b border-zinc-900 overflow-x-auto no-scrollbar scroll-smooth">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-bold uppercase tracking-wider pr-3 border-r border-zinc-800 flex-none select-none">
            <Compass className="w-4 h-4 text-brand-red animate-pulse" />
            <span>Genres</span>
          </div>

          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all duration-300 cursor-pointer flex-none ${
              selectedCategory === "All"
                ? "bg-brand-red border-brand-red text-white shadow-md shadow-brand-red/20 transform scale-105"
                : "bg-zinc-900 border-zinc-800/80 text-zinc-400 hover:text-white hover:border-zinc-700"
            }`}
          >
            All Movies
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all duration-300 cursor-pointer flex-none ${
                selectedCategory === cat
                  ? "bg-brand-red border-brand-red text-white shadow-md shadow-brand-red/20 transform scale-105"
                  : "bg-zinc-900 border-zinc-800/80 text-zinc-400 hover:text-white hover:border-zinc-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
