import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CollectionPointCard, CollectionPoint } from "@/components/CollectionPointCard";
import { CollectionMap } from "@/components/CollectionMap";
import { AddCollectionPointDialog } from "@/components/AddCollectionPointDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Map, LayoutGrid, Filter } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { CollectionPoint as DbCollectionPoint, InsertCollectionPoint } from "@shared/schema";

function transformToFrontend(point: DbCollectionPoint): CollectionPoint {
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

function transformToBackend(point: Omit<CollectionPoint, "id">): InsertCollectionPoint {
  return {
    name: point.name,
    address: point.address,
    wasteType: point.wasteType,
    fillLevel: point.fillLevel,
    status: point.status,
    lastCollected: point.lastCollected ?? null,
    latitude: point.coordinates.lat,
    longitude: point.coordinates.lng,
  };
}

export default function CollectionPoints() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [wasteTypeFilter, setWasteTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingPoint, setEditingPoint] = useState<CollectionPoint | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pointToDelete, setPointToDelete] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<CollectionPoint | undefined>();

  const { data: dbPoints = [], isLoading } = useQuery<DbCollectionPoint[]>({
    queryKey: ["/api/collection-points"],
  });

  const points = dbPoints.map(transformToFrontend);

  const createMutation = useMutation({
    mutationFn: async (data: Omit<CollectionPoint, "id">) => {
      const res = await apiRequest("POST", "/api/collection-points", transformToBackend(data));
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/collection-points"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Collection point created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create collection point", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Omit<CollectionPoint, "id"> }) => {
      const res = await apiRequest("PATCH", `/api/collection-points/${id}`, transformToBackend(data));
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/collection-points"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Collection point updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update collection point", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/collection-points/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/collection-points"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Collection point deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete collection point", variant: "destructive" });
    },
  });

  const filteredPoints = points.filter((point) => {
    const matchesSearch =
      point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      point.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWasteType =
      wasteTypeFilter === "all" || point.wasteType === wasteTypeFilter;
    const matchesStatus =
      statusFilter === "all" || point.status === statusFilter;
    return matchesSearch && matchesWasteType && matchesStatus;
  });

  const handleAddPoint = (data: Omit<CollectionPoint, "id">) => {
    createMutation.mutate(data);
  };

  const handleEditPoint = (data: Omit<CollectionPoint, "id">) => {
    if (editingPoint) {
      updateMutation.mutate({ id: editingPoint.id, data });
      setEditingPoint(undefined);
    }
  };

  const handleDeletePoint = () => {
    if (pointToDelete) {
      deleteMutation.mutate(pointToDelete);
      setPointToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <Skeleton className="h-9 w-56 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-56" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold">Collection Points</h1>
          <p className="text-muted-foreground">
            Manage and monitor waste collection points across the municipality
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)} data-testid="button-add-point">
          <Plus className="h-4 w-4 mr-2" />
          Add Collection Point
        </Button>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search collection points..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-points"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={wasteTypeFilter} onValueChange={setWasteTypeFilter}>
            <SelectTrigger className="w-[140px]" data-testid="select-filter-waste-type">
              <SelectValue placeholder="Waste Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="plastic">Plastic</SelectItem>
              <SelectItem value="organic">Organic</SelectItem>
              <SelectItem value="glass">Glass</SelectItem>
              <SelectItem value="paper">Paper</SelectItem>
              <SelectItem value="metal">Metal</SelectItem>
              <SelectItem value="mixed">Mixed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]" data-testid="select-filter-status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="operational">Operational</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="full">Full</SelectItem>
              <SelectItem value="damaged">Damaged</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList>
          <TabsTrigger value="grid" data-testid="tab-grid-view">
            <LayoutGrid className="h-4 w-4 mr-2" />
            Grid View
          </TabsTrigger>
          <TabsTrigger value="map" data-testid="tab-map-view">
            <Map className="h-4 w-4 mr-2" />
            Map View
          </TabsTrigger>
        </TabsList>
        <TabsContent value="grid" className="mt-4">
          {filteredPoints.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No collection points found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPoints.map((point) => (
                <CollectionPointCard
                  key={point.id}
                  point={point}
                  onEdit={(p) => {
                    setEditingPoint(p);
                    setAddDialogOpen(true);
                  }}
                  onDelete={(id) => {
                    setPointToDelete(id);
                    setDeleteDialogOpen(true);
                  }}
                  onViewOnMap={(p) => setSelectedPoint(p)}
                />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="map" className="mt-4">
          <CollectionMap
            points={filteredPoints}
            center={selectedPoint ? [selectedPoint.coordinates.lat, selectedPoint.coordinates.lng] : [36.8065, 10.1815]}
            zoom={selectedPoint ? 16 : 13}
            selectedPointId={selectedPoint?.id}
            className="h-[600px] w-full rounded-lg overflow-hidden border"
            onPointClick={(point) => setSelectedPoint(point)}
          />
        </TabsContent>
      </Tabs>

      <AddCollectionPointDialog
        open={addDialogOpen}
        onOpenChange={(open) => {
          setAddDialogOpen(open);
          if (!open) setEditingPoint(undefined);
        }}
        onSubmit={editingPoint ? handleEditPoint : handleAddPoint}
        editingPoint={editingPoint}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collection Point</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this collection point? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePoint}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
