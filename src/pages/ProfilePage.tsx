import { useEffect } from "react";
import Header from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Link as LinkIcon, Edit, Heart, BookOpen, Star } from "lucide-react";
import BlogCard from "@/components/BlogCard";
import { useAuth } from "@/contexts/AuthContext";
import { useUserBlogs } from "@/hooks/useBlogs";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user, profile } = useAuth();
  const { userBlogs, loading } = useUserBlogs();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="bg-gradient-card backdrop-blur-sm border-border/60 shadow-medium mb-8">
          <CardContent className="pt-8">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar_url || "/placeholder-avatar.jpg"} alt="Profile" />
                  <AvatarFallback className="text-2xl">
                    {profile.display_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-bold text-foreground">{profile.display_name}</h1>
                  <p className="text-muted-foreground">{profile.bio || "No bio provided"}</p>
                  
                  <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                    {profile.role === 'admin' && (
                      <Badge variant="secondary" className="text-xs">Admin</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2">
                    <Button size="sm" className="bg-gradient-primary hover:opacity-90 transition-opacity">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-card backdrop-blur-sm border-border/60 text-center">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-foreground">{userBlogs.length}</div>
                <div className="text-sm text-muted-foreground">Articles</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card backdrop-blur-sm border-border/60 text-center">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-foreground">
                  {userBlogs.reduce((sum, blog) => sum + blog.likes_count, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Likes</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card backdrop-blur-sm border-border/60 text-center">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-foreground">
                  {userBlogs.reduce((sum, blog) => sum + blog.views_count, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Views</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Articles Tabs */}
        <Tabs defaultValue="published" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="published" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Published
            </TabsTrigger>
            <TabsTrigger value="liked" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Liked
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Saved
            </TabsTrigger>
          </TabsList>

          <TabsContent value="published" className="space-y-6">
            {loading ? (
              <div className="text-center py-8">Loading your articles...</div>
            ) : userBlogs.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {userBlogs.map((blog) => (
                  <div key={blog.id} className="relative">
                    <BlogCard 
                      blog={{
                        id: blog.id,
                        title: blog.title,
                        excerpt: blog.excerpt || '',
                        author: profile.display_name,
                        date: new Date(blog.created_at).toLocaleDateString(),
                        readTime: '5 min read',
                        likes: blog.likes_count,
                        image: blog.featured_image_url || '/placeholder.svg',
                        featured: !!blog.featured,
                        tags: blog.tags || []
                      }}
                    />
                    <Badge 
                      variant={blog.status === 'approved' ? 'default' : blog.status === 'pending' ? 'secondary' : 'destructive'} 
                      className="absolute top-2 right-2"
                    >
                      {blog.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                You haven't published any articles yet.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="liked" className="space-y-6">
            <div className="text-center py-8 text-muted-foreground">
              Liked articles feature coming soon!
            </div>
          </TabsContent>
          
          <TabsContent value="saved" className="space-y-6">
            <div className="text-center py-8 text-muted-foreground">
              Saved articles feature coming soon!
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
