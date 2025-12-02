import { CollectionMap } from "../CollectionMap";
import { CollectionPoint } from "../CollectionPointCard";

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

export default function CollectionMapExample() {
  return (
    <div className="p-4">
      <CollectionMap
        points={mockPoints}
        center={[36.8065, 10.1815]}
        zoom={13}
        onPointClick={(point) => console.log("Point clicked:", point)}
        className="h-[400px] w-full rounded-lg overflow-hidden border"
      />
    </div>
  );
}
