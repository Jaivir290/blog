import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  tags?: string[];
  likes_count: number;
  views_count: number;
  featured_image_url?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    display_name: string;
    avatar_url?: string;
  };
}

export const useBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [trendingBlogs, setTrendingBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const { user, profile } = useAuth();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select(`
          *,
          profiles:author_id (
            display_name,
            avatar_url
          )
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // If no approved blogs exist, show sample blogs for demo
      if (!data || data.length === 0) {
        const sampleBlogs: Blog[] = [
          {
            id: 'sample-1',
            title: 'Getting Started with React and TypeScript',
            content: 'This is a comprehensive guide to building modern web applications with React and TypeScript. Learn about component patterns, state management, and best practices.',
            excerpt: 'Learn how to build scalable React applications using TypeScript with modern development practices.',
            author_id: 'sample-user',
            status: 'approved',
            tags: ['React', 'TypeScript', 'Frontend'],
            likes_count: 42,
            views_count: 150,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            updated_at: new Date(Date.now() - 86400000).toISOString(),
            profiles: {
              display_name: 'Sample Developer',
              avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sample'
            }
          },
          {
            id: 'sample-2',
            title: 'Building APIs with Node.js and Express',
            content: 'A complete tutorial on creating RESTful APIs using Node.js, Express, and best practices for backend development.',
            excerpt: 'Master backend development with this comprehensive Node.js and Express tutorial.',
            author_id: 'sample-user-2',
            status: 'approved',
            tags: ['Node.js', 'Express', 'Backend', 'API'],
            likes_count: 38,
            views_count: 200,
            created_at: new Date(Date.now() - 172800000).toISOString(),
            updated_at: new Date(Date.now() - 172800000).toISOString(),
            profiles: {
              display_name: 'Backend Expert',
              avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=backend'
            }
          },
          {
            id: 'sample-3',
            title: 'Database Design Patterns and Best Practices',
            content: 'Explore modern database design patterns, normalization techniques, and performance optimization strategies.',
            excerpt: 'Learn essential database design patterns for building scalable applications.',
            author_id: 'sample-user-3',
            status: 'approved',
            tags: ['Database', 'SQL', 'Design Patterns'],
            likes_count: 55,
            views_count: 320,
            created_at: new Date(Date.now() - 259200000).toISOString(),
            updated_at: new Date(Date.now() - 259200000).toISOString(),
            profiles: {
              display_name: 'DB Architect',
              avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=database'
            }
          }
        ];
        setAllBlogs(sampleBlogs);
        setBlogs(sampleBlogs);
      } else {
        const blogData = (data as Blog[]) || [];
        setAllBlogs(blogData);
        setBlogs(blogData);
      }
    } catch (error: any) {
      // If there's an error, show sample blogs as fallback
      const sampleBlogs: Blog[] = [
        {
          id: 'sample-1',
          title: 'Getting Started with React and TypeScript',
          content: 'This is a comprehensive guide to building modern web applications with React and TypeScript.',
          excerpt: 'Learn how to build scalable React applications using TypeScript.',
          author_id: 'sample-user',
          status: 'approved',
          tags: ['React', 'TypeScript', 'Frontend'],
          likes_count: 42,
          views_count: 150,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString(),
          profiles: {
            display_name: 'Sample Developer',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sample'
          }
        }
      ];
      setBlogs(sampleBlogs);

      toast({
        title: "Showing sample content",
        description: "Connect to database to see real blogs",
        variant: "default"
      });
    } finally {
      setLoading(false);
    }
  };

  const searchBlogs = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setBlogs(allBlogs);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filteredBlogs = allBlogs.filter(blog =>
      blog.title.toLowerCase().includes(searchTerm) ||
      blog.excerpt?.toLowerCase().includes(searchTerm) ||
      blog.content.toLowerCase().includes(searchTerm) ||
      blog.profiles?.display_name?.toLowerCase().includes(searchTerm) ||
      blog.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );

    setBlogs(filteredBlogs);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setBlogs(allBlogs);
  };

  const createBlog = async (blogData: {
    title: string;
    content: string;
    excerpt?: string;
    tags?: string[];
  }) => {
    try {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('blogs')
        .insert([{
          ...blogData,
          author_id: user.id,
          status: 'pending' // Require admin approval
        }])
        .select()
        .single();

      if (error) throw error;

      if (profile?.role === 'admin') {
        await supabase.from('notifications').insert([{
          message: `A new blog has been posted by ${profile.display_name}`,
        }]);
      }

      toast({
        title: "Blog Submitted!",
        description: "Your blog has been submitted for review and will be published after admin approval.",
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Failed to submit blog",
        description: error.message,
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const likeBlog = async (blogId: string) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      // Check if already liked
      const { data: existingLike } = await supabase
        .from('blog_likes')
        .select('id')
        .eq('blog_id', blogId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('blog_likes')
          .delete()
          .eq('blog_id', blogId)
          .eq('user_id', user.id);
      } else {
        // Like
        await supabase
          .from('blog_likes')
          .insert({ blog_id: blogId, user_id: user.id });
      }

      // Refresh blogs
      fetchBlogs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchTrendingBlogs();
  }, []);

  const fetchTrendingBlogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select(`
          *,
          profiles:author_id (
            display_name,
            avatar_url
          )
        `)
        .eq('status', 'approved')
        .order('likes_count', { ascending: false })
        .limit(5);

      if (error) throw error;

      setTrendingBlogs((data as Blog[]) || []);
    } catch (error: any) {
      toast({
        title: "Error loading trending blogs",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    blogs,
    allBlogs,
    trendingBlogs,
    loading,
    searchQuery,
    fetchBlogs,
    createBlog,
    likeBlog,
    searchBlogs,
    clearSearch
  };
};

export const useUserBlogs = () => {
  const [userBlogs, setUserBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserBlogs = async () => {
    try {
      setLoading(true);
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const { data, error } = await supabase
        .from('blogs')
        .select(`
          *,
          profiles:author_id (
            display_name,
            avatar_url
          )
        `)
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserBlogs((data as Blog[]) || []);
    } catch (error: any) {
      toast({
        title: "Error loading your blogs",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBlogs();
  }, []);

  return {
    userBlogs,
    loading,
    fetchUserBlogs
  };
};

export const useAdminBlogs = () => {
  const [pendingBlogs, setPendingBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPendingBlogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select(`
          *,
          profiles:author_id (
            display_name,
            avatar_url
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingBlogs((data as Blog[]) || []);
    } catch (error: any) {
      toast({
        title: "Error loading pending blogs",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBlogStatus = async (blogId: string, status: 'approved' | 'rejected' | 'hidden') => {
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ status })
        .eq('id', blogId);

      if (error) throw error;
      
      toast({
        title: "Blog Updated",
        description: `Blog has been ${status}.`,
      });
      
      fetchPendingBlogs();
    } catch (error: any) {
      toast({
        title: "Error updating blog",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteBlog = async (blogId: string) => {
    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', blogId);

      if (error) throw error;

      toast({
        title: "Blog Deleted",
        description: "The blog has been successfully deleted.",
      });

      fetchPendingBlogs();
    } catch (error: any) {
      toast({
        title: "Error deleting blog",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchPendingBlogs();
  }, []);

  return {
    pendingBlogs,
    loading,
    fetchPendingBlogs,
    updateBlogStatus,
    deleteBlog
  };
};

export const useAllBlogs = () => {
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAllBlogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select(`
          *,
          profiles:author_id (
            display_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAllBlogs((data as Blog[]) || []);
    } catch (error: any) {
      toast({
        title: "Error loading all blogs",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  return {
    allBlogs,
    loading,
    fetchAllBlogs
  };
};
