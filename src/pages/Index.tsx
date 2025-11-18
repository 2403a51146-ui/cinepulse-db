import { useState } from "react";
import { Filter } from "lucide-react";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import MovieModal from "@/components/MovieModal";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMovies } from "@/hooks/useMovies";
import Parallax3DBackground from "@/components/Parallax3DBackground";

const Index = () => {
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating-desc");

  const { data: movies = [], isLoading } = useMovies(searchQuery, sortBy);

  const handleMovieClick = (movie: any) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={setSearchQuery} />
      
      <div className="relative overflow-hidden min-h-[320px] flex items-start pt-8">
        <Parallax3DBackground />
        
        {/* Decorative elements */}
        <div className="absolute top-8 left-8 w-24 h-24 border-2 border-[#FFD700]/20 rounded-full z-10 animate-pulse" />
        <div className="absolute bottom-8 right-8 w-32 h-32 border-2 border-[#8B0000]/20 rounded-full z-10 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-12 w-20 h-20 border border-[#FFD700]/10 rotate-45 z-10" />
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-3xl p-6 rounded-2xl bg-background/20 backdrop-blur-3xl border border-[#FFD700]/40 shadow-[0_20px_60px_0_rgba(255,215,0,0.3),0_0_0_1px_rgba(255,215,0,0.15)_inset,0_0_80px_rgba(139,0,0,0.2)] relative overflow-hidden transform transition-all duration-300 hover:shadow-[0_25px_80px_0_rgba(255,215,0,0.4),0_0_0_1px_rgba(255,215,0,0.2)_inset,0_0_100px_rgba(139,0,0,0.3)]">
            {/* Inner glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/8 via-transparent to-[#8B0000]/8 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent" />
            
            <div className="relative z-10">
              <div className="relative mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#8B0000] to-[#FFD700] drop-shadow-[0_0_30px_rgba(255,215,0,0.5)] leading-tight tracking-wider animate-pulse">
                  Discover Telugu Cinema
                </h1>
                <div className="absolute -bottom-2 left-0 w-28 h-1 bg-gradient-to-r from-[#FFD700] via-[#8B0000] to-transparent rounded-full" />
              </div>
              <p className="text-base md:text-lg text-[#FFD700]/90 drop-shadow-lg">
                Explore the rich world of Telugu movies, rate your favorites, and connect with fellow cinema lovers.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            Trending Movies
          </h2>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating-desc">Rating: High to Low</SelectItem>
                <SelectItem value="rating-asc">Rating: Low to High</SelectItem>
                <SelectItem value="year-desc">Year: Newest First</SelectItem>
                <SelectItem value="year-asc">Year: Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading movies...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  title={movie.title}
                  year={movie.year}
                  rating={movie.rating}
                  numRatings={movie.num_ratings}
                  posterUrl={movie.poster_url}
                  genre={movie.genre}
                  runtime={movie.runtime}
                  onClick={() => handleMovieClick(movie)}
                />
              ))}
            </div>

            {movies.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No movies found matching your search.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <MovieModal
        movie={selectedMovie}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
};

export default Index;
