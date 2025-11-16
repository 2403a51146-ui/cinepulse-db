import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const useMovieRating = (movieId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["rating", movieId, user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("ratings")
        .select("*")
        .eq("movie_id", movieId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useAddOrUpdateRating = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ movieId, rating }: { movieId: string; rating: number }) => {
      if (!user) throw new Error("Must be logged in");

      const { data, error } = await supabase
        .from("ratings")
        .upsert({
          user_id: user.id,
          movie_id: movieId,
          rating,
        }, {
          onConflict: 'user_id,movie_id'
        })
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["rating", variables.movieId] });
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      queryClient.invalidateQueries({ queryKey: ["movie-ratings", variables.movieId] });
      toast({ title: "Rating updated!" });
    },
  });
};

export const useMovieComments = (movieId: string) => {
  return useQuery({
    queryKey: ["comments", movieId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          id,
          text,
          created_at,
          user_id,
          movie_id
        `)
        .eq("movie_id", movieId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Fetch user profiles separately
      if (data && data.length > 0) {
        const userIds = [...new Set(data.map(c => c.user_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, name, email")
          .in("id", userIds);
        
        // Map profiles to comments
        return data.map(comment => ({
          ...comment,
          profiles: profiles?.find(p => p.id === comment.user_id)
        }));
      }
      
      return data;
    },
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ movieId, text }: { movieId: string; text: string }) => {
      if (!user) throw new Error("Must be logged in");

      const { data, error } = await supabase
        .from("comments")
        .insert({
          user_id: user.id,
          movie_id: movieId,
          text,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.movieId] });
      toast({ title: "Comment added!" });
    },
  });
};

export const useFavoriteStatus = (movieId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["favorite", movieId, user?.id],
    queryFn: async () => {
      if (!user) return false;

      const { data, error } = await supabase
        .from("favorites")
        .select("id")
        .eq("movie_id", movieId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user,
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (movieId: string) => {
      if (!user) throw new Error("Must be logged in");

      const { data: existing } = await supabase
        .from("favorites")
        .select("id")
        .eq("movie_id", movieId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        await supabase.from("favorites").delete().eq("id", existing.id);
        return false;
      } else {
        await supabase
          .from("favorites")
          .insert({ user_id: user.id, movie_id: movieId });
        return true;
      }
    },
    onSuccess: (added, movieId) => {
      queryClient.invalidateQueries({ queryKey: ["favorite", movieId] });
      toast({ title: added ? "Added to favorites" : "Removed from favorites" });
    },
  });
};
