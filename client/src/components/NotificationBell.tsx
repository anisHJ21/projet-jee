import { useState } from "react";
import { Bell, AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export type NotificationType = "alert" | "success" | "info" | "warning";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationBellProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDismiss?: (id: string) => void;
}

const typeConfig: Record<NotificationType, { icon: typeof Bell; color: string }> = {
  alert: { icon: AlertTriangle, color: "text-red-500" },
  warning: { icon: AlertTriangle, color: "text-amber-500" },
  success: { icon: CheckCircle, color: "text-emerald-500" },
  info: { icon: Info, color: "text-blue-500" },
};

export function NotificationBell({ 
  notifications, 
  onMarkAsRead, 
  onMarkAllAsRead,
  onDismiss 
}: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          data-testid="button-notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              variant="destructive"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onMarkAllAsRead}
              data-testid="button-mark-all-read"
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No notifications
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const config = typeConfig[notification.type];
                const Icon = config.icon;
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover-elevate cursor-pointer ${
                      !notification.read ? "bg-primary/5" : ""
                    }`}
                    onClick={() => onMarkAsRead?.(notification.id)}
                    data-testid={`notification-${notification.id}`}
                  >
                    <div className="flex gap-3">
                      <Icon className={`h-5 w-5 mt-0.5 ${config.color}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-sm leading-tight">
                            {notification.title}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 -mt-1 -mr-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDismiss?.(notification.id);
                            }}
                            data-testid={`button-dismiss-${notification.id}`}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
