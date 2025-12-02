import { useState } from "react";
import { RouteCard, CollectionRoute } from "@/components/RouteCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Search, Filter, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// todo: remove mock functionality
const initialRoutes: CollectionRoute[] = [
  {
    id: "1",
    name: "Morning Collection - North",
    status: "in_progress",
    zone: "North District",
    scheduledTime: "06:00 AM",
    estimatedDuration: "3.5 hours",
    collectionPoints: 24,
    completedPoints: 16,
    assignedVehicle: "TU-5678-CD",
    assignedEmployees: ["Ahmed Ben Salem", "Fatima B."],
    distance: "18.5 km",
  },
  {
    id: "2",
    name: "Morning Collection - Central",
    status: "in_progress",
    zone: "Central District",
    scheduledTime: "06:30 AM",
    estimatedDuration: "2.5 hours",
    collectionPoints: 18,
    completedPoints: 12,
    assignedVehicle: "TU-3456-GH",
    assignedEmployees: ["Karim Souissi"],
    distance: "12.3 km",
  },
  {
    id: "3",
    name: "Afternoon Collection - South",
    status: "scheduled",
    zone: "South District",
    scheduledTime: "02:00 PM",
    estimatedDuration: "4 hours",
    collectionPoints: 32,
    completedPoints: 0,
    assignedVehicle: "TU-1234-AB",
    assignedEmployees: ["Sami Mejri", "Leila H."],
    distance: "25.8 km",
  },
  {
    id: "4",
    name: "Evening Collection - Industrial",
    status: "scheduled",
    zone: "Industrial Zone",
    scheduledTime: "06:00 PM",
    estimatedDuration: "3 hours",
    collectionPoints: 15,
    completedPoints: 0,
    assignedVehicle: "TU-7890-IJ",
    assignedEmployees: ["Mohamed T."],
    distance: "20.1 km",
  },
  {
    id: "5",
    name: "Yesterday - Market Area",
    status: "completed",
    zone: "Market District",
    scheduledTime: "Yesterday 08:00 AM",
    estimatedDuration: "2 hours",
    collectionPoints: 12,
    completedPoints: 12,
    assignedVehicle: "TU-5678-CD",
    assignedEmployees: ["Ahmed Ben Salem"],
    distance: "8.5 km",
  },
  {
    id: "6",
    name: "Yesterday - Residential East",
    status: "completed",
    zone: "East Residential",
    scheduledTime: "Yesterday 10:00 AM",
    estimatedDuration: "3 hours",
    collectionPoints: 28,
    completedPoints: 28,
    assignedVehicle: "TU-3456-GH",
    assignedEmployees: ["Karim Souissi", "Fatima B."],
    distance: "15.2 km",
  },
];

const routeFormSchema = z.object({
  name: z.string().min(3, "Route name must be at least 3 characters"),
  zone: z.string().min(2, "Zone is required"),
  scheduledTime: z.string().min(1, "Scheduled time is required"),
  estimatedDuration: z.string().min(1, "Estimated duration is required"),
  collectionPoints: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, "Must be a positive number"),
  distance: z.string().min(1, "Distance is required"),
});

type RouteFormValues = z.infer<typeof routeFormSchema>;

export default function Routes() {
  const [routes, setRoutes] = useState(initialRoutes);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<CollectionRoute | undefined>();

  const form = useForm<RouteFormValues>({
    resolver: zodResolver(routeFormSchema),
    defaultValues: {
      name: "",
      zone: "",
      scheduledTime: "",
      estimatedDuration: "",
      collectionPoints: "",
      distance: "",
    },
  });

  const filteredRoutes = routes.filter((route) => {
    const matchesSearch =
      route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.zone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || route.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeRoutes = filteredRoutes.filter(
    (r) => r.status === "in_progress" || r.status === "scheduled"
  );
  const completedRoutes = filteredRoutes.filter((r) => r.status === "completed");

  const handleOpenDialog = (route?: CollectionRoute) => {
    if (route) {
      setEditingRoute(route);
      form.reset({
        name: route.name,
        zone: route.zone,
        scheduledTime: route.scheduledTime,
        estimatedDuration: route.estimatedDuration,
        collectionPoints: route.collectionPoints.toString(),
        distance: route.distance,
      });
    } else {
      setEditingRoute(undefined);
      form.reset({
        name: "",
        zone: "",
        scheduledTime: "",
        estimatedDuration: "",
        collectionPoints: "",
        distance: "",
      });
    }
    setAddDialogOpen(true);
  };

  const handleSubmit = (values: RouteFormValues) => {
    if (editingRoute) {
      setRoutes((prev) =>
        prev.map((r) =>
          r.id === editingRoute.id
            ? {
                ...r,
                name: values.name,
                zone: values.zone,
                scheduledTime: values.scheduledTime,
                estimatedDuration: values.estimatedDuration,
                collectionPoints: parseInt(values.collectionPoints),
                distance: values.distance,
              }
            : r
        )
      );
    } else {
      const newRoute: CollectionRoute = {
        id: Date.now().toString(),
        name: values.name,
        status: "scheduled",
        zone: values.zone,
        scheduledTime: values.scheduledTime,
        estimatedDuration: values.estimatedDuration,
        collectionPoints: parseInt(values.collectionPoints),
        completedPoints: 0,
        assignedEmployees: [],
        distance: values.distance,
      };
      setRoutes((prev) => [...prev, newRoute]);
    }
    setAddDialogOpen(false);
    setEditingRoute(undefined);
    form.reset();
  };

  const handleStartRoute = (route: CollectionRoute) => {
    setRoutes((prev) =>
      prev.map((r) =>
        r.id === route.id ? { ...r, status: "in_progress" as const } : r
      )
    );
  };

  const handlePauseRoute = (route: CollectionRoute) => {
    setRoutes((prev) =>
      prev.map((r) =>
        r.id === route.id ? { ...r, status: "scheduled" as const } : r
      )
    );
  };

  const handleCompleteRoute = (route: CollectionRoute) => {
    setRoutes((prev) =>
      prev.map((r) =>
        r.id === route.id
          ? { ...r, status: "completed" as const, completedPoints: r.collectionPoints }
          : r
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold">Routes</h1>
          <p className="text-muted-foreground">
            Plan and manage collection routes
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} data-testid="button-add-route">
          <Plus className="h-4 w-4 mr-2" />
          Create Route
        </Button>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search routes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-routes"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]" data-testid="select-filter-route-status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active" data-testid="tab-active-routes">
            <Calendar className="h-4 w-4 mr-2" />
            Active & Scheduled ({activeRoutes.length})
          </TabsTrigger>
          <TabsTrigger value="history" data-testid="tab-history-routes">
            History ({completedRoutes.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4">
          {activeRoutes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No active or scheduled routes.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeRoutes.map((route) => (
                <RouteCard
                  key={route.id}
                  route={route}
                  onEdit={(r) => handleOpenDialog(r)}
                  onStart={handleStartRoute}
                  onPause={handlePauseRoute}
                  onComplete={handleCompleteRoute}
                  onViewDetails={(r) => console.log("View details:", r)}
                />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          {completedRoutes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No completed routes in history.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedRoutes.map((route) => (
                <RouteCard
                  key={route.id}
                  route={route}
                  onEdit={(r) => handleOpenDialog(r)}
                  onViewDetails={(r) => console.log("View details:", r)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingRoute ? "Edit Route" : "Create Route"}
            </DialogTitle>
            <DialogDescription>
              {editingRoute
                ? "Update the route details below."
                : "Fill in the details for the new collection route."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Route Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Morning Collection - North"
                        {...field}
                        data-testid="input-route-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., North District"
                        {...field}
                        data-testid="input-route-zone"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="scheduledTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scheduled Time</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 06:00 AM"
                          {...field}
                          data-testid="input-route-time"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estimatedDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Est. Duration</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 3.5 hours"
                          {...field}
                          data-testid="input-route-duration"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="collectionPoints"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Collection Points</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 24"
                          {...field}
                          data-testid="input-route-points"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="distance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distance</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 18.5 km"
                          {...field}
                          data-testid="input-route-distance"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" data-testid="button-save-route">
                  {editingRoute ? "Save Changes" : "Create Route"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
