import { useState } from "react";
import { StatsCard } from "@/components/StatsCard";
import { CollectionMap } from "@/components/CollectionMap";
import { AlertsList, Alert } from "@/components/AlertsList";
import { RouteCard, CollectionRoute } from "@/components/RouteCard";
import { CollectionPoint } from "@/components/CollectionPointCard";
import { MapPin, Truck, Users, AlertTriangle, TrendingUp, Leaf } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// todo: remove mock functionality
const mockPoints: CollectionPoint[] = [
  {
    id: "1",
    name: "Central Plaza Container",
    address: "123 Main Street, Tunis",
    wasteType: "plastic",
    fillLevel: 45,
    status: "operational",
    lastCollected: "2 hours ago",
    coordinates: { lat: 36.8065, lng: 10.1815 },
  },
  {
    id: "2",
    name: "North District Bin",
    address: "456 Oak Avenue, Tunis",
    wasteType: "organic",
    fillLevel: 92,
    status: "full",
    lastCollected: "1 day ago",
    coordinates: { lat: 36.8165, lng: 10.1715 },
  },
  {
    id: "3",
    name: "Market Square Container",
    address: "789 Commerce Blvd, Tunis",
    wasteType: "glass",
    fillLevel: 68,
    status: "operational",
    lastCollected: "4 hours ago",
    coordinates: { lat: 36.7965, lng: 10.1915 },
  },
  {
    id: "4",
    name: "South Gate Bin",
    address: "321 Southern Road, Tunis",
    wasteType: "paper",
    fillLevel: 25,
    status: "operational",
    lastCollected: "6 hours ago",
    coordinates: { lat: 36.7865, lng: 10.1815 },
  },
  {
    id: "5",
    name: "Industrial Zone Container",
    address: "555 Factory Lane, Tunis",
    wasteType: "metal",
    fillLevel: 78,
    status: "maintenance",
    lastCollected: "12 hours ago",
    coordinates: { lat: 36.8265, lng: 10.2015 },
  },
];

// todo: remove mock functionality
const mockAlerts: Alert[] = [
  {
    id: "1",
    severity: "critical",
    title: "Container Overflow Risk",
    description: "Container at Central Plaza has reached 95% capacity.",
    location: "Central Plaza",
    timestamp: "5 min ago",
    acknowledged: false,
  },
  {
    id: "2",
    severity: "warning",
    title: "Low Fuel Level",
    description: "Vehicle TU-5678-CD fuel level at 18%.",
    timestamp: "25 min ago",
    acknowledged: false,
  },
  {
    id: "3",
    severity: "info",
    title: "Route Completed",
    description: "Morning collection in South District completed.",
    timestamp: "1 hour ago",
    acknowledged: true,
  },
];

// todo: remove mock functionality
const activeRoutes: CollectionRoute[] = [
  {
    id: "1",
    name: "Morning - North District",
    status: "in_progress",
    zone: "North District",
    scheduledTime: "06:00 AM",
    estimatedDuration: "3.5 hours",
    collectionPoints: 24,
    completedPoints: 16,
    assignedVehicle: "TU-5678-CD",
    assignedEmployees: ["Ahmed B.", "Fatima B."],
    distance: "18.5 km",
  },
  {
    id: "2",
    name: "Morning - Central",
    status: "in_progress",
    zone: "Central District",
    scheduledTime: "06:30 AM",
    estimatedDuration: "2.5 hours",
    collectionPoints: 18,
    completedPoints: 12,
    assignedVehicle: "TU-1234-AB",
    assignedEmployees: ["Karim S."],
    distance: "12.3 km",
  },
];

export default function Dashboard() {
  const [alerts, setAlerts] = useState(mockAlerts);

  const handleAcknowledge = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const handleDismiss = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of waste management operations</p>
        </div>
        <Button data-testid="button-generate-report">
          <TrendingUp className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          value={alerts.filter((a) => !a.acknowledged).length}
          subtitle={`${alerts.filter((a) => a.severity === "critical" && !a.acknowledged).length} critical`}
          icon={AlertTriangle}
          variant="danger"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Collection Points Map</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CollectionMap
                points={mockPoints}
                center={[36.8065, 10.1815]}
                zoom={13}
                className="h-[400px] w-full rounded-lg overflow-hidden"
                onPointClick={(point) => console.log("Point clicked:", point)}
              />
            </CardContent>
          </Card>

          <div>
            <h2 className="text-lg font-semibold mb-4">Active Routes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeRoutes.map((route) => (
                <RouteCard
                  key={route.id}
                  route={route}
                  onEdit={(r) => console.log("Edit route:", r)}
                  onPause={(r) => console.log("Pause route:", r)}
                  onComplete={(r) => console.log("Complete route:", r)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <AlertsList
            alerts={alerts}
            onAcknowledge={handleAcknowledge}
            onDismiss={handleDismiss}
            maxHeight="300px"
          />

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Leaf className="h-5 w-5 text-emerald-500" />
                Environmental Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">Recycling Rate</span>
                  <span className="font-mono font-medium">68%</span>
                </div>
                <Progress value={68} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">CO2 Reduction</span>
                  <span className="font-mono font-medium">-15% vs last month</span>
                </div>
                <Progress value={85} className="h-2 [&>div]:bg-emerald-500" />
              </div>
              <div className="pt-2 border-t">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">2,450</p>
                    <p className="text-xs text-muted-foreground">kg CO2 saved</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">12.5t</p>
                    <p className="text-xs text-muted-foreground">waste recycled</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
