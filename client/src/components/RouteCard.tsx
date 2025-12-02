import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Route, Clock, MapPin, Users, Truck, Play, Pause, CheckCircle, Edit } from "lucide-react";

export type RouteStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export interface CollectionRoute {
  id: string;
  name: string;
  status: RouteStatus;
  zone: string;
  scheduledTime: string;
  estimatedDuration: string;
  collectionPoints: number;
  completedPoints: number;
  assignedVehicle?: string;
  assignedEmployees: string[];
  distance: string;
}

interface RouteCardProps {
  route: CollectionRoute;
  onEdit?: (route: CollectionRoute) => void;
  onStart?: (route: CollectionRoute) => void;
  onPause?: (route: CollectionRoute) => void;
  onComplete?: (route: CollectionRoute) => void;
  onViewDetails?: (route: CollectionRoute) => void;
}

const statusConfig: Record<RouteStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof Route }> = {
  scheduled: { label: "Scheduled", variant: "outline", icon: Clock },
  in_progress: { label: "In Progress", variant: "default", icon: Play },
  completed: { label: "Completed", variant: "secondary", icon: CheckCircle },
  cancelled: { label: "Cancelled", variant: "destructive", icon: Pause },
};

export function RouteCard({ route, onEdit, onStart, onPause, onComplete, onViewDetails }: RouteCardProps) {
  const statusCfg = statusConfig[route.status];
  const StatusIcon = statusCfg.icon;
  const progress = route.collectionPoints > 0 
    ? Math.round((route.completedPoints / route.collectionPoints) * 100) 
    : 0;

  return (
    <Card className="hover-elevate" data-testid={`card-route-${route.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
              <Route className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{route.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {route.zone}
              </p>
            </div>
          </div>
          <Badge variant={statusCfg.variant} className="flex items-center gap-1">
            <StatusIcon className="h-3 w-3" />
            {statusCfg.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3 space-y-3">
        {route.status === "in_progress" && (
          <div>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-mono">{route.completedPoints}/{route.collectionPoints} points</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Scheduled
            </span>
            <p className="font-medium mt-0.5">{route.scheduledTime}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Duration</span>
            <p className="font-medium mt-0.5">{route.estimatedDuration}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            Collection Points
          </span>
          <span className="font-mono">{route.collectionPoints}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Distance</span>
          <span className="font-mono">{route.distance}</span>
        </div>

        {route.assignedVehicle && (
          <div className="flex items-center gap-1.5 text-sm">
            <Truck className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{route.assignedVehicle}</span>
          </div>
        )}

        {route.assignedEmployees.length > 0 && (
          <div className="flex items-center gap-1.5 text-sm">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{route.assignedEmployees.join(", ")}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 gap-2">
        {route.status === "scheduled" && (
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onStart?.(route)}
            data-testid={`button-start-route-${route.id}`}
          >
            <Play className="h-4 w-4 mr-1" />
            Start Route
          </Button>
        )}
        {route.status === "in_progress" && (
          <>
            <Button 
              variant="outline"
              size="sm" 
              onClick={() => onPause?.(route)}
              data-testid={`button-pause-route-${route.id}`}
            >
              <Pause className="h-4 w-4 mr-1" />
              Pause
            </Button>
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => onComplete?.(route)}
              data-testid={`button-complete-route-${route.id}`}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Complete
            </Button>
          </>
        )}
        {(route.status === "completed" || route.status === "cancelled") && (
          <Button 
            variant="outline"
            size="sm" 
            className="flex-1"
            onClick={() => onViewDetails?.(route)}
            data-testid={`button-view-route-${route.id}`}
          >
            View Details
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onEdit?.(route)}
          data-testid={`button-edit-route-${route.id}`}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
