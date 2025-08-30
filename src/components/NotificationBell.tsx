import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";

const NotificationBell = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const unread = notifications.filter(n => !n.is_read).length;
  const onClickItem = async (n: any) => {
    await markAsRead(n.id);
    const link: string | undefined = n.link || (n.metadata && n.metadata.link);
    if (link) {
      if (/^https?:\/\//i.test(link)) {
        window.location.href = link;
      } else {
        navigate(link);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 h-4 min-w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] px-1 flex items-center justify-center leading-none">
              {unread > 99 ? '99+' : unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0" align="end">
        <div className="px-3 py-2 flex items-center justify-between border-b">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Notifications</span>
            <Badge variant="secondary" className="px-2 py-0 h-5 text-xs">{unread}</Badge>
          </div>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={markAllAsRead} disabled={unread === 0}>
            Mark all as read
          </Button>
        </div>
        <ScrollArea className="max-h-80">
          {notifications.length > 0 ? (
            <div className="py-1">
              {notifications.map((notification, idx) => (
                <div key={notification.id}>
                  <DropdownMenuItem
                    className={`flex flex-col items-start p-2 ${!notification.is_read ? 'bg-accent/40' : ''}`}
                    onClick={() => !notification.is_read && markAsRead(notification.id)}
                  >
                    <p className="text-sm text-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </DropdownMenuItem>
                  {idx < notifications.length - 1 && <DropdownMenuSeparator />}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications yet
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
