import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useMovieRatings = (movieId: string) => {
  return useQuery({
    queryKey: ["movie-ratings", movieId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ratings")
        .select("rating, created_at")
        .eq("movie_id", movieId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};
