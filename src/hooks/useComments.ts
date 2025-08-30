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

      const base = (data as any[]) || [];

      // Build a list of all comment IDs (including replies)
      const topIds = base.map((c) => c.id);
      const replyIds = base.flatMap((c) => (c.replies || []).map((r: any) => r.id));
      const allIds: string[] = [...new Set([...topIds, ...replyIds])];

      // Default maps when there are no comments
      let likeCounts = new Map<string, number>();
      let likedByUser = new Set<string>();

      if (allIds.length > 0) {
        const { data: likeRows, error: likeErr } = await (supabase as any)
          .from('comment_likes')
          .select('comment_id, user_id')
          .in('comment_id', allIds);
        if (likeErr) throw likeErr;

        likeCounts = new Map<string, number>();
        for (const row of likeRows || []) {
          likeCounts.set(row.comment_id, (likeCounts.get(row.comment_id) || 0) + 1);
        }

        const currentUser = user;
        if (currentUser) {
          likedByUser = new Set(
            (likeRows || [])
              .filter((r) => r.user_id === currentUser.id)
              .map((r) => r.comment_id)
          );
        }
      }

      const withLikes: Comment[] = base.map((c: any) => ({
        ...c,
        likes_count: likeCounts.get(c.id) || 0,
        is_liked: likedByUser.has(c.id),
        replies: (c.replies || []).map((r: any) => ({
          ...r,
          likes_count: likeCounts.get(r.id) || 0,
          is_liked: likedByUser.has(r.id),
        })),
      }));

      setComments(withLikes);
      setCommentCount(
        withLikes.length + withLikes.reduce((acc, c) => acc + (c.replies?.length || 0), 0)
      );
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

    // Determine current like state
    const findLikeState = () => {
      for (const c of comments) {
        if (c.id === commentId) return !!c.is_liked;
        for (const r of c.replies || []) {
          if (r.id === commentId) return !!r.is_liked;
        }
      }
      return false;
    };

    const currentlyLiked = findLikeState();
    const delta = currentlyLiked ? -1 : 1;

    // Optimistic UI update
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          return { ...c, is_liked: !currentlyLiked, likes_count: (c.likes_count || 0) + delta };
        }
        if (c.replies) {
          return {
            ...c,
            replies: c.replies.map((r) =>
              r.id === commentId
                ? { ...r, is_liked: !currentlyLiked, likes_count: (r.likes_count || 0) + delta }
                : r
            ),
          };
        }
        return c;
      })
    );

    try {
      if (currentlyLiked) {
        const { error } = await (supabase as any)
          .from('comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any)
          .from('comment_likes')
          .insert({ comment_id: commentId, user_id: user.id });
        if (error) throw error;
      }
    } catch (error: any) {
      // Revert on error
      setComments((prev) =>
        prev.map((c) => {
          if (c.id === commentId) {
            return { ...c, is_liked: currentlyLiked, likes_count: (c.likes_count || 0) - delta };
          }
          if (c.replies) {
            return {
              ...c,
              replies: c.replies.map((r) =>
                r.id === commentId
                  ? { ...r, is_liked: currentlyLiked, likes_count: (r.likes_count || 0) - delta }
                  : r
              ),
            };
          }
          return c;
        })
      );
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
