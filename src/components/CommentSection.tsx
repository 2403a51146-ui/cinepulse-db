import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMovieComments, useAddComment } from "@/hooks/useMovieInteractions";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface CommentSectionProps {
  movieId: string;
}

const CommentSection = ({ movieId }: CommentSectionProps) => {
  const [comment, setComment] = useState("");
  const { user } = useAuth();
  const { data: comments, isLoading } = useMovieComments(movieId);
  const addComment = useAddComment();
  const queryClient = useQueryClient();

  // Real-time subscription for comments
  useEffect(() => {
    const channel = supabase
      .channel(`comments-${movieId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `movie_id=eq.${movieId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['comments', movieId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [movieId, queryClient]);

  const handleSubmit = async () => {
    if (!comment.trim() || !user) return;
    try {
      await addComment.mutateAsync({ movieId, text: comment });
      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Comments</h3>
      
      {user && (
        <div className="space-y-2">
          <Textarea
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={handleSubmit} disabled={!comment.trim() || addComment.isPending}>
            {addComment.isPending ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      )}

      {isLoading && <p className="text-muted-foreground">Loading comments...</p>}

      {comments && comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((c: any) => (
            <div key={c.id} className="border-b border-border pb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-foreground">
                  {c.profiles?.name || c.profiles?.email?.split("@")[0] || "Anonymous"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{c.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No comments yet. Be the first to share your thoughts!
        </p>
      )}
    </div>
  );
};

export default CommentSection;
