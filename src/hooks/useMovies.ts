import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Movie {
  id: string;
  title: string;
  year: number;
  certificate: string;
  genre: string[];
  overview: string;
  runtime: number;
  rating: number;
  num_ratings: number;
  poster_url: string;
}

export const useMovies = (searchQuery = "", sortBy = "rating-desc") => {
  return useQuery({
    queryKey: ["movies", searchQuery, sortBy],
    queryFn: async () => {
      let query = supabase.from("movies").select("*");

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      let movies = data || [];

      // Sort on client side for now
      movies.sort((a, b) => {
        if (sortBy === "rating-desc") return b.rating - a.rating;
        if (sortBy === "rating-asc") return a.rating - b.rating;
        if (sortBy === "year-desc") return b.year - a.year;
        if (sortBy === "year-asc") return a.year - b.year;
        return 0;
      });

      return movies;
    },
  });
};

export const useAddMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (movie: Omit<Movie, "id" | "rating" | "num_ratings">) => {
      const { data, error } = await supabase
        .from("movies")
        .insert([movie])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      toast({ title: "Movie added successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add movie",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Movie> & { id: string }) => {
      const { data, error } = await supabase
        .from("movies")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      toast({ title: "Movie updated successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update movie",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("movies").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      toast({ title: "Movie deleted successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete movie",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
