import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Comment } from '@/components/CommentItem';

export const useComments = (blogId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentCount, setCommentCount] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id (
            display_name,
            avatar_url
          ),
          replies:comments!parent_id (
            *,
            profiles:user_id (
              display_name,
              avatar_url
            )
          )
        `)
        .eq('blog_id', blogId)
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const list: Comment[] = (data as any[]).map((c) => ({
        ...c,
        likes_count: c.likes_count || 0,
        is_liked: false,
      }));

      setComments(list);
      setCommentCount(list.length + list.reduce((acc, c) => acc + (c.replies?.length || 0), 0));
    } catch (error: any) {
      toast({
        title: 'Error loading comments',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string, parentId?: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to post a comment.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('comments')
        .insert([
          {
            blog_id: blogId,
            user_id: user.id,
            content,
            parent_id: parentId || null,
          },
        ]);

      if (error) throw error;

      await fetchComments();

      toast({ title: 'Comment posted', description: 'Your comment has been added successfully.' });
    } catch (error: any) {
      toast({ title: 'Failed to post comment', description: error.message, variant: 'destructive' });
    }
  };

  const updateComment = async (commentId: string, content: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', commentId)
        .eq('user_id', user?.id);
      if (error) throw error;

      await fetchComments();
      toast({ title: 'Comment updated', description: 'Your comment has been updated successfully.' });
    } catch (error: any) {
      toast({ title: 'Failed to update comment', description: error.message, variant: 'destructive' });
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user?.id);
      if (error) throw error;

      await fetchComments();
      toast({ title: 'Comment deleted', description: 'Your comment has been deleted successfully.' });
    } catch (error: any) {
      toast({ title: 'Failed to delete comment', description: error.message, variant: 'destructive' });
    }
  };

  const likeComment = async (commentId: string) => {
    if (!user) {
      toast({ title: 'Authentication required', description: 'Please sign in to like comments.', variant: 'destructive' });
      return;
    }

    try {
      // No persistence layer for comment likes in schema; optimistic UI only
      setComments((prev) =>
        prev.map((c) => {
          if (c.id === commentId) {
            const liked = c.is_liked;
            return { ...c, is_liked: !liked, likes_count: (c.likes_count || 0) + (liked ? -1 : 1) };
          }
          if (c.replies) {
            return {
              ...c,
              replies: c.replies.map((r) =>
                r.id === commentId
                  ? { ...r, is_liked: !r.is_liked, likes_count: (r.likes_count || 0) + (r.is_liked ? -1 : 1) }
                  : r
              ),
            };
          }
          return c;
        })
      );
    } catch (error: any) {
      toast({ title: 'Failed to update like', description: error.message, variant: 'destructive' });
    }
  };

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  return { comments, loading, commentCount, fetchComments, addComment, updateComment, deleteComment, likeComment };
};

const calculateTotalComments = (comments: Comment[]): number => {
  return comments.reduce((total, comment) => {
    return total + 1 + (comment.replies?.length || 0);
    }, 0);
};
