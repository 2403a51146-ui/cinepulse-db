import { useState } from "react";
import { Filter } from "lucide-react";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import MovieModal from "@/components/MovieModal";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockMovies } from "@/data/mockMovies";

const Index = () => {
  const [selectedMovie, setSelectedMovie] = useState<typeof mockMovies[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating-desc");

  const handleMovieClick = (movie: typeof mockMovies[0]) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const filteredMovies = mockMovies
    .filter(movie => 
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "rating-desc") return b.rating - a.rating;
      if (sortBy === "rating-asc") return a.rating - b.rating;
      if (sortBy === "year-desc") return b.year - a.year;
      if (sortBy === "year-asc") return a.year - b.year;
      return 0;
    });

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={setSearchQuery} />
      
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-20" />
        <div className="container mx-auto px-4 py-12 relative">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-foreground">
              Discover Telugu Cinema
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              {...movie}
              onClick={() => handleMovieClick(movie)}
            />
          ))}
        </div>

        {filteredMovies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No movies found matching your search.
            </p>
          </div>
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
