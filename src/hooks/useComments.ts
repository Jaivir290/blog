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

  // Fetch comments for a specific blog
  const fetchComments = async () => {
    try {
      setLoading(true);
      
      // For demo purposes, we'll use mock data since we don't have actual Supabase tables
      const mockComments: Comment[] = [
        {
          id: 'comment-1',
          blog_id: blogId,
          user_id: 'user-1',
          content: 'Great article! This really helped me understand the concepts better. The examples were particularly useful.',
          created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          updated_at: new Date(Date.now() - 3600000).toISOString(),
          profiles: {
            display_name: 'Sarah Johnson',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
          },
          likes_count: 5,
          is_liked: false,
          replies: [
            {
              id: 'comment-2',
              blog_id: blogId,
              user_id: 'user-2',
              content: 'I agree! The step-by-step breakdown made it so much easier to follow.',
              parent_id: 'comment-1',
              created_at: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
              updated_at: new Date(Date.now() - 1800000).toISOString(),
              profiles: {
                display_name: 'Mike Chen',
                avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike'
              },
              likes_count: 2,
              is_liked: true,
            }
          ]
        },
        {
          id: 'comment-3',
          blog_id: blogId,
          user_id: 'user-3',
          content: 'Thanks for sharing this! I had been struggling with this exact issue for weeks. Your solution worked perfectly.',
          created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          updated_at: new Date(Date.now() - 7200000).toISOString(),
          profiles: {
            display_name: 'Alex Rodriguez',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex'
          },
          likes_count: 3,
          is_liked: false,
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setComments(mockComments);
      setCommentCount(mockComments.length + mockComments.reduce((acc, comment) => acc + (comment.replies?.length || 0), 0));
      
      /* Real Supabase implementation would be:
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
      
      const commentsWithLikes = await Promise.all((data || []).map(async (comment) => {
        const { count: likesCount } = await supabase
          .from('comment_likes')
          .select('*', { count: 'exact', head: true })
          .eq('comment_id', comment.id);

        const { data: userLike } = await supabase
          .from('comment_likes')
          .select('id')
          .eq('comment_id', comment.id)
          .eq('user_id', user?.id || '')
          .single();

        return {
          ...comment,
          likes_count: likesCount || 0,
          is_liked: !!userLike
        };
      }));

      setComments(commentsWithLikes);
      setCommentCount(calculateTotalComments(commentsWithLikes));
      */
      
    } catch (error: any) {
      toast({
        title: "Error loading comments",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Add a new comment
  const addComment = async (content: string, parentId?: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post a comment.",
        variant: "destructive"
      });
      return;
    }

    try {
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        blog_id: blogId,
        user_id: user.id,
        content,
        parent_id: parentId || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        profiles: {
          display_name: 'You', // This would come from user profile
          avatar_url: undefined
        },
        likes_count: 0,
        is_liked: false,
      };

      if (parentId) {
        // Add as reply
        setComments(prevComments => 
          prevComments.map(comment => 
            comment.id === parentId 
              ? { ...comment, replies: [...(comment.replies || []), newComment] }
              : comment
          )
        );
      } else {
        // Add as top-level comment
        setComments(prevComments => [newComment, ...prevComments]);
      }

      setCommentCount(prev => prev + 1);

      toast({
        title: "Comment posted",
        description: "Your comment has been added successfully.",
      });

      /* Real Supabase implementation:
      const { data, error } = await supabase
        .from('comments')
        .insert([{
          blog_id: blogId,
          user_id: user.id,
          content,
          parent_id: parentId || null
        }])
        .select(`
          *,
          profiles:user_id (
            display_name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;
      
      await fetchComments(); // Refresh comments
      */

    } catch (error: any) {
      toast({
        title: "Failed to post comment",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Update a comment
  const updateComment = async (commentId: string, content: string) => {
    try {
      setComments(prevComments => 
        prevComments.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, content, updated_at: new Date().toISOString() };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map(reply =>
                reply.id === commentId 
                  ? { ...reply, content, updated_at: new Date().toISOString() }
                  : reply
              )
            };
          }
          return comment;
        })
      );

      toast({
        title: "Comment updated",
        description: "Your comment has been updated successfully.",
      });

      /* Real Supabase implementation:
      const { error } = await supabase
        .from('comments')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', commentId)
        .eq('user_id', user?.id);

      if (error) throw error;
      */

    } catch (error: any) {
      toast({
        title: "Failed to update comment",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Delete a comment
  const deleteComment = async (commentId: string) => {
    try {
      setComments(prevComments => 
        prevComments.filter(comment => {
          if (comment.id === commentId) {
            setCommentCount(prev => prev - 1 - (comment.replies?.length || 0));
            return false;
          }
          if (comment.replies) {
            const originalReplyCount = comment.replies.length;
            comment.replies = comment.replies.filter(reply => {
              if (reply.id === commentId) {
                setCommentCount(prev => prev - 1);
                return false;
              }
              return true;
            });
          }
          return true;
        })
      );

      toast({
        title: "Comment deleted",
        description: "Your comment has been deleted successfully.",
      });

      /* Real Supabase implementation:
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user?.id);

      if (error) throw error;
      */

    } catch (error: any) {
      toast({
        title: "Failed to delete comment",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Like/unlike a comment
  const likeComment = async (commentId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like comments.",
        variant: "destructive"
      });
      return;
    }

    try {
      setComments(prevComments => 
        prevComments.map(comment => {
          if (comment.id === commentId) {
            const isLiked = comment.is_liked;
            return {
              ...comment,
              is_liked: !isLiked,
              likes_count: (comment.likes_count || 0) + (isLiked ? -1 : 1)
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map(reply => {
                if (reply.id === commentId) {
                  const isLiked = reply.is_liked;
                  return {
                    ...reply,
                    is_liked: !isLiked,
                    likes_count: (reply.likes_count || 0) + (isLiked ? -1 : 1)
                  };
                }
                return reply;
              })
            };
          }
          return comment;
        })
      );

      /* Real Supabase implementation:
      const { data: existingLike } = await supabase
        .from('comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        await supabase
          .from('comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('comment_likes')
          .insert({ comment_id: commentId, user_id: user.id });
      }
      */

    } catch (error: any) {
      toast({
        title: "Failed to update like",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return {
    comments,
    loading,
    commentCount,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
    likeComment
  };
};

// Helper function to calculate total comments including replies
const calculateTotalComments = (comments: Comment[]): number => {
  return comments.reduce((total, comment) => {
    return total + 1 + (comment.replies?.length || 0);
  }, 0);
};
