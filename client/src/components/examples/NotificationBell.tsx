import { useState } from "react";
import { NotificationBell, Notification } from "../NotificationBell";

// todo: remove mock functionality
const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "alert",
    title: "Container Full",
    message: "Container at Central Plaza has reached 95% capacity and needs immediate collection.",
    timestamp: "5 minutes ago",
    read: false,
  },
  {
    id: "2",
    type: "warning",
    title: "Low Fuel Alert",
    message: "Vehicle TU-5678-CD has fuel level below 25%. Please refuel soon.",
    timestamp: "15 minutes ago",
    read: false,
  },
  {
    id: "3",
    type: "success",
    title: "Route Completed",
    message: "Morning collection route in North District completed successfully.",
    timestamp: "1 hour ago",
    read: true,
  },
  {
    id: "4",
    type: "info",
    title: "Maintenance Scheduled",
    message: "Vehicle TU-9012-EF scheduled for maintenance tomorrow at 8:00 AM.",
    timestamp: "2 hours ago",
    read: true,
  },
];

export default function NotificationBellExample() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="p-4 flex justify-end">
      <NotificationBell
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDismiss={handleDismiss}
      />
    </div>
  );
}
