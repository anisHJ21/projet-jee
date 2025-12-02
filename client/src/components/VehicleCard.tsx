import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Truck, Fuel, Wrench, MapPin, Edit, Trash2 } from "lucide-react";

export type VehicleStatus = "available" | "in_use" | "maintenance" | "out_of_service";
export type VehicleType = "compactor" | "tipper" | "side_loader" | "rear_loader";

export interface Vehicle {
  id: string;
  plateNumber: string;
  type: VehicleType;
  status: VehicleStatus;
  capacity: number;
  currentLoad: number;
  fuelLevel: number;
  lastMaintenance: string;
  assignedDriver?: string;
  currentRoute?: string;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (id: string) => void;
  onAssign?: (vehicle: Vehicle) => void;
}

const statusConfig: Record<VehicleStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  available: { label: "Available", variant: "default" },
  in_use: { label: "In Use", variant: "secondary" },
  maintenance: { label: "Maintenance", variant: "outline" },
  out_of_service: { label: "Out of Service", variant: "destructive" },
};

const typeConfig: Record<VehicleType, { label: string }> = {
  compactor: { label: "Compactor Truck" },
  tipper: { label: "Tipper Truck" },
  side_loader: { label: "Side Loader" },
  rear_loader: { label: "Rear Loader" },
};

export function VehicleCard({ vehicle, onEdit, onDelete, onAssign }: VehicleCardProps) {
  const statusCfg = statusConfig[vehicle.status];
  const typeCfg = typeConfig[vehicle.type];
  const loadPercentage = Math.round((vehicle.currentLoad / vehicle.capacity) * 100);

  return (
    <Card className="hover-elevate" data-testid={`card-vehicle-${vehicle.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold font-mono">{vehicle.plateNumber}</h3>
              <p className="text-sm text-muted-foreground">{typeCfg.label}</p>
            </div>
          </div>
          <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3 space-y-3">
        <div>
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-muted-foreground">Current Load</span>
            <span className="font-mono">{vehicle.currentLoad}kg / {vehicle.capacity}kg</span>
          </div>
          <Progress 
            value={loadPercentage} 
            className={`h-2 ${loadPercentage >= 80 ? "[&>div]:bg-red-500" : loadPercentage >= 60 ? "[&>div]:bg-amber-500" : ""}`}
          />
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <Fuel className="h-3.5 w-3.5" />
            Fuel Level
          </span>
          <span className={`font-mono ${vehicle.fuelLevel < 25 ? "text-red-500" : ""}`}>
            {vehicle.fuelLevel}%
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <Wrench className="h-3.5 w-3.5" />
            Last Maintenance
          </span>
          <span>{vehicle.lastMaintenance}</span>
        </div>

        {vehicle.assignedDriver && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Assigned Driver</span>
            <span className="font-medium">{vehicle.assignedDriver}</span>
          </div>
        )}

        {vehicle.currentRoute && (
          <div className="flex items-center gap-1.5 text-sm">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span>Route: <strong>{vehicle.currentRoute}</strong></span>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 gap-2">
        {vehicle.status === "available" && (
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onAssign?.(vehicle)}
            data-testid={`button-assign-vehicle-${vehicle.id}`}
          >
            Assign to Route
          </Button>
        )}
        {vehicle.status !== "available" && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            disabled={vehicle.status === "out_of_service"}
          >
            {vehicle.status === "in_use" ? "View Route" : 
             vehicle.status === "maintenance" ? "View Schedule" : "Out of Service"}
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onEdit?.(vehicle)}
          data-testid={`button-edit-vehicle-${vehicle.id}`}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onDelete?.(vehicle.id)}
          data-testid={`button-delete-vehicle-${vehicle.id}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
