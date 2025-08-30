import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Eye, 
  Heart, 
  MessageCircle, 
  FileText,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Share2
} from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

const AnalyticsDashboard = () => {
  const { platformAnalytics, blogAnalytics, loading, refreshAnalytics } = useAnalytics();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!platformAnalytics) return null;

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    trendValue, 
    description 
  }: {
    title: string;
    value: string | number;
    icon: any;
    trend?: 'up' | 'down';
    trendValue?: string;
    description?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <Icon className="h-8 w-8 text-primary" />
          <div className="ml-4">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-center space-x-2">
              <p className="text-2xl font-bold">{value.toLocaleString()}</p>
              {trend && trendValue && (
                <div className={`flex items-center ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-sm font-medium">{trendValue}</span>
                </div>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Analytics Dashboard</h2>
          <p className="text-muted-foreground mt-2">
            Track your platform's performance and user engagement
          </p>
        </div>
        <Button onClick={refreshAnalytics} variant="outline">
          <Activity className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Articles"
          value={platformAnalytics.total_blogs}
          icon={FileText}
          trend="up"
          trendValue="+12%"
          description="vs last month"
        />
        <StatCard
          title="Total Users"
          value={platformAnalytics.total_users}
          icon={Users}
          trend="up"
          trendValue="+8%"
          description="vs last month"
        />
        <StatCard
          title="Total Views"
          value={platformAnalytics.total_views}
          icon={Eye}
          trend="up"
          trendValue="+15%"
          description="vs last month"
        />
        <StatCard
          title="Engagement Rate"
          value="7.8%"
          icon={Target}
          trend="up"
          trendValue="+2.3%"
          description="avg engagement"
        />
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Engagement Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  User Activity Trend
                </CardTitle>
                <CardDescription>Daily active users and posts over the last week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {platformAnalytics.user_engagement_trend.map((day, index) => (
                    <div key={day.date} className="flex items-center justify-between">
                      <div className="text-sm font-medium">
                        {new Date(day.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-blue-500" />
                          {day.users}
                        </div>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1 text-green-500" />
                          {day.posts}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Popular Tags
                </CardTitle>
                <CardDescription>Most used tags in published articles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {platformAnalytics.popular_tags.slice(0, 8).map((tag, index) => (
                    <div key={tag.tag} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          #{index + 1}
                        </Badge>
                        <span className="text-sm font-medium">{tag.tag}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{tag.count} articles</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          {/* Top Performing Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Top Performing Articles
              </CardTitle>
              <CardDescription>Articles with highest engagement this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platformAnalytics.top_performing_blogs.map((blog, index) => (
                  <div key={blog.blog_id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            #{index + 1}
                          </Badge>
                          <h3 className="font-medium line-clamp-1">{blog.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          by {blog.author} • {new Date(blog.published_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {blog.engagement_rate.toFixed(1)}% engagement
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1 text-muted-foreground" />
                        {blog.total_views.toLocaleString()}
                      </div>
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1 text-red-500" />
                        {blog.total_likes}
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1 text-blue-500" />
                        {blog.total_comments}
                      </div>
                      <div className="flex items-center">
                        <Share2 className="h-4 w-4 mr-1 text-green-500" />
                        {blog.total_shares}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Monthly Active Users"
              value={platformAnalytics.monthly_active_users}
              icon={Users}
              trend="up"
              trendValue="+5%"
            />
            <StatCard
              title="New Users"
              value="124"
              icon={TrendingUp}
              trend="up"
              trendValue="+18%"
              description="this month"
            />
            <StatCard
              title="User Retention"
              value="68%"
              icon={Target}
              trend="up"
              trendValue="+3%"
              description="7-day retention"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Demographics</CardTitle>
              <CardDescription>User distribution and activity patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4" />
                <p>User demographics visualization coming soon!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Likes"
              value={platformAnalytics.total_likes}
              icon={Heart}
              trend="up"
              trendValue="+22%"
            />
            <StatCard
              title="Total Comments"
              value={platformAnalytics.total_comments}
              icon={MessageCircle}
              trend="up"
              trendValue="+15%"
            />
            <StatCard
              title="Avg. Engagement"
              value="7.8%"
              icon={Activity}
              trend="up"
              trendValue="+2.1%"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
              <CardDescription>Detailed breakdown of user interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center">
                    <Heart className="h-5 w-5 mr-3 text-red-500" />
                    <span className="font-medium">Likes per Article</span>
                  </div>
                  <span className="text-lg font-bold">11.2</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-3 text-blue-500" />
                    <span className="font-medium">Comments per Article</span>
                  </div>
                  <span className="text-lg font-bold">3.3</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center">
                    <Share2 className="h-5 w-5 mr-3 text-green-500" />
                    <span className="font-medium">Shares per Article</span>
                  </div>
                  <span className="text-lg font-bold">1.8</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
