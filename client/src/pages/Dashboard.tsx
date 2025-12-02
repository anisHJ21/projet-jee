import { useQuery, useMutation } from "@tanstack/react-query";
import { StatsCard } from "@/components/StatsCard";
import { CollectionMap } from "@/components/CollectionMap";
import { AlertsList } from "@/components/AlertsList";
import { RouteCard } from "@/components/RouteCard";
import { CollectionPoint } from "@/components/CollectionPointCard";
import { MapPin, Truck, Users, AlertTriangle, TrendingUp, Leaf } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { CollectionPoint as DbCollectionPoint, Route, Alert } from "@shared/schema";

interface DashboardStats {
  collectionPoints: { total: number; needingAttention: number };
  routes: { total: number; active: number };
  employees: { onDuty: number; available: number };
  alerts: { active: number; critical: number };
}

function transformCollectionPoint(point: DbCollectionPoint): CollectionPoint {
  return {
    id: point.id,
    name: point.name,
    address: point.address,
    wasteType: point.wasteType as CollectionPoint["wasteType"],
    fillLevel: point.fillLevel,
    status: point.status as CollectionPoint["status"],
    lastCollected: point.lastCollected ?? undefined,
    coordinates: { lat: point.latitude, lng: point.longitude },
  };
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: collectionPoints = [], isLoading: pointsLoading } = useQuery<DbCollectionPoint[]>({
    queryKey: ["/api/collection-points"],
  });

  const { data: routes = [], isLoading: routesLoading } = useQuery<Route[]>({
    queryKey: ["/api/routes"],
  });

  const { data: alerts = [], isLoading: alertsLoading } = useQuery<Alert[]>({
    queryKey: ["/api/alerts"],
  });

  const acknowledgeAlertMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("PATCH", `/api/alerts/${id}`, { acknowledged: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
    },
  });

  const deleteAlertMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/alerts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
    },
  });

  const updateRouteMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest("PATCH", `/api/routes/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/routes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
    },
  });

  const handleAcknowledge = (id: string) => {
    acknowledgeAlertMutation.mutate(id);
  };

  const handleDismiss = (id: string) => {
    deleteAlertMutation.mutate(id);
  };

  const transformedPoints = collectionPoints.map(transformCollectionPoint);
  
  const activeRoutes = routes
    .filter((r) => r.status === "in_progress" || r.status === "scheduled")
    .slice(0, 4)
    .map((route) => ({
      id: route.id,
      name: route.name,
      status: route.status as "scheduled" | "in_progress" | "completed" | "cancelled",
      zone: route.zone,
      scheduledTime: route.scheduledTime,
      estimatedDuration: route.estimatedDuration,
      collectionPoints: route.collectionPoints,
      completedPoints: route.completedPoints,
      assignedVehicle: route.assignedVehicle ?? undefined,
      assignedEmployees: route.assignedEmployees,
      distance: route.distance,
    }));

  const transformedAlerts = alerts.map((alert) => ({
    id: alert.id,
    severity: alert.severity as "critical" | "warning" | "info",
    title: alert.title,
    description: alert.description,
    location: alert.location ?? undefined,
    timestamp: alert.timestamp,
    acknowledged: alert.acknowledged,
  }));

  const isLoading = statsLoading || pointsLoading || routesLoading || alertsLoading;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-72" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-[500px]" />
          </div>
          <Skeleton className="h-[500px]" />
        </div>
      </div>
    );
  }

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
          value={stats?.collectionPoints.total ?? 0}
          subtitle={`${stats?.collectionPoints.needingAttention ?? 0} requiring attention`}
          icon={MapPin}
          trend={{ value: 8, isPositive: true }}
          variant="default"
        />
        <StatsCard
          title="Active Routes"
          value={stats?.routes.total ?? 0}
          subtitle={`${stats?.routes.active ?? 0} in progress`}
          icon={Truck}
          variant="success"
        />
        <StatsCard
          title="Employees On Duty"
          value={stats?.employees.onDuty ?? 0}
          subtitle={`${stats?.employees.available ?? 0} available`}
          icon={Users}
          variant="default"
        />
        <StatsCard
          title="Active Alerts"
          value={stats?.alerts.active ?? 0}
          subtitle={`${stats?.alerts.critical ?? 0} critical`}
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
                points={transformedPoints}
                center={[36.8065, 10.1815]}
                zoom={13}
                className="h-[400px] w-full rounded-lg overflow-hidden"
                onPointClick={(point) => console.log("Point clicked:", point)}
              />
            </CardContent>
          </Card>

          <div>
            <h2 className="text-lg font-semibold mb-4">Active Routes</h2>
            {activeRoutes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No active routes at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeRoutes.map((route) => (
                  <RouteCard
                    key={route.id}
                    route={route}
                    onEdit={(r) => console.log("Edit route:", r)}
                    onPause={(r) => updateRouteMutation.mutate({ id: r.id, status: "scheduled" })}
                    onComplete={(r) => updateRouteMutation.mutate({ id: r.id, status: "completed" })}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <AlertsList
            alerts={transformedAlerts}
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
