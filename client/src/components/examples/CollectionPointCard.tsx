import { CollectionPointCard, CollectionPoint } from "../CollectionPointCard";

// todo: remove mock functionality
const mockPoints: CollectionPoint[] = [
  {
    id: "1",
    name: "Central Plaza Container",
    address: "123 Main Street",
    wasteType: "plastic",
    fillLevel: 45,
    status: "operational",
    lastCollected: "2 hours ago",
    coordinates: { lat: 36.8065, lng: 10.1815 },
  },
  {
    id: "2",
    name: "North District Bin",
    address: "456 Oak Avenue",
    wasteType: "organic",
    fillLevel: 92,
    status: "full",
    lastCollected: "1 day ago",
    coordinates: { lat: 36.8165, lng: 10.1915 },
  },
  {
    id: "3",
    name: "Market Square Container",
    address: "789 Commerce Blvd",
    wasteType: "glass",
    fillLevel: 68,
    status: "operational",
    lastCollected: "4 hours ago",
    coordinates: { lat: 36.7965, lng: 10.1715 },
  },
];

export default function CollectionPointCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {mockPoints.map((point) => (
        <CollectionPointCard
          key={point.id}
          point={point}
          onEdit={(p) => console.log("Edit:", p)}
          onDelete={(id) => console.log("Delete:", id)}
          onViewOnMap={(p) => console.log("View on map:", p)}
        />
      ))}
    </div>
  );
}
