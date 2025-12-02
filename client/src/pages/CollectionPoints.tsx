import { useState } from "react";
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

// todo: remove mock functionality
const initialPoints: CollectionPoint[] = [
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
  {
    id: "6",
    name: "Residential Area East",
    address: "890 East Boulevard, Tunis",
    wasteType: "mixed",
    fillLevel: 55,
    status: "operational",
    lastCollected: "3 hours ago",
    coordinates: { lat: 36.8100, lng: 10.2100 },
  },
];

export default function CollectionPoints() {
  const [points, setPoints] = useState(initialPoints);
  const [searchQuery, setSearchQuery] = useState("");
  const [wasteTypeFilter, setWasteTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingPoint, setEditingPoint] = useState<CollectionPoint | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pointToDelete, setPointToDelete] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<CollectionPoint | undefined>();

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
    const newPoint: CollectionPoint = {
      ...data,
      id: Date.now().toString(),
    };
    setPoints((prev) => [...prev, newPoint]);
  };

  const handleEditPoint = (data: Omit<CollectionPoint, "id">) => {
    if (editingPoint) {
      setPoints((prev) =>
        prev.map((p) => (p.id === editingPoint.id ? { ...data, id: editingPoint.id } : p))
      );
      setEditingPoint(undefined);
    }
  };

  const handleDeletePoint = () => {
    if (pointToDelete) {
      setPoints((prev) => prev.filter((p) => p.id !== pointToDelete));
      setPointToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

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
