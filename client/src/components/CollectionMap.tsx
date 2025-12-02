import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { CollectionPoint } from "./CollectionPointCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Navigation } from "lucide-react";

interface CollectionMapProps {
  points: CollectionPoint[];
  center?: [number, number];
  zoom?: number;
  onPointClick?: (point: CollectionPoint) => void;
  selectedPointId?: string;
  className?: string;
}

const createCustomIcon = (fillLevel: number, status: string) => {
  let color = "#22c55e";
  if (status === "full" || status === "damaged") {
    color = "#ef4444";
  } else if (fillLevel >= 80) {
    color = "#ef4444";
  } else if (fillLevel >= 60) {
    color = "#f59e0b";
  }

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          transform: rotate(45deg);
          color: white;
          font-size: 10px;
          font-weight: bold;
        ">${fillLevel}%</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
}

const wasteTypeLabels: Record<string, string> = {
  plastic: "Plastic",
  organic: "Organic",
  glass: "Glass",
  paper: "Paper",
  metal: "Metal",
  mixed: "Mixed",
};

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  operational: "default",
  maintenance: "secondary",
  full: "destructive",
  damaged: "destructive",
};

export function CollectionMap({
  points,
  center = [36.8065, 10.1815],
  zoom = 13,
  onPointClick,
  selectedPointId,
  className = "h-[500px] w-full rounded-lg overflow-hidden",
}: CollectionMapProps) {
  const mapRef = useRef<L.Map | null>(null);

  return (
    <div className={className} data-testid="collection-map">
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={center} zoom={zoom} />
        {points.map((point) => (
          <Marker
            key={point.id}
            position={[point.coordinates.lat, point.coordinates.lng]}
            icon={createCustomIcon(point.fillLevel, point.status)}
            eventHandlers={{
              click: () => onPointClick?.(point),
            }}
          >
            <Popup>
              <div className="min-w-[200px] p-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm">{point.name}</h3>
                  <Badge variant={statusVariants[point.status]} className="text-xs">
                    {point.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{point.address}</p>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Fill Level</span>
                      <span className="font-mono">{point.fillLevel}%</span>
                    </div>
                    <Progress value={point.fillLevel} className="h-1.5" />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Waste Type</span>
                    <span className="font-medium">{wasteTypeLabels[point.wasteType]}</span>
                  </div>
                  {point.lastCollected && (
                    <div className="flex justify-between text-xs">
                      <span>Last Collected</span>
                      <span>{point.lastCollected}</span>
                    </div>
                  )}
                </div>
                <Button 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={() => onPointClick?.(point)}
                >
                  <Navigation className="h-3 w-3 mr-1" />
                  View Details
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
