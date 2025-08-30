import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AnalyticsMetric {
  id: string;
  blog_id: string;
  metric_type: 'views' | 'likes' | 'comments' | 'shares';
  value: number;
  date: string;
  created_at: string;
}

export interface BlogAnalytics {
  blog_id: string;
  title: string;
  total_views: number;
  total_likes: number;
  total_comments: number;
  total_shares: number;
  daily_views: number[];
  daily_likes: number[];
  engagement_rate: number;
  author: string;
  published_date: string;
}

export interface PlatformAnalytics {
  total_blogs: number;
  total_users: number;
  total_views: number;
  total_likes: number;
  total_comments: number;
  monthly_active_users: number;
  top_performing_blogs: BlogAnalytics[];
  user_engagement_trend: { date: string; users: number; posts: number }[];
  popular_tags: { tag: string; count: number }[];
}

export const useAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [platformAnalytics, setPlatformAnalytics] = useState<PlatformAnalytics | null>(null);
  const [blogAnalytics, setBlogAnalytics] = useState<BlogAnalytics[]>([]);
  const { toast } = useToast();

  // Generate mock analytics data for demo purposes
  const generateMockData = (): PlatformAnalytics => {
    const lastWeek = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return {
      total_blogs: 347,
      total_users: 1248,
      total_views: 45673,
      total_likes: 3892,
      total_comments: 1156,
      monthly_active_users: 892,
      top_performing_blogs: [
        {
          blog_id: 'blog-1',
          title: 'Getting Started with React and TypeScript',
          total_views: 2847,
          total_likes: 184,
          total_comments: 43,
          total_shares: 67,
          daily_views: [245, 189, 334, 298, 412, 378, 291],
          daily_likes: [12, 8, 15, 11, 18, 14, 9],
          engagement_rate: 8.2,
          author: 'Sarah Johnson',
          published_date: '2024-01-15'
        },
        {
          blog_id: 'blog-2',
          title: 'Building APIs with Node.js and Express',
          total_views: 2134,
          total_likes: 156,
          total_comments: 38,
          total_shares: 45,
          daily_views: [198, 167, 287, 245, 298, 312, 267],
          daily_likes: [9, 7, 13, 10, 14, 12, 8],
          engagement_rate: 7.8,
          author: 'Mike Chen',
          published_date: '2024-01-18'
        },
        {
          blog_id: 'blog-3',
          title: 'Database Design Patterns',
          total_views: 1876,
          total_likes: 134,
          total_comments: 29,
          total_shares: 38,
          daily_views: [178, 145, 234, 198, 267, 245, 189],
          daily_likes: [8, 6, 11, 9, 12, 10, 7],
          engagement_rate: 7.2,
          author: 'Alex Rodriguez',
          published_date: '2024-01-20'
        },
        {
          blog_id: 'blog-4',
          title: 'Modern CSS Techniques',
          total_views: 1654,
          total_likes: 112,
          total_comments: 25,
          total_shares: 31,
          daily_views: [156, 134, 198, 176, 234, 212, 167],
          daily_likes: [7, 5, 9, 8, 11, 9, 6],
          engagement_rate: 6.8,
          author: 'Emily Zhang',
          published_date: '2024-01-22'
        },
        {
          blog_id: 'blog-5',
          title: 'JavaScript Performance Optimization',
          total_views: 1523,
          total_likes: 98,
          total_comments: 22,
          total_shares: 28,
          daily_views: [145, 123, 187, 156, 212, 198, 156],
          daily_likes: [6, 4, 8, 7, 10, 8, 5],
          engagement_rate: 6.4,
          author: 'David Kumar',
          published_date: '2024-01-25'
        }
      ],
      user_engagement_trend: lastWeek.map((date, index) => ({
        date,
        users: 120 + Math.floor(Math.random() * 40) + index * 5,
        posts: 15 + Math.floor(Math.random() * 10) + index * 2
      })),
      popular_tags: [
        { tag: 'React', count: 89 },
        { tag: 'JavaScript', count: 76 },
        { tag: 'TypeScript', count: 64 },
        { tag: 'Node.js', count: 58 },
        { tag: 'CSS', count: 52 },
        { tag: 'Python', count: 47 },
        { tag: 'Backend', count: 43 },
        { tag: 'Frontend', count: 41 },
        { tag: 'Database', count: 38 },
        { tag: 'API', count: 35 }
      ]
    };
  };

  const fetchPlatformAnalytics = async () => {
    try {
      setLoading(true);

      const { data: blogs, error: blogsError } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'approved');

      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('*');

      if (blogsError || usersError) {
        throw new Error('Failed to fetch analytics data');
      }

      const total_blogs = blogs.length;
      const total_users = users.length;
      const total_views = blogs.reduce((acc, blog) => acc + blog.views_count, 0);
      const total_likes = blogs.reduce((acc, blog) => acc + blog.likes_count, 0);

      const platformAnalytics: PlatformAnalytics = {
        total_blogs,
        total_users,
        total_views,
        total_likes,
        total_comments: 0, // Not implemented
        monthly_active_users: 0, // Not implemented
        top_performing_blogs: [], // Not implemented
        user_engagement_trend: [], // Not implemented
        popular_tags: [], // Not implemented
      };

      setPlatformAnalytics(platformAnalytics);

    } catch (error: any) {
      toast({
        title: "Error loading analytics",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const trackMetric = async (blogId: string, metricType: 'views' | 'likes' | 'comments' | 'shares') => {
    try {
      // For demo purposes, just update local state
      // Real implementation would insert into analytics table
      
      /* Real Supabase implementation:
      const { error } = await supabase
        .from('analytics')
        .insert([{
          blog_id: blogId,
          metric_type: metricType,
          value: 1,
          date: new Date().toISOString().split('T')[0]
        }]);

      if (error) throw error;
      */

    } catch (error: any) {
      console.error('Failed to track metric:', error);
    }
  };

  const getBlogAnalytics = (blogId: string): BlogAnalytics | null => {
    return blogAnalytics.find(blog => blog.blog_id === blogId) || null;
  };

  const getTopPerformingBlogs = (limit = 5): BlogAnalytics[] => {
    return blogAnalytics
      .sort((a, b) => b.total_views - a.total_views)
      .slice(0, limit);
  };

  const getTrendingBlogs = (limit = 5): BlogAnalytics[] => {
    return blogAnalytics
      .sort((a, b) => b.engagement_rate - a.engagement_rate)
      .slice(0, limit);
  };

  const getEngagementRate = (views: number, likes: number, comments: number): number => {
    if (views === 0) return 0;
    return ((likes + comments) / views) * 100;
  };

  useEffect(() => {
    fetchPlatformAnalytics();
  }, []);

  return {
    platformAnalytics,
    blogAnalytics,
    loading,
    trackMetric,
    getBlogAnalytics,
    getTopPerformingBlogs,
    getTrendingBlogs,
    getEngagementRate,
    refreshAnalytics: fetchPlatformAnalytics
  };
};

export const useBlogAnalytics = (blogId: string) => {
  const [analytics, setAnalytics] = useState<BlogAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBlogAnalytics = async () => {
    try {
      setLoading(true);
      
      // Mock data for specific blog
      const mockBlogAnalytics: BlogAnalytics = {
        blog_id: blogId,
        title: 'Sample Blog Post',
        total_views: 1247,
        total_likes: 89,
        total_comments: 23,
        total_shares: 15,
        daily_views: Array.from({ length: 7 }, () => Math.floor(Math.random() * 200) + 50),
        daily_likes: Array.from({ length: 7 }, () => Math.floor(Math.random() * 20) + 5),
        engagement_rate: 7.8,
        author: 'Sample Author',
        published_date: new Date().toISOString().split('T')[0]
      };
      
      setAnalytics(mockBlogAnalytics);

    } catch (error: any) {
      toast({
        title: "Error loading blog analytics",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (blogId) {
      fetchBlogAnalytics();
    }
  }, [blogId]);

  return {
    analytics,
    loading,
    refreshAnalytics: fetchBlogAnalytics
  };
};
