import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import CommentList from "@/components/CommentList";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Bookmark, 
  Eye, 
  Calendar, 
  Clock,
  User,
  Tag
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useBlogs } from "@/hooks/useBlogs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const BlogPost = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { allBlogs, likeBlog, loading: blogsLoading } = useBlogs();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (!blogId) {
      navigate('/');
      return;
    }

    // Find blog from the existing blogs or create a sample one
    const foundBlog = allBlogs.find(b => b.id === blogId);
    
    if (foundBlog) {
      setBlog(foundBlog);
      setIsLiked(!!foundBlog.is_liked);
    } else if (!blogsLoading) {
      setBlog(null);
      /* sample removed
      setBlog({
        id: blogId,
        title: 'Understanding Modern Web Development: A Comprehensive Guide',
        content: `# Introduction

Modern web development has evolved tremendously over the past few years. With the rise of new frameworks, tools, and methodologies, developers now have more options than ever to build robust, scalable applications.

## The Current Landscape

Today's web development ecosystem is characterized by:

### Frontend Technologies
- **React**: A powerful library for building user interfaces
- **Vue.js**: A progressive framework for building UIs
- **Angular**: A platform for building mobile and desktop web applications
- **Svelte**: A compile-time framework that generates vanilla JavaScript

### Backend Technologies
- **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine
- **Python**: With frameworks like Django and Flask
- **Go**: Google's programming language designed for modern computing
- **Rust**: A systems programming language focused on safety and performance

## Best Practices

When developing modern web applications, consider these best practices:

1. **Performance Optimization**
   - Use code splitting and lazy loading
   - Optimize images and assets
   - Implement proper caching strategies

2. **Security**
   - Always validate user input
   - Use HTTPS everywhere
   - Implement proper authentication and authorization

3. **Accessibility**
   - Use semantic HTML
   - Provide proper ARIA labels
   - Ensure keyboard navigation works

4. **Testing**
   - Write unit tests for your components
   - Implement integration tests
   - Use end-to-end testing for critical user flows

## Conclusion

The web development landscape continues to evolve rapidly. Staying up-to-date with the latest trends and best practices is crucial for building successful applications. Remember to always prioritize user experience, security, and performance in your development process.

Whether you're just starting out or are a seasoned developer, continuous learning and adaptation are key to success in this field.`,
        excerpt: 'A comprehensive guide to understanding the modern web development landscape, including best practices, tools, and methodologies.',
        author_id: 'sample-author',
        status: 'approved',
        tags: ['Web Development', 'Frontend', 'Backend', 'Best Practices', 'Modern Tools'],
        likes_count: 42,
        views_count: 1250,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        featured_image_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=600&fit=crop',
        profiles: {
          display_name: 'Jane Smith',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
          bio: 'Senior Full-Stack Developer with 8+ years of experience building scalable web applications.'
        }
      }); */
    }

    setLoading(foundBlog ? false : blogsLoading);
  }, [blogId, allBlogs, blogsLoading, navigate]);

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like this article.",
        variant: "destructive"
      });
      return;
    }
    setIsLiked(!isLiked);
    if (blog) {
      setBlog({
        ...blog,
        likes_count: blog.likes_count + (isLiked ? -1 : 1)
      });
      await likeBlog(blog.id);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Implement bookmark functionality
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-6">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-64 w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-10/12" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6 -ml-2" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Featured Image */}
        {blog.featured_image_url && (
          <div className="aspect-video mb-8 rounded-lg overflow-hidden">
            <img
              src={blog.featured_image_url}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
            {blog.title}
          </h1>
          
          {blog.excerpt && (
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {blog.excerpt}
            </p>
          )}

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Author & Meta */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={blog.profiles?.avatar_url} alt={blog.profiles?.display_name} />
                <AvatarFallback>
                  {blog.profiles?.display_name?.charAt(0)?.toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h3 className="font-medium text-foreground">{blog.profiles?.display_name}</h3>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDistanceToNow(new Date(blog.created_at), { addSuffix: true })}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {Math.ceil(blog.content.length / 1000)} min read
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {blog.views_count.toLocaleString()} views
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLike}
                className={isLiked ? 'text-red-600' : ''}
              >
                <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                {blog.likes_count}
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleBookmark}>
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />
        </header>

        {/* Article Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none mb-12">
          <div className="whitespace-pre-wrap leading-relaxed text-foreground">
            {blog.content}
          </div>
        </div>

        {/* Author Bio */}
        {blog.profiles?.bio && (
          <Card className="mb-8 bg-gradient-card backdrop-blur-sm border-border/60">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={blog.profiles.avatar_url} alt={blog.profiles.display_name} />
                  <AvatarFallback>
                    {blog.profiles.display_name?.charAt(0)?.toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="font-semibold text-foreground mb-2">About {blog.profiles.display_name}</h3>
                  <p className="text-muted-foreground">{blog.profiles.bio}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Separator className="mb-8" />

        {/* Comments Section */}
        <CommentList blogId={blog.id} />
      </article>
    </div>
  );
};

export default BlogPost;
