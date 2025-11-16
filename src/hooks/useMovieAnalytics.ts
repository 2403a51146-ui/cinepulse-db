import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useMovieRatings = (movieId: string) => {
  return useQuery({
    queryKey: ["movie-ratings", movieId],
    queryFn: async () => {
      // Fetch user ratings
      const { data: userRatings, error: ratingsError } = await supabase
        .from("ratings")
        .select("rating, created_at")
        .eq("movie_id", movieId)
        .order("created_at", { ascending: true });

      if (ratingsError) throw ratingsError;

      // Fetch movie data for original ratings
      const { data: movie, error: movieError } = await supabase
        .from("movies")
        .select("rating, num_ratings, original_rating, original_num_ratings")
        .eq("id", movieId)
        .single();

      if (movieError) throw movieError;

      return {
        userRatings: userRatings || [],
        movieData: movie
      };
    },
  });
};
