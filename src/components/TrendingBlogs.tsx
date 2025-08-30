import { useBlogs } from "@/hooks/useBlogs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Flame } from "lucide-react";

const TrendingBlogs = () => {
  const { trendingBlogs, loading } = useBlogs();

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
        <Flame className="h-6 w-6 mr-2 text-primary" />
        Trending Blogs
      </h2>
      {loading ? (
        <div className="text-center py-8">Loading trending blogs...</div>
      ) : trendingBlogs.length > 0 ? (
        <div className="space-y-4">
          {trendingBlogs.map((blog) => (
            <Card key={blog.id} className="bg-gradient-card backdrop-blur-sm border-border/60">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{blog.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={blog.profiles?.avatar_url} alt={blog.profiles?.display_name} />
                          <AvatarFallback>{blog.profiles?.display_name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {blog.profiles?.display_name}
                      </div>
                      <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No trending blogs found.
        </div>
      )}
    </div>
  );
};

export default TrendingBlogs;
