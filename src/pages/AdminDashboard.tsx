import { useEffect } from "react";
import Header from "@/components/Header";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  Users,
  FileText,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Trash2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminBlogs } from "@/hooks/useBlogs";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useNavigate, useLocation } from "react-router-dom";
import AllBlogs from "@/components/AllBlogs";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const { user, profile } = useAuth();
  const { pendingBlogs, loading, updateBlogStatus, deleteBlog } = useAdminBlogs();
  const { platformAnalytics } = useAnalytics();
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState<'analytics' | 'pending' | 'all'>('analytics');

  useEffect(() => {
    if (!user || profile?.role !== 'admin') {
      navigate('/');
    }
  }, [user, profile, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get('section');
    if (section === 'pending' || section === 'all' || section === 'analytics') {
      setTab(section as any);
    }
  }, [location.search]);

  if (!profile || profile.role !== 'admin') {
    return <div>Access denied</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage articles, reviews, and platform content
            </p>
          </div>
          
          <Badge variant="secondary" className="bg-primary/10 text-primary px-3 py-1">
            Admin Access
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Articles */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Articles</p>
                  <p className="text-2xl font-bold">{platformAnalytics?.total_blogs ?? 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Articles */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Pending Articles</p>
                  <p className="text-2xl font-bold">{pendingBlogs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Users */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-accent" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{platformAnalytics?.total_users ?? 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Views */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold">{platformAnalytics?.total_views ?? 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Management */}
        <Tabs value={tab} onValueChange={(v:any)=>setTab(v)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Review ({pendingBlogs.length})
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              All Articles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            {loading ? (
              <div className="text-center py-8">Loading pending articles...</div>
            ) : pendingBlogs.length > 0 ? (
              <div className="space-y-4">
                {pendingBlogs.map((blog) => (
                  <Card key={blog.id} className="bg-gradient-card backdrop-blur-sm border-border/60">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-lg">{blog.title}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {blog.excerpt || blog.content.substring(0, 150) + '...'}
                          </CardDescription>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage src={blog.profiles?.avatar_url} alt={blog.profiles?.display_name} />
                                <AvatarFallback>{blog.profiles?.display_name?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              {blog.profiles?.display_name}
                            </div>
                            <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {blog.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex space-x-2">
                        <Button 
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => updateBlogStatus(blog.id, 'approved')}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button 
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            const reason = window.prompt('Provide a rejection reason (optional):') || undefined;
                            updateBlogStatus(blog.id, 'rejected', reason);
                          }}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button 
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteBlog(blog.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => updateBlogStatus(blog.id, 'hidden')}
                        >
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Hide
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No pending articles to review.
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-6">
            <AllBlogs />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
