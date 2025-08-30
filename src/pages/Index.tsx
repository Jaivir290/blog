import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BlogCard from "@/components/BlogCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Clock, Star } from "lucide-react";
import { useBlogs } from "@/hooks/useBlogs";
import { useState } from "react";
import { extractFirstImageUrl } from "@/lib/utils";

const Index = () => {
  const { blogs, trendingBlogs, loading, likeBlog, searchBlogs, clearSearch, searchQuery } = useBlogs();
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (query: string) => {
    setIsSearching(true);
    searchBlogs(query);
    setTimeout(() => setIsSearching(false), 300);
  };

  const handleClearSearch = () => {
    setIsSearching(true);
    clearSearch();
    setTimeout(() => setIsSearching(false), 300);
  };

  const getCardImage = (b: any) => b.featured_image_url || extractFirstImageUrl(b.content) || "/placeholder.svg";

  return (
    <div className="min-h-screen bg-background">
      <Header
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        searchQuery={searchQuery}
      />
      <HeroSection />
      
      <div id="articles-section" className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Latest Articles'}
            </h2>
            <p className="text-muted-foreground mt-2">
              {searchQuery
                ? `Found ${blogs.length} article${blogs.length !== 1 ? 's' : ''} matching your search`
                : 'Discover the latest insights from our developer community'
              }
            </p>
          </div>
        </div>

        <Tabs defaultValue="latest" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="latest" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Latest
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="featured" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Featured
            </TabsTrigger>
          </TabsList>

          <TabsContent value="latest" className="space-y-6">
            {loading || isSearching ? (
              <div className="text-center py-8">
                {isSearching ? 'Searching...' : 'Loading blogs...'}
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>{searchQuery ? 'No articles found matching your search.' : 'No articles yet.'}</p>
                {searchQuery && <p className="mt-2">Try different keywords or check your spelling.</p>}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {blogs.slice(0, 6).map((blog) => (
                  <BlogCard
                    key={blog.id}
                    blog={{
                      id: blog.id,
                      title: blog.title,
                      excerpt: blog.excerpt || '',
                      author: blog.profiles?.display_name || 'Anonymous',
                      date: new Date(blog.created_at).toLocaleDateString(),
                      readTime: '5 min read',
                      likes: blog.likes_count,
                      image: getCardImage(blog),
                      featured: false,
                      tags: blog.tags || [],
                      liked: !!blog.is_liked
                    }}
                    onLike={() => likeBlog(blog.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="trending" className="space-y-6">
            {loading || isSearching ? (
              <div className="text-center py-8">
                {isSearching ? 'Searching...' : 'Loading blogs...'}
              </div>
            ) : trendingBlogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No trending articles found.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {trendingBlogs.map((blog) => (
                    <BlogCard 
                      key={blog.id} 
                      blog={{
                        id: blog.id,
                        title: blog.title,
                        excerpt: blog.excerpt || '',
                        author: blog.profiles?.display_name || 'Anonymous',
                        date: new Date(blog.created_at).toLocaleDateString(),
                        readTime: '5 min read',
                        likes: blog.likes_count,
                        image: getCardImage(blog),
                        featured: false,
                        tags: blog.tags || [],
                        liked: !!blog.is_liked
                      }}
                      onLike={() => likeBlog(blog.id)}
                    />
                  ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="featured" className="space-y-6">
            {loading || isSearching ? (
              <div className="text-center py-8">
                {isSearching ? 'Searching...' : 'Loading blogs...'}
              </div>
            ) : (() => {
              const featured = blogs.filter((b) => (b.views_count || 0) >= 150 || (b.likes_count || 0) >= 40);
              if (featured.length === 0) {
                return (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No featured articles yet.</p>
                  </div>
                );
              }
              return (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {featured.slice(0, 6).map((blog) => (
                    <BlogCard
                      key={blog.id}
                      blog={{
                        id: blog.id,
                        title: blog.title,
                        excerpt: blog.excerpt || '',
                        author: blog.profiles?.display_name || 'Anonymous',
                        date: new Date(blog.created_at).toLocaleDateString(),
                        readTime: '5 min read',
                        likes: blog.likes_count,
                        image: getCardImage(blog),
                        featured: true,
                        tags: blog.tags || [],
                        liked: !!blog.is_liked
                      }}
                      onLike={() => likeBlog(blog.id)}
                    />
                  ))}
                </div>
              );
            })()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
