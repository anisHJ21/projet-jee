import { useState } from "react";
import { VehicleCard, Vehicle } from "@/components/VehicleCard";
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
import { Plus, Search, Filter } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// todo: remove mock functionality
const initialVehicles: Vehicle[] = [
  {
    id: "1",
    plateNumber: "TU-1234-AB",
    type: "compactor",
    status: "available",
    capacity: 8000,
    currentLoad: 0,
    fuelLevel: 85,
    lastMaintenance: "Nov 28, 2024",
    assignedDriver: undefined,
    currentRoute: undefined,
  },
  {
    id: "2",
    plateNumber: "TU-5678-CD",
    type: "side_loader",
    status: "in_use",
    capacity: 6000,
    currentLoad: 4200,
    fuelLevel: 45,
    lastMaintenance: "Nov 15, 2024",
    assignedDriver: "Ahmed Ben Salem",
    currentRoute: "North District - Morning",
  },
  {
    id: "3",
    plateNumber: "TU-9012-EF",
    type: "rear_loader",
    status: "maintenance",
    capacity: 10000,
    currentLoad: 0,
    fuelLevel: 20,
    lastMaintenance: "Dec 1, 2024",
    assignedDriver: undefined,
    currentRoute: undefined,
  },
  {
    id: "4",
    plateNumber: "TU-3456-GH",
    type: "compactor",
    status: "in_use",
    capacity: 8000,
    currentLoad: 5600,
    fuelLevel: 62,
    lastMaintenance: "Nov 20, 2024",
    assignedDriver: "Karim Souissi",
    currentRoute: "Central District - Morning",
  },
  {
    id: "5",
    plateNumber: "TU-7890-IJ",
    type: "tipper",
    status: "available",
    capacity: 12000,
    currentLoad: 0,
    fuelLevel: 95,
    lastMaintenance: "Nov 25, 2024",
    assignedDriver: undefined,
    currentRoute: undefined,
  },
  {
    id: "6",
    plateNumber: "TU-2468-KL",
    type: "side_loader",
    status: "out_of_service",
    capacity: 6000,
    currentLoad: 0,
    fuelLevel: 10,
    lastMaintenance: "Oct 15, 2024",
    assignedDriver: undefined,
    currentRoute: undefined,
  },
];

const vehicleFormSchema = z.object({
  plateNumber: z.string().min(6, "Plate number must be at least 6 characters"),
  type: z.enum(["compactor", "tipper", "side_loader", "rear_loader"]),
  status: z.enum(["available", "in_use", "maintenance", "out_of_service"]),
  capacity: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, "Capacity must be a positive number"),
  fuelLevel: z.string().refine((val) => {
    const num = parseInt(val);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, "Fuel level must be between 0 and 100"),
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

export default function Vehicles() {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      plateNumber: "",
      type: "compactor",
      status: "available",
      capacity: "8000",
      fuelLevel: "100",
    },
  });

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = vehicle.plateNumber
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || vehicle.type === typeFilter;
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleOpenDialog = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      form.reset({
        plateNumber: vehicle.plateNumber,
        type: vehicle.type,
        status: vehicle.status,
        capacity: vehicle.capacity.toString(),
        fuelLevel: vehicle.fuelLevel.toString(),
      });
    } else {
      setEditingVehicle(undefined);
      form.reset({
        plateNumber: "",
        type: "compactor",
        status: "available",
        capacity: "8000",
        fuelLevel: "100",
      });
    }
    setAddDialogOpen(true);
  };

  const handleSubmit = (values: VehicleFormValues) => {
    if (editingVehicle) {
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === editingVehicle.id
            ? {
                ...v,
                plateNumber: values.plateNumber,
                type: values.type,
                status: values.status,
                capacity: parseInt(values.capacity),
                fuelLevel: parseInt(values.fuelLevel),
              }
            : v
        )
      );
    } else {
      const newVehicle: Vehicle = {
        id: Date.now().toString(),
        plateNumber: values.plateNumber,
        type: values.type,
        status: values.status,
        capacity: parseInt(values.capacity),
        currentLoad: 0,
        fuelLevel: parseInt(values.fuelLevel),
        lastMaintenance: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };
      setVehicles((prev) => [...prev, newVehicle]);
    }
    setAddDialogOpen(false);
    setEditingVehicle(undefined);
    form.reset();
  };

  const handleDeleteVehicle = () => {
    if (vehicleToDelete) {
      setVehicles((prev) => prev.filter((v) => v.id !== vehicleToDelete));
      setVehicleToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold">Vehicles</h1>
          <p className="text-muted-foreground">
            Manage fleet vehicles and their assignments
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} data-testid="button-add-vehicle">
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by plate number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-vehicles"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]" data-testid="select-filter-type">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="compactor">Compactor</SelectItem>
              <SelectItem value="tipper">Tipper</SelectItem>
              <SelectItem value="side_loader">Side Loader</SelectItem>
              <SelectItem value="rear_loader">Rear Loader</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]" data-testid="select-filter-vehicle-status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="in_use">In Use</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="out_of_service">Out of Service</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredVehicles.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No vehicles found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onEdit={(v) => handleOpenDialog(v)}
              onDelete={(id) => {
                setVehicleToDelete(id);
                setDeleteDialogOpen(true);
              }}
              onAssign={(v) => console.log("Assign vehicle:", v)}
            />
          ))}
        </div>
      )}

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingVehicle ? "Edit Vehicle" : "Add Vehicle"}
            </DialogTitle>
            <DialogDescription>
              {editingVehicle
                ? "Update the vehicle details below."
                : "Fill in the details for the new vehicle."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="plateNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plate Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., TU-1234-AB"
                        {...field}
                        data-testid="input-vehicle-plate"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-vehicle-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="compactor">Compactor</SelectItem>
                          <SelectItem value="tipper">Tipper</SelectItem>
                          <SelectItem value="side_loader">Side Loader</SelectItem>
                          <SelectItem value="rear_loader">Rear Loader</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-vehicle-status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="in_use">In Use</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="out_of_service">Out of Service</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity (kg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="8000"
                          {...field}
                          data-testid="input-vehicle-capacity"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fuelLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fuel Level (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="100"
                          {...field}
                          data-testid="input-vehicle-fuel"
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
                <Button type="submit" data-testid="button-save-vehicle">
                  {editingVehicle ? "Save Changes" : "Add Vehicle"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this vehicle? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteVehicle}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
