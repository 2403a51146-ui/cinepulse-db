-- Add columns to store original ratings from dataset
ALTER TABLE public.movies 
ADD COLUMN IF NOT EXISTS original_rating numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS original_num_ratings integer DEFAULT 0;

-- Populate original ratings from current values (one-time migration)
UPDATE public.movies 
SET original_rating = rating, 
    original_num_ratings = num_ratings
WHERE original_num_ratings = 0;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_movie_rating_trigger ON public.ratings;

-- Recreate the function to include original ratings in calculation
CREATE OR REPLACE FUNCTION public.update_movie_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_movie_id uuid;
  v_user_ratings_sum numeric;
  v_user_ratings_count integer;
  v_original_rating numeric;
  v_original_count integer;
  v_total_rating numeric;
  v_total_count integer;
BEGIN
  v_movie_id := COALESCE(NEW.movie_id, OLD.movie_id);
  
  -- Get user ratings from ratings table
  SELECT COALESCE(SUM(rating), 0), COUNT(*)
  INTO v_user_ratings_sum, v_user_ratings_count
  FROM public.ratings
  WHERE movie_id = v_movie_id;
  
  -- Get original ratings from movies table
  SELECT original_rating, original_num_ratings
  INTO v_original_rating, v_original_count
  FROM public.movies
  WHERE id = v_movie_id;
  
  -- Calculate combined average
  v_total_count := v_user_ratings_count + COALESCE(v_original_count, 0);
  
  IF v_total_count > 0 THEN
    v_total_rating := (v_user_ratings_sum + (COALESCE(v_original_rating, 0) * COALESCE(v_original_count, 0))) / v_total_count;
  ELSE
    v_total_rating := 0;
  END IF;
  
  -- Update movie with combined rating
  UPDATE public.movies
  SET 
    rating = ROUND(v_total_rating, 1),
    num_ratings = v_total_count
  WHERE id = v_movie_id;
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Recreate trigger
CREATE TRIGGER update_movie_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.ratings
FOR EACH ROW
EXECUTE FUNCTION public.update_movie_rating();