import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Clock, User, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface BlogCardProps {
  blog: {
    id: string;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    readTime: string;
    likes: number;
    image: string;
    featured?: boolean;
    tags: string[];
    liked?: boolean;
    commentsCount?: number;
  };
  onLike?: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onLike }) => {
  return (
    <Link to={`/blog/${blog.id}`} className="block">
      <Card className="group bg-gradient-card backdrop-blur-sm border-border/60 hover:shadow-medium transition-all duration-300 overflow-hidden cursor-pointer">
        {blog.image && (
          <div className="aspect-video relative overflow-hidden">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {blog.featured && (
              <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground">
                Featured
              </Badge>
            )}
          </div>
        )}
        
        <CardHeader className="space-y-3">
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {blog.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3">
            {blog.excerpt}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {blog.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs bg-primary/10 text-primary">
                {tag}
              </Badge>
            ))}
            {blog.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{blog.tags.length - 3}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {blog.author}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {blog.readTime}
              </div>
            </div>
            <span>{blog.date}</span>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className={`hover:text-destructive ${blog.liked ? 'text-destructive' : 'text-muted-foreground'}`}
              onClick={(e) => {
                e.preventDefault();
                onLike?.();
              }}
            >
              <Heart className={`h-4 w-4 mr-1 ${blog.liked ? 'fill-current' : ''}`} />
              {blog.likes}
            </Button>
            
            {typeof blog.commentsCount === 'number' && (
              <div className="flex items-center text-muted-foreground text-sm">
                <MessageCircle className="h-4 w-4 mr-1" />
                {blog.commentsCount}
              </div>
            )}
          </div>
          
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            Read More
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default BlogCard;
