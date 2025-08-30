import { useEffect } from "react";
import Header from "@/components/Header";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const AnalyticsPage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || profile?.role !== 'admin') {
      navigate('/');
    }
  }, [user, profile, navigate]);

  if (!profile || profile.role !== 'admin') {
    return <div>Access denied</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <AnalyticsDashboard />
      </div>
    </div>
  );
};

export default AnalyticsPage;
