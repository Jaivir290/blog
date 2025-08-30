import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Heart, Reply, Edit2, Trash2, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

export interface Comment {
  id: string;
  blog_id: string;
  user_id: string;
  content: string;
  parent_id?: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    display_name: string;
    avatar_url?: string;
  };
  replies?: Comment[];
  likes_count?: number;
  is_liked?: boolean;
}

interface CommentItemProps {
  comment: Comment;
  onReply?: (parentId: string, content: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  onLike?: (commentId: string) => void;
  depth?: number;
}

const CommentItem = ({ 
  comment, 
  onReply, 
  onEdit, 
  onDelete, 
  onLike, 
  depth = 0 
}: CommentItemProps) => {
  const { user, profile } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [editContent, setEditContent] = useState(comment.content);

  const isAuthor = user?.id === comment.user_id;
  const maxDepth = 3; // Limit reply nesting

  const handleReply = () => {
    if (replyContent.trim() && onReply) {
      onReply(comment.id, replyContent.trim());
      setReplyContent("");
      setIsReplying(false);
    }
  };

  const handleEdit = () => {
    if (editContent.trim() && onEdit) {
      onEdit(comment.id, editContent.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  return (
    <div className={`${depth > 0 ? 'ml-8' : ''} mb-4`}>
      <Card className="bg-card/50 border-border/60">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.profiles?.avatar_url} alt={comment.profiles?.display_name} />
              <AvatarFallback>
                {comment.profiles?.display_name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              {/* Comment Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-foreground">
                    {comment.profiles?.display_name || 'Anonymous'}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                  {comment.updated_at !== comment.created_at && (
                    <span className="text-xs text-muted-foreground">(edited)</span>
                  )}
                </div>

                {isAuthor && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setIsEditing(true)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete?.(comment.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Comment Content */}
              {isEditing ? (
                <div className="space-y-2">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[80px]"
                    placeholder="Edit your comment..."
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleEdit}>
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-foreground whitespace-pre-wrap">{comment.content}</p>
              )}

              {/* Comment Actions */}
              {!isEditing && (
                <div className="flex items-center space-x-4 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onLike?.(comment.id)}
                    className={`text-muted-foreground hover:text-destructive ${
                      comment.is_liked ? 'text-destructive' : ''
                    }`}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${comment.is_liked ? 'fill-current' : ''}`} />
                    {comment.likes_count || 0}
                  </Button>

                  {depth < maxDepth && user && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsReplying(!isReplying)}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Reply className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                  )}
                </div>
              )}

              {/* Reply Form */}
              {isReplying && (
                <div className="space-y-2 pt-2">
                  <Textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="min-h-[80px]"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleReply}>
                      Reply
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setIsReplying(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onLike={onLike}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
