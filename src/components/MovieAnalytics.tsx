import { useMovieRatings } from "@/hooks/useMovieAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { TrendingUp, Star } from "lucide-react";

interface MovieAnalyticsProps {
  movieId: string;
}

const MovieAnalytics = ({ movieId }: MovieAnalyticsProps) => {
  const { data: ratingsData, isLoading } = useMovieRatings(movieId);

  if (isLoading) {
    return <div className="text-muted-foreground">Loading analytics...</div>;
  }

  if (!ratingsData || ratingsData.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-4">
        No ratings yet. Be the first to rate this movie!
      </div>
    );
  }

  // Calculate rating distribution
  const distribution = Array.from({ length: 10 }, (_, i) => ({
    rating: i + 1,
    count: ratingsData.filter((r: any) => r.rating === i + 1).length,
  }));

  // Calculate rating trend over time
  const sortedRatings = [...ratingsData].sort(
    (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  
  const trendData = sortedRatings.map((r: any, idx: number) => {
    const slice = sortedRatings.slice(0, idx + 1);
    const avg = slice.reduce((sum: number, rating: any) => sum + rating.rating, 0) / slice.length;
    return {
      index: idx + 1,
      average: Number(avg.toFixed(2)),
    };
  });

  const avgRating = (
    ratingsData.reduce((sum: number, r: any) => sum + r.rating, 0) / ratingsData.length
  ).toFixed(1);

  const chartConfig = {
    count: {
      label: "Ratings",
      color: "hsl(var(--primary))",
    },
    average: {
      label: "Average",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating}/10</div>
            <p className="text-xs text-muted-foreground">
              Based on {ratingsData.length} rating{ratingsData.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trendData.length > 1
                ? trendData[trendData.length - 1].average > trendData[0].average
                  ? "↑"
                  : "↓"
                : "—"}
            </div>
            <p className="text-xs text-muted-foreground">
              {trendData.length > 1 ? "Rating evolution" : "Not enough data"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distribution}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="rating"
                  className="text-xs"
                  label={{ value: "Rating", position: "insideBottom", offset: -5 }}
                />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Rating Trend Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="index"
                  className="text-xs"
                  label={{ value: "Rating Number", position: "insideBottom", offset: -5 }}
                />
                <YAxis domain={[0, 10]} className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="average"
                  stroke="var(--color-average)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-average)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default MovieAnalytics;
