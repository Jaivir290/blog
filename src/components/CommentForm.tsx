import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface CommentFormProps {
  blogId: string;
  onSubmit: (content: string) => Promise<void>;
  placeholder?: string;
  title?: string;
}

const CommentForm = ({ 
  blogId, 
  onSubmit, 
  placeholder = "Share your thoughts...", 
  title = "Add a Comment" 
}: CommentFormProps) => {
  const { user, profile } = useAuth();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || !user) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent("");
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Card className="bg-muted/30 border-border/60">
        <CardContent className="p-6 text-center">
          <MessageCircle className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-medium text-foreground mb-2">Join the Discussion</h3>
          <p className="text-muted-foreground mb-4">
            Sign in to share your thoughts and engage with the community.
          </p>
          <a href="/auth">
            <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
              Sign In to Comment
            </Button>
          </a>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card backdrop-blur-sm border-border/60">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageCircle className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar_url} alt={profile?.display_name} />
              <AvatarFallback>
                {profile?.display_name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={placeholder}
                className="min-h-[100px] resize-none"
                disabled={isSubmitting}
              />

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Commenting as <span className="font-medium">{profile?.display_name}</span>
                </div>
                
                <Button
                  type="submit"
                  disabled={!content.trim() || isSubmitting}
                  className="bg-gradient-primary hover:opacity-90 transition-opacity"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CommentForm;
