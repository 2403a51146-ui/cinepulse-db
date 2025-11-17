import { useMovies } from "@/hooks/useMovies";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { Film, Star, TrendingUp, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";

const Analytics = () => {
  const { data: movies = [], isLoading: moviesLoading } = useMovies();

  const { data: ratingsData } = useQuery({
    queryKey: ["all-ratings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ratings")
        .select("rating, created_at");
      if (error) throw error;
      return data;
    },
  });

  const { data: userRatingsData } = useQuery({
    queryKey: ["all-user-ratings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ratings")
        .select("rating");
      if (error) throw error;
      return data;
    },
  });

  const { data: usersCount } = useQuery({
    queryKey: ["users-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  if (moviesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-muted-foreground">Loading analytics...</div>
      </div>
    );
  }

  // Calculate statistics
  const totalMovies = movies.length;
  const totalRatings = ratingsData?.length || 0;
  const averageRating = movies.length > 0
    ? (movies.reduce((sum, m) => sum + (Number(m.rating) || 0), 0) / movies.length).toFixed(1)
    : "0";

  // Genre distribution
  const genreCount: Record<string, number> = {};
  movies.forEach((movie) => {
    movie.genre?.forEach((g) => {
      genreCount[g] = (genreCount[g] || 0) + 1;
    });
  });
  const genreData = Object.entries(genreCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // Rating distribution (combined original + user ratings)
  const ratingDistribution = Array.from({ length: 10 }, (_, i) => {
    const rating = i + 1;
    let estimatedOriginalCount = 0;
    
    // Estimate original ratings distribution from dataset
    movies.forEach((m) => {
      const originalRating = Number(m.original_rating) || 0;
      const originalCount = Number(m.original_num_ratings) || 0;
      
      if (originalCount > 0) {
        const distance = Math.abs(rating - originalRating);
        const estimated = Math.round(
          originalCount * Math.exp(-Math.pow(distance, 2) / 4) / 2.5
        );
        estimatedOriginalCount += estimated;
      }
    });
    
    // Add actual user ratings
    const userCount = (userRatingsData || []).filter((r: any) => r.rating === rating).length;
    
    return {
      rating: `${rating}`,
      count: estimatedOriginalCount + userCount,
    };
  });

  // Year distribution
  const yearCount: Record<number, number> = {};
  movies.forEach((movie) => {
    yearCount[movie.year] = (yearCount[movie.year] || 0) + 1;
  });
  const yearData = Object.entries(yearCount)
    .map(([year, count]) => ({ year: Number(year), count }))
    .sort((a, b) => a.year - b.year);

  // Top rated movies
  const topRatedMovies = [...movies]
    .filter((m) => m.num_ratings > 0)
    .sort((a, b) => Number(b.rating) - Number(a.rating))
    .slice(0, 5);

  const COLORS = [
    "hsl(var(--primary))",
    "hsl(var(--secondary))",
    "hsl(var(--accent))",
    "hsl(var(--muted))",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
  ];

  const chartConfig = {
    count: { label: "Count", color: "hsl(var(--primary))" },
    value: { label: "Movies", color: "hsl(var(--primary))" },
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Movies</CardTitle>
            <Film className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMovies}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating}/10</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ratings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRatings}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Genre Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Genre Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genreData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {genreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Rating Distribution</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Combined original and user ratings</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ratingDistribution}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="rating" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Movies by Year */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Movies by Release Year</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="year" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="var(--color-count)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-count)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Rated Movies */}
      <Card>
        <CardHeader>
          <CardTitle>Top Rated Movies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topRatedMovies.map((movie, index) => (
              <div
                key={movie.id}
                className="flex items-center justify-between border-b border-border pb-3 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-muted-foreground">#{index + 1}</div>
                  <div>
                    <div className="font-semibold text-foreground">{movie.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {movie.year} • {movie.genre?.join(", ")}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-lg font-bold">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    {Number(movie.rating).toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {movie.num_ratings} rating{movie.num_ratings !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default Analytics;
