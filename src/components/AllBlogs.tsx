import { useAllBlogs } from "@/hooks/useBlogs";
import { useAdminBlogs } from "@/hooks/useBlogs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Trash2 } from "lucide-react";

const AllBlogs = () => {
  const { allBlogs, loading } = useAllBlogs();
  const { deleteBlog } = useAdminBlogs();

  return (
    <div>
      {loading ? (
        <div className="text-center py-8">Loading all articles...</div>
      ) : allBlogs.length > 0 ? (
        <div className="space-y-4">
          {allBlogs.map((blog) => (
            <Card key={blog.id} className="bg-gradient-card backdrop-blur-sm border-border/60">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{blog.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {blog.excerpt || blog.content.substring(0, 150) + '...'}
                    </CardDescription>
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
                  <Badge variant="secondary">
                    <Clock className="h-3 w-3 mr-1" />
                    {blog.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex space-x-2">
                  <Button 
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteBlog(blog.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No articles found.
        </div>
      )}
    </div>
  );
};

export default AllBlogs;
