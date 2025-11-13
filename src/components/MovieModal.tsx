import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, Clock, BarChart3, Heart, MessageCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import RatingDialog from "./RatingDialog";
import CommentSection from "./CommentSection";
import MovieAnalytics from "./MovieAnalytics";
import { useToggleFavorite, useFavoriteStatus } from "@/hooks/useMovieInteractions";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface Movie {
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

interface MovieModalProps {
  movie: Movie | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MovieModal = ({ movie, open, onOpenChange }: MovieModalProps) => {
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const { user } = useAuth();
  const { data: isFavorite } = useFavoriteStatus(movie?.id || "");
  const toggleFavorite = useToggleFavorite();

  if (!movie) return null;

  const handleRateClick = () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to rate movies",
      });
      return;
    }
    setShowRatingDialog(true);
  };

  const handleFavoriteClick = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to add favorites",
      });
      return;
    }
    await toggleFavorite.mutateAsync(movie.id);
  };

  const handleCommentClick = () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to comment",
      });
      return;
    }
    setShowComments(!showComments);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-card border-border">
          <ScrollArea className="max-h-[90vh]">
            <div className="relative">
              <div className="aspect-video w-full overflow-hidden bg-muted">
                <img 
                  src={movie.poster_url} 
                  alt={movie.title}
                  className="w-full h-full object-cover blur-md scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 aspect-[2/3] rounded-lg overflow-hidden shadow-card border-2 border-secondary">
                  <img 
                    src={movie.poster_url} 
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold text-foreground">
                  {movie.title}
                </DialogTitle>
              </DialogHeader>

              <div className="flex items-center gap-4 flex-wrap">
                <Badge variant="outline" className="border-secondary text-secondary">
                  {movie.certificate}
                </Badge>
                
                <div className="flex items-center gap-1 text-secondary">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-lg font-bold">{movie.rating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">/ 10</span>
                </div>
                
                <span className="text-sm text-muted-foreground">({movie.num_ratings} ratings)</span>
                
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{movie.year}</span>
                </div>
                
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{movie.runtime} min</span>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {movie.genre.map((g) => (
                  <Badge key={g} variant="secondary">
                    {g}
                  </Badge>
                ))}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Overview</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {movie.overview}
                </p>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button className="gap-2" onClick={handleRateClick}>
                  <Star className="w-4 h-4" />
                  Rate Movie
                </Button>
                <Button variant="outline" className="gap-2" onClick={handleFavoriteClick}>
                  <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                  {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </Button>
                <Button variant="outline" className="gap-2" onClick={handleCommentClick}>
                  <MessageCircle className="w-4 h-4" />
                  {showComments ? "Hide Comments" : "View Comments"}
                </Button>
              </div>

              {showComments && (
                <div className="border-t border-border pt-4">
                  <CommentSection movieId={movie.id} />
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <RatingDialog
        movieId={movie.id}
        movieTitle={movie.title}
        open={showRatingDialog}
        onOpenChange={setShowRatingDialog}
      />
    </>
  );
};

export default MovieModal;
