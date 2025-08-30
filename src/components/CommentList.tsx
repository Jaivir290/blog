import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, TrendingUp, Clock, Heart } from "lucide-react";
import CommentItem, { Comment } from "./CommentItem";
import CommentForm from "./CommentForm";
import { useComments } from "@/hooks/useComments";

interface CommentListProps {
  blogId: string;
}

const CommentList = ({ blogId }: CommentListProps) => {
  const {
    comments,
    loading,
    commentCount,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
    fetchComments
  } = useComments(blogId);

  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'popular':
        return (b.likes_count || 0) - (a.likes_count || 0);
      case 'newest':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const handleAddComment = async (content: string) => {
    await addComment(content);
  };

  const handleReply = async (parentId: string, content: string) => {
    await addComment(content, parentId);
  };

  const handleEdit = async (commentId: string, content: string) => {
    await updateComment(commentId, content);
  };

  const handleDelete = async (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      await deleteComment(commentId);
    }
  };

  const handleLike = async (commentId: string) => {
    await likeComment(commentId);
  };

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      <CommentForm blogId={blogId} onSubmit={handleAddComment} />

      {/* Comments Section */}
      <Card className="bg-gradient-card backdrop-blur-sm border-border/60">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Comments ({commentCount})
            </CardTitle>

            {commentCount > 0 && (
              <Tabs value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="newest" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Newest
                  </TabsTrigger>
                  <TabsTrigger value="popular" className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    Popular
                  </TabsTrigger>
                  <TabsTrigger value="oldest" className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Oldest
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading comments...</p>
            </div>
          ) : commentCount === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-medium text-foreground mb-2">No comments yet</h3>
              <p className="text-muted-foreground">
                Be the first to share your thoughts on this article.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedComments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onReply={handleReply}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onLike={handleLike}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommentList;
