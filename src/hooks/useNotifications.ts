import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  created_at: string;
  message: string;
  is_read: boolean;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setNotifications((data as Notification[]) || []);
    } catch (error: any) {
      toast({
        title: "Error loading notifications",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;

      fetchNotifications();
    } catch (error: any) {
      toast({
        title: "Error marking notification as read",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    loading,
    fetchNotifications,
    markAsRead
  };
};
