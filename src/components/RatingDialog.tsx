import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useAddOrUpdateRating, useMovieRating } from "@/hooks/useMovieInteractions";

interface RatingDialogProps {
  movieId: string;
  movieTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RatingDialog = ({ movieId, movieTitle, open, onOpenChange }: RatingDialogProps) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const { data: existingRating } = useMovieRating(movieId);
  const addOrUpdateRating = useAddOrUpdateRating();

  const handleRate = async (rating: number) => {
    await addOrUpdateRating.mutateAsync({ movieId, rating });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate {movieTitle}</DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          <p className="text-center text-muted-foreground mb-4">
            {existingRating ? "Update your rating" : "How would you rate this movie?"}
          </p>
          
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRate(rating)}
                onMouseEnter={() => setHoveredRating(rating)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    rating <= (hoveredRating || existingRating?.rating || 0)
                      ? "fill-secondary text-secondary"
                      : "text-muted"
                  }`}
                />
              </button>
            ))}
          </div>
          
          <p className="text-center mt-4 text-sm text-muted-foreground">
            {hoveredRating > 0 ? `${hoveredRating} / 10` : existingRating ? `Your rating: ${existingRating.rating} / 10` : "Select a rating"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDialog;
