import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2 } from "lucide-react";
import { useMovies } from "@/hooks/useMovies";

export default function AdminDashboard() {
  const { toast } = useToast();
  const { data: movies, isLoading } = useMovies();
  const [selectedMovieId, setSelectedMovieId] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterUrl, setPosterUrl] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [editMode, setEditMode] = useState<"upload" | "url">("upload");

  // Check if user is admin
  const { data: isAdmin } = useQuery({
    queryKey: ["user-role"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();
      
      return !!data;
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      
      setPosterFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!posterFile || !selectedMovieId) {
      toast({
        title: "Missing information",
        description: "Please select a movie and a poster image",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Upload to storage
      const fileExt = posterFile.name.split(".").pop();
      const fileName = `${selectedMovieId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("movie-posters")
        .upload(filePath, posterFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("movie-posters")
        .getPublicUrl(filePath);

      // Update movie poster_url
      const { error: updateError } = await supabase
        .from("movies")
        .update({ poster_url: publicUrl })
        .eq("id", selectedMovieId);

      if (updateError) throw updateError;

      toast({
        title: "Success!",
        description: "Movie poster updated successfully",
      });

      // Reset form
      setPosterFile(null);
      setPreviewUrl("");
      setSelectedMovieId("");
      
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = async () => {
    if (!selectedMovieId || !posterUrl) {
      toast({
        title: "Missing information",
        description: "Please select a movie and enter a poster URL",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const { error } = await supabase
        .from('movies')
        .update({ poster_url: posterUrl })
        .eq('id', selectedMovieId);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Movie poster URL updated successfully",
      });

      setPosterUrl("");
      setSelectedMovieId("");
      setPreviewUrl("");
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>You need admin privileges to access this page.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Manage Movie Posters</CardTitle>
            <CardDescription>
              Upload custom posters or enter poster URLs directly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="movie-select">Select Movie</Label>
              <Select value={selectedMovieId} onValueChange={setSelectedMovieId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a movie" />
                </SelectTrigger>
                <SelectContent>
                  {movies?.map((movie) => (
                    <SelectItem key={movie.id} value={movie.id}>
                      {movie.title} ({movie.year})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Edit Mode</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={editMode === "upload" ? "default" : "outline"}
                  onClick={() => setEditMode("upload")}
                  className="flex-1"
                >
                  Upload File
                </Button>
                <Button
                  type="button"
                  variant={editMode === "url" ? "default" : "outline"}
                  onClick={() => setEditMode("url")}
                  className="flex-1"
                >
                  Enter URL
                </Button>
              </div>
            </div>

            {editMode === "upload" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="poster-upload">Poster Image</Label>
                  <Input
                    id="poster-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={!selectedMovieId || uploading}
                  />
                </div>

                {previewUrl && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="relative w-48 h-72 rounded-lg overflow-hidden border-2 border-border">
                      <img
                        src={previewUrl}
                        alt="Poster preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleUpload}
                  disabled={!posterFile || uploading || !selectedMovieId}
                  className="w-full"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Poster
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="poster-url">Poster URL</Label>
                  <Input
                    id="poster-url"
                    type="url"
                    placeholder="https://example.com/poster.jpg"
                    value={posterUrl}
                    onChange={(e) => {
                      setPosterUrl(e.target.value);
                      if (e.target.value) {
                        setPreviewUrl(e.target.value);
                      }
                    }}
                    disabled={!selectedMovieId || uploading}
                  />
                </div>

                {posterUrl && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="relative w-48 h-72 rounded-lg overflow-hidden border-2 border-border">
                      <img
                        src={previewUrl}
                        alt="Poster preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x450?text=Invalid+URL";
                        }}
                      />
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleUrlSubmit}
                  disabled={!posterUrl || uploading || !selectedMovieId}
                  className="w-full"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Poster URL"
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
