import { VehicleCard, Vehicle } from "../VehicleCard";

// todo: remove mock functionality
const mockVehicles: Vehicle[] = [
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
];

export default function VehicleCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {mockVehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onEdit={(v) => console.log("Edit vehicle:", v)}
          onDelete={(id) => console.log("Delete vehicle:", id)}
          onAssign={(v) => console.log("Assign vehicle:", v)}
        />
      ))}
    </div>
  );
}
