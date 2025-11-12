import { Star, Calendar, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MovieCardProps {
  title: string;
  year: number;
  rating: number;
  numRatings: number;
  posterUrl: string;
  genre: string[];
  runtime?: number;
  onClick?: () => void;
}

const MovieCard = ({ 
  title, 
  year, 
  rating, 
  numRatings, 
  posterUrl, 
  genre,
  runtime,
  onClick 
}: MovieCardProps) => {
  return (
    <Card 
      className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-glow bg-card border-border"
      onClick={onClick}
    >
      <div className="aspect-[2/3] overflow-hidden bg-muted">
        <img 
          src={posterUrl} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          <h3 className="font-bold text-lg line-clamp-2 text-white">
            {title}
          </h3>
          
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-secondary">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-muted-foreground">({numRatings})</span>
            
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span className="text-xs">{year}</span>
            </div>
            
            {runtime && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span className="text-xs">{runtime}m</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-1 flex-wrap">
            {genre.slice(0, 2).map((g) => (
              <Badge key={g} variant="secondary" className="text-xs">
                {g}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-3 bg-gradient-card">
        <h3 className="font-semibold text-sm line-clamp-1 text-foreground">
          {title}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1 text-secondary">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs font-semibold">{rating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-muted-foreground">{year}</span>
        </div>
      </div>
    </Card>
  );
};

export default MovieCard;
