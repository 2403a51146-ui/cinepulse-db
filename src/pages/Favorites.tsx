import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import MovieModal from "@/components/MovieModal";
import { Navigate } from "react-router-dom";

const Favorites = () => {
  const { user } = useAuth();
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          movies (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleMovieClick = (movie: any) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-foreground mb-8">My Favorites</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <p className="text-lg text-muted-foreground">Loading favorites...</p>
          </div>
        ) : favorites && favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {favorites.map((fav: any) => (
              <MovieCard
                key={fav.id}
                title={fav.movies.title}
                year={fav.movies.year}
                rating={fav.movies.rating || 0}
                numRatings={fav.movies.num_ratings || 0}
                posterUrl={fav.movies.poster_url || ''}
                genre={fav.movies.genre || []}
                runtime={fav.movies.runtime}
                onClick={() => handleMovieClick(fav.movies)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <p className="text-xl text-muted-foreground mb-2">No favorites yet</p>
            <p className="text-sm text-muted-foreground">
              Start adding movies to your favorites to see them here!
            </p>
          </div>
        )}
      </main>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default Favorites;
