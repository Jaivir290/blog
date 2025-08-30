import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Save, Send, Plus, X, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useBlogs } from "@/hooks/useBlogs";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader as DialogHdr, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";

const WritePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [setAsCover, setSetAsCover] = useState(false);
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { createBlog } = useBlogs();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    setShowAuthDialog(!user);
  }, [user]);

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      addTag();
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!user) {
        toast({ title: "Sign in required", description: "Please sign in to upload images.", variant: "destructive" });
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast({ title: "Invalid file", description: "Please select an image file.", variant: "destructive" });
        return;
      }
      // Limit to ~5MB
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: "Max size is 5MB.", variant: "destructive" });
        return;
      }

      setUploadingImage(true);
      const path = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from("images").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });
      if (uploadError) throw uploadError;

      const { data: pub } = supabase.storage.from("images").getPublicUrl(path);
      const publicUrl = pub.publicUrl;
      setImageUrl(publicUrl);
      toast({ title: "Image uploaded", description: "Ready to insert." });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message || String(err), variant: "destructive" });
    } finally {
      setUploadingImage(false);
      // Reset input value to allow uploading the same file again if needed
      if (e.target) e.target.value = "";
    }
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your article has been saved as a draft.",
    });
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in the title and content before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    const { error } = await createBlog({
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
      featured_image_url: featuredImageUrl || null,
    });

    if (!error) {
      // Reset form
      setTitle("");
      setContent("");
      setExcerpt("");
      setTags([]);
      setFeaturedImageUrl("");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Write New Article</h1>
            <p className="text-muted-foreground mt-2">
              Share your knowledge with the developer community
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveDraft} disabled={!user}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!user || isSubmitting}
              className="bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Submitting..." : "Submit for Review"}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Editor */}
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-gradient-card backdrop-blur-sm border-border/60">
              <CardContent className="pt-6">
                <Tabs defaultValue="write" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="write">Write</TabsTrigger>
                    <TabsTrigger value="preview">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="write" className="space-y-4">
                    {featuredImageUrl && (
                      <div className="rounded-lg overflow-hidden border border-border/60">
                        <img src={featuredImageUrl} alt="Featured" className="w-full h-48 object-cover" />
                        <div className="p-2 flex justify-end">
                          <Button variant="outline" size="sm" onClick={() => setFeaturedImageUrl("")}>Remove cover</Button>
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="title">Article Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter your article title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-lg font-semibold"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Excerpt (Optional)</Label>
                      <Textarea
                        id="excerpt"
                        placeholder="Brief description of your article..."
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        rows={2}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        placeholder="Write your article content here... (Markdown supported)"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={20}
                        className="font-mono"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setShowImageDialog(true)}>
                        <Image className="h-4 w-4 mr-2" />
                        Add Image
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="preview" className="space-y-4">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      {title && <h1 className="text-3xl font-bold text-foreground">{title}</h1>}
                      {excerpt && <p className="text-xl text-muted-foreground italic">{excerpt}</p>}
                      {content ? (
                        <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                          {content}
                        </div>
                      ) : (
                        <p className="text-muted-foreground italic">Start writing to see the preview...</p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tags */}
            <Card className="bg-gradient-card backdrop-blur-sm border-border/60">
              <CardHeader>
                <CardTitle className="text-lg">Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addTag}
                    disabled={!newTag.trim() || tags.length >= 5}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
                
                {tags.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Add tags to help readers find your article
                  </p>
                )}
                
                <p className="text-xs text-muted-foreground">
                  {tags.length}/5 tags used
                </p>
              </CardContent>
            </Card>

            {/* Publishing Info */}
            <Card className="bg-gradient-card backdrop-blur-sm border-border/60">
              <CardHeader>
                <CardTitle className="text-lg">Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <Badge variant="secondary">Draft</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Visibility:</span>
                  <span>Public After Approval</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Review:</span>
                  <span>Required</span>
                </div>
                <div className="text-xs bg-muted/50 p-3 rounded-lg">
                  <p className="font-medium mb-1">📝 Review Process</p>
                  <p>Articles are reviewed by our team within 24 hours to ensure quality and community guidelines compliance.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Image Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHdr>
            <DialogTitle>Add image</DialogTitle>
            <DialogDescription>Paste an image URL to insert and optionally set as cover.</DialogDescription>
          </DialogHdr>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="img-url">Image URL</Label>
              <Input id="img-url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div className="text-center text-xs text-muted-foreground">or</div>
            <div className="space-y-2">
              <Label htmlFor="img-file">Upload image</Label>
              <Input id="img-file" type="file" accept="image/*" disabled={uploadingImage} onChange={handleImageFileChange} />
              {uploadingImage && <p className="text-xs">Uploading...</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="img-alt">Alt text</Label>
              <Input id="img-alt" value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} placeholder="Describe the image" />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="cover" checked={setAsCover} onCheckedChange={(v) => setSetAsCover(!!v)} />
              <Label htmlFor="cover">Set as cover image</Label>
            </div>
            {imageUrl && (
              <div className="rounded-md overflow-hidden border border-border/60">
                <img src={imageUrl} alt={imageAlt || 'preview'} className="w-full h-40 object-cover" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImageDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              const valid = /^https?:\/\//i.test(imageUrl);
              if (!valid) {
                toast({ title: "Invalid URL", description: "Enter a valid image URL.", variant: "destructive" });
                return;
              }
              const alt = imageAlt.trim() || 'image';
              const toInsert = `\n![${alt}](${imageUrl})\n`;
              setContent((prev) => prev + toInsert);
              if (setAsCover) setFeaturedImageUrl(imageUrl);
              setImageUrl("");
              setImageAlt("");
              setSetAsCover(false);
              setShowImageDialog(false);
            }}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHdr>
            <DialogTitle>Sign in required</DialogTitle>
            <DialogDescription>
              You need to be signed in to write and submit an article.
            </DialogDescription>
          </DialogHdr>
          <DialogFooter className="sm:justify-end">
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
            <Button variant="outline" onClick={() => setShowAuthDialog(false)}>Maybe later</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WritePage;
