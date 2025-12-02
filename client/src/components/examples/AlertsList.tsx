import { useState } from "react";
import { AlertsList, Alert } from "../AlertsList";

// todo: remove mock functionality
const initialAlerts: Alert[] = [
  {
    id: "1",
    severity: "critical",
    title: "Container Overflow Risk",
    description: "Container at Central Plaza has reached 95% capacity. Immediate collection required.",
    location: "Central Plaza",
    timestamp: "5 min ago",
    acknowledged: false,
  },
  {
    id: "2",
    severity: "critical",
    title: "Vehicle Breakdown",
    description: "Vehicle TU-9012-EF reported mechanical failure on Route 7.",
    location: "Industrial Zone",
    timestamp: "12 min ago",
    acknowledged: false,
  },
  {
    id: "3",
    severity: "warning",
    title: "Low Fuel Level",
    description: "Vehicle TU-5678-CD fuel level at 18%. Refueling recommended.",
    timestamp: "25 min ago",
    acknowledged: false,
  },
  {
    id: "4",
    severity: "warning",
    title: "Route Delay",
    description: "Morning collection in North District running 45 minutes behind schedule.",
    location: "North District",
    timestamp: "1 hour ago",
    acknowledged: true,
  },
  {
    id: "5",
    severity: "info",
    title: "Scheduled Maintenance",
    description: "Reminder: Vehicle TU-1234-AB scheduled for maintenance tomorrow.",
    timestamp: "2 hours ago",
    acknowledged: true,
  },
];

export default function AlertsListExample() {
  const [alerts, setAlerts] = useState(initialAlerts);

  const handleAcknowledge = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const handleDismiss = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="p-4 max-w-md">
      <AlertsList
        alerts={alerts}
        onAcknowledge={handleAcknowledge}
        onDismiss={handleDismiss}
        maxHeight="350px"
      />
    </div>
  );
}
