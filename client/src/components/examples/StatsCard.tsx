import { StatsCard } from "../StatsCard";
import { MapPin, Truck, Users, AlertTriangle } from "lucide-react";

export default function StatsCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <StatsCard
        title="Collection Points"
        value={156}
        subtitle="12 requiring attention"
        icon={MapPin}
        trend={{ value: 8, isPositive: true }}
        variant="default"
      />
      <StatsCard
        title="Active Routes"
        value={8}
        subtitle="3 in progress"
        icon={Truck}
        variant="success"
      />
      <StatsCard
        title="Employees On Duty"
        value={24}
        subtitle="6 available"
        icon={Users}
        variant="default"
      />
      <StatsCard
        title="Active Alerts"
        value={5}
        subtitle="2 critical"
        icon={AlertTriangle}
        variant="danger"
      />
    </div>
  );
}
