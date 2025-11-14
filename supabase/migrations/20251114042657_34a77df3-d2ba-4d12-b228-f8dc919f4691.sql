-- Create storage bucket for movie posters
INSERT INTO storage.buckets (id, name, public)
VALUES ('movie-posters', 'movie-posters', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for movie posters bucket
CREATE POLICY "Anyone can view movie posters"
ON storage.objects FOR SELECT
USING (bucket_id = 'movie-posters');

CREATE POLICY "Admins can upload movie posters"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'movie-posters' 
  AND has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update movie posters"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'movie-posters' 
  AND has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete movie posters"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'movie-posters' 
  AND has_role(auth.uid(), 'admin')
);