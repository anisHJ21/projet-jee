import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MapPin, Trash2, Edit, AlertTriangle, Package } from "lucide-react";

export type WasteType = "plastic" | "organic" | "glass" | "paper" | "metal" | "mixed";
export type ContainerStatus = "operational" | "maintenance" | "full" | "damaged";

export interface CollectionPoint {
  id: string;
  name: string;
  address: string;
  wasteType: WasteType;
  fillLevel: number;
  status: ContainerStatus;
  lastCollected?: string;
  coordinates: { lat: number; lng: number };
}

interface CollectionPointCardProps {
  point: CollectionPoint;
  onEdit?: (point: CollectionPoint) => void;
  onDelete?: (id: string) => void;
  onViewOnMap?: (point: CollectionPoint) => void;
}

const wasteTypeConfig: Record<WasteType, { label: string; color: string; icon: string }> = {
  plastic: { label: "Plastic", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400", icon: "P" },
  organic: { label: "Organic", color: "bg-green-500/10 text-green-600 dark:text-green-400", icon: "O" },
  glass: { label: "Glass", color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400", icon: "G" },
  paper: { label: "Paper", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400", icon: "PP" },
  metal: { label: "Metal", color: "bg-slate-500/10 text-slate-600 dark:text-slate-400", icon: "M" },
  mixed: { label: "Mixed", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400", icon: "MX" },
};

const statusConfig: Record<ContainerStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  operational: { label: "Operational", variant: "default" },
  maintenance: { label: "Maintenance", variant: "secondary" },
  full: { label: "Full", variant: "destructive" },
  damaged: { label: "Damaged", variant: "destructive" },
};

export function CollectionPointCard({ point, onEdit, onDelete, onViewOnMap }: CollectionPointCardProps) {
  const wasteConfig = wasteTypeConfig[point.wasteType];
  const statusCfg = statusConfig[point.status];
  const isCritical = point.fillLevel >= 80 || point.status === "full" || point.status === "damaged";

  return (
    <Card 
      className={`hover-elevate ${isCritical ? "border-destructive/50" : ""}`}
      data-testid={`card-collection-point-${point.id}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-md flex items-center justify-center text-sm font-bold ${wasteConfig.color}`}>
              {wasteConfig.icon}
            </div>
            <div>
              <h3 className="font-semibold leading-tight">{point.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3" />
                {point.address}
              </p>
            </div>
          </div>
          <Badge variant={statusCfg.variant} data-testid={`badge-status-${point.id}`}>
            {isCritical && <AlertTriangle className="h-3 w-3 mr-1" />}
            {statusCfg.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-muted-foreground">Fill Level</span>
              <span className="font-mono font-medium">{point.fillLevel}%</span>
            </div>
            <Progress 
              value={point.fillLevel} 
              className={`h-2 ${point.fillLevel >= 80 ? "[&>div]:bg-red-500" : point.fillLevel >= 60 ? "[&>div]:bg-amber-500" : ""}`}
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Package className="h-3 w-3" />
              Waste Type
            </span>
            <Badge variant="outline" className={wasteConfig.color}>
              {wasteConfig.label}
            </Badge>
          </div>
          {point.lastCollected && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last Collected</span>
              <span>{point.lastCollected}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => onViewOnMap?.(point)}
          data-testid={`button-view-map-${point.id}`}
        >
          <MapPin className="h-4 w-4 mr-1" />
          View on Map
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onEdit?.(point)}
          data-testid={`button-edit-${point.id}`}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onDelete?.(point.id)}
          data-testid={`button-delete-${point.id}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
