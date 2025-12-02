import { RouteCard, CollectionRoute } from "../RouteCard";

// todo: remove mock functionality
const mockRoutes: CollectionRoute[] = [
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
    name: "Afternoon Collection - Central",
    status: "scheduled",
    zone: "Central District",
    scheduledTime: "02:00 PM",
    estimatedDuration: "2.5 hours",
    collectionPoints: 18,
    completedPoints: 0,
    assignedVehicle: "TU-1234-AB",
    assignedEmployees: ["Karim Souissi"],
    distance: "12.3 km",
  },
  {
    id: "3",
    name: "Evening Collection - South",
    status: "completed",
    zone: "South District",
    scheduledTime: "Yesterday 04:00 PM",
    estimatedDuration: "4 hours",
    collectionPoints: 32,
    completedPoints: 32,
    assignedVehicle: "TU-3456-GH",
    assignedEmployees: ["Sami Mejri", "Leila T."],
    distance: "25.8 km",
  },
];

export default function RouteCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {mockRoutes.map((route) => (
        <RouteCard
          key={route.id}
          route={route}
          onEdit={(r) => console.log("Edit route:", r)}
          onStart={(r) => console.log("Start route:", r)}
          onPause={(r) => console.log("Pause route:", r)}
          onComplete={(r) => console.log("Complete route:", r)}
          onViewDetails={(r) => console.log("View details:", r)}
        />
      ))}
    </div>
  );
}
