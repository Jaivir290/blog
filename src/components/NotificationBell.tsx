import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const NotificationBell = () => {
  const { notifications, markAsRead } = useNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Bell className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <div className="p-2 font-semibold">Notifications</div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-2 ${!notification.is_read ? 'bg-accent/50' : ''}`}
                onClick={() => !notification.is_read && markAsRead(notification.id)}
              >
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No new notifications
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
