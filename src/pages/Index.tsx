import { useState } from "react";
import { Filter } from "lucide-react";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import MovieModal from "@/components/MovieModal";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMovies } from "@/hooks/useMovies";
import Cinema3DBackground from "@/components/Cinema3DBackground";

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
      
      <div className="relative overflow-hidden min-h-[400px] flex items-center">
        <Cinema3DBackground />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-3xl p-8 rounded-2xl bg-background/30 backdrop-blur-xl border border-[#FFD700]/20 shadow-[0_8px_32px_0_rgba(255,215,0,0.2)] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-[#FFD700]/5 before:to-[#8B0000]/5 before:-z-10 relative">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#8B0000] to-[#FFD700] drop-shadow-[0_0_30px_rgba(255,215,0,0.4)] leading-tight">
              Discover Telugu Cinema
            </h1>
            <p className="text-xl text-[#FFD700] drop-shadow-lg">
              Explore the rich world of Telugu movies, rate your favorites, and connect with fellow cinema lovers.
            </p>
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
