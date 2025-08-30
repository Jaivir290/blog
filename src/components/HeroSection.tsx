import { Button } from "@/components/ui/button";
import { PenTool, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import AuthDialog from "@/components/AuthDialog";

const HeroSection = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [articlesCount, setArticlesCount] = useState<number | null>(null);
  const [activeUsers, setActiveUsers] = useState<number | null>(null);
  const [monthlyReaders, setMonthlyReaders] = useState<number | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [articlesRes, usersRes] = await Promise.all([
          supabase.from('blogs').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
        ]);
        setArticlesCount(articlesRes.count ?? 0);
        setActiveUsers(usersRes.count ?? 0);

        const start = new Date();
        start.setDate(start.getDate() - 30);
        const { data: analyticsRows } = await supabase
          .from('analytics')
          .select('value,date,metric_type')
          .eq('metric_type', 'views')
          .gte('date', start.toISOString());
        const total = (analyticsRows || []).reduce((sum: number, r: any) => sum + (r.value || 0), 0);
        setMonthlyReaders(total);
      } catch (_) {
        setArticlesCount(0);
        setActiveUsers(0);
        setMonthlyReaders(0);
      }
    };
    loadStats();
  }, []);

  const formatNumber = (n: number | null) => {
    if (n == null) return '—';
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M+';
    if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K+';
    return String(n);
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Share Your
            <span className="bg-gradient-primary bg-clip-text text-transparent block">
              Developer Story
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of developers sharing insights, tutorials, and experiences 
            that shape the future of technology.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/write" onClick={(e) => { if (!user) { e.preventDefault(); setOpen(true); } }}>
              <Button
                size="lg"
                className="bg-gradient-primary hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-medium text-lg px-8 py-6"
              >
                <PenTool className="h-5 w-5 mr-2" />
                Start Writing
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-primary/20 bg-background/50 backdrop-blur-sm hover:bg-primary/5 transition-all duration-300 text-lg px-8 py-6"
              onClick={() => {
                const articlesSection = document.getElementById('articles-section');
                if (articlesSection) {
                  articlesSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Explore Articles
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <PenTool className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">{formatNumber(articlesCount)}</div>
              <div className="text-sm text-muted-foreground">Articles Published</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-accent/10 p-3 rounded-full mb-3">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <div className="text-2xl font-bold text-foreground">{formatNumber(activeUsers)}</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">{formatNumber(monthlyReaders)}</div>
              <div className="text-sm text-muted-foreground">Monthly Readers</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-20 w-16 h-16 bg-primary/5 rounded-full blur-xl animate-pulse delay-500"></div>
      <AuthDialog open={open} onOpenChange={setOpen} />
    </section>
  );
};

export default HeroSection;
