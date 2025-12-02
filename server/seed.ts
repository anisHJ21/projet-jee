import { db } from "./db";
import { collectionPoints, employees, vehicles, routes, alerts, notifications } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  // Check if data already exists
  const existingPoints = await db.select().from(collectionPoints);
  if (existingPoints.length > 0) {
    console.log("Database already seeded. Skipping...");
    return;
  }

  // Seed Collection Points
  await db.insert(collectionPoints).values([
    {
      name: "Central Plaza Container",
      address: "123 Main Street, Tunis",
      wasteType: "plastic",
      fillLevel: 45,
      status: "operational",
      lastCollected: "2 hours ago",
      latitude: 36.8065,
      longitude: 10.1815,
    },
    {
      name: "North District Bin",
      address: "456 Oak Avenue, Tunis",
      wasteType: "organic",
      fillLevel: 92,
      status: "full",
      lastCollected: "1 day ago",
      latitude: 36.8165,
      longitude: 10.1715,
    },
    {
      name: "Market Square Container",
      address: "789 Commerce Blvd, Tunis",
      wasteType: "glass",
      fillLevel: 68,
      status: "operational",
      lastCollected: "4 hours ago",
      latitude: 36.7965,
      longitude: 10.1915,
    },
    {
      name: "South Gate Bin",
      address: "321 Southern Road, Tunis",
      wasteType: "paper",
      fillLevel: 25,
      status: "operational",
      lastCollected: "6 hours ago",
      latitude: 36.7865,
      longitude: 10.1815,
    },
    {
      name: "Industrial Zone Container",
      address: "555 Factory Lane, Tunis",
      wasteType: "metal",
      fillLevel: 78,
      status: "maintenance",
      lastCollected: "12 hours ago",
      latitude: 36.8265,
      longitude: 10.2015,
    },
    {
      name: "Residential Area East",
      address: "890 East Boulevard, Tunis",
      wasteType: "mixed",
      fillLevel: 55,
      status: "operational",
      lastCollected: "3 hours ago",
      latitude: 36.8100,
      longitude: 10.2100,
    },
  ]);

  // Seed Employees
  await db.insert(employees).values([
    {
      name: "Ahmed Ben Salem",
      role: "driver",
      status: "available",
      phone: "+216 98 123 456",
      email: "ahmed.bensalem@municipality.tn",
      shiftsThisWeek: 3,
      joinDate: "2022-03-15",
    },
    {
      name: "Fatima Bouazizi",
      role: "collector",
      status: "on_duty",
      phone: "+216 97 654 321",
      email: "fatima.b@municipality.tn",
      assignedZone: "North District",
      shiftsThisWeek: 5,
      joinDate: "2021-08-20",
    },
    {
      name: "Mohamed Trabelsi",
      role: "supervisor",
      status: "on_leave",
      phone: "+216 95 111 222",
      email: "m.trabelsi@municipality.tn",
      shiftsThisWeek: 0,
      joinDate: "2020-01-10",
    },
    {
      name: "Karim Souissi",
      role: "driver",
      status: "on_duty",
      phone: "+216 96 333 444",
      email: "k.souissi@municipality.tn",
      assignedZone: "Central District",
      shiftsThisWeek: 4,
      joinDate: "2021-05-12",
    },
    {
      name: "Leila Hamdi",
      role: "technician",
      status: "available",
      phone: "+216 99 555 666",
      email: "l.hamdi@municipality.tn",
      shiftsThisWeek: 2,
      joinDate: "2023-01-05",
    },
    {
      name: "Sami Mejri",
      role: "collector",
      status: "off_duty",
      phone: "+216 98 777 888",
      email: "s.mejri@municipality.tn",
      shiftsThisWeek: 5,
      joinDate: "2022-09-01",
    },
  ]);

  // Seed Vehicles
  await db.insert(vehicles).values([
    {
      plateNumber: "TU-1234-AB",
      type: "compactor",
      status: "available",
      capacity: 8000,
      currentLoad: 0,
      fuelLevel: 85,
      lastMaintenance: "Nov 28, 2024",
    },
    {
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
      plateNumber: "TU-9012-EF",
      type: "rear_loader",
      status: "maintenance",
      capacity: 10000,
      currentLoad: 0,
      fuelLevel: 20,
      lastMaintenance: "Dec 1, 2024",
    },
    {
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
      plateNumber: "TU-7890-IJ",
      type: "tipper",
      status: "available",
      capacity: 12000,
      currentLoad: 0,
      fuelLevel: 95,
      lastMaintenance: "Nov 25, 2024",
    },
    {
      plateNumber: "TU-2468-KL",
      type: "side_loader",
      status: "out_of_service",
      capacity: 6000,
      currentLoad: 0,
      fuelLevel: 10,
      lastMaintenance: "Oct 15, 2024",
    },
  ]);

  // Seed Routes
  await db.insert(routes).values([
    {
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
      name: "Morning Collection - Central",
      status: "in_progress",
      zone: "Central District",
      scheduledTime: "06:30 AM",
      estimatedDuration: "2.5 hours",
      collectionPoints: 18,
      completedPoints: 12,
      assignedVehicle: "TU-3456-GH",
      assignedEmployees: ["Karim Souissi"],
      distance: "12.3 km",
    },
    {
      name: "Afternoon Collection - South",
      status: "scheduled",
      zone: "South District",
      scheduledTime: "02:00 PM",
      estimatedDuration: "4 hours",
      collectionPoints: 32,
      completedPoints: 0,
      assignedVehicle: "TU-1234-AB",
      assignedEmployees: ["Sami Mejri", "Leila H."],
      distance: "25.8 km",
    },
    {
      name: "Evening Collection - Industrial",
      status: "scheduled",
      zone: "Industrial Zone",
      scheduledTime: "06:00 PM",
      estimatedDuration: "3 hours",
      collectionPoints: 15,
      completedPoints: 0,
      assignedVehicle: "TU-7890-IJ",
      assignedEmployees: ["Mohamed T."],
      distance: "20.1 km",
    },
    {
      name: "Yesterday - Market Area",
      status: "completed",
      zone: "Market District",
      scheduledTime: "Yesterday 08:00 AM",
      estimatedDuration: "2 hours",
      collectionPoints: 12,
      completedPoints: 12,
      assignedVehicle: "TU-5678-CD",
      assignedEmployees: ["Ahmed Ben Salem"],
      distance: "8.5 km",
    },
  ]);

  // Seed Alerts
  await db.insert(alerts).values([
    {
      severity: "critical",
      title: "Container Overflow Risk",
      description: "Container at North District Bin has reached 92% capacity and needs immediate attention.",
      location: "North District",
      timestamp: "5 min ago",
      acknowledged: false,
    },
    {
      severity: "warning",
      title: "Low Fuel Level",
      description: "Vehicle TU-2468-KL fuel level at 10%. Requires refueling.",
      timestamp: "25 min ago",
      acknowledged: false,
    },
    {
      severity: "info",
      title: "Route Completed",
      description: "Morning collection in Market Area completed successfully.",
      timestamp: "1 hour ago",
      acknowledged: true,
    },
    {
      severity: "warning",
      title: "Maintenance Required",
      description: "Industrial Zone Container requires scheduled maintenance.",
      location: "Industrial Zone",
      timestamp: "2 hours ago",
      acknowledged: false,
    },
  ]);

  // Seed Notifications
  await db.insert(notifications).values([
    {
      type: "alert",
      title: "Container Full",
      message: "Container at North District Bin has reached 92% capacity.",
      timestamp: "5 minutes ago",
      read: false,
    },
    {
      type: "warning",
      title: "Low Fuel Alert",
      message: "Vehicle TU-2468-KL has fuel level at 10%.",
      timestamp: "15 minutes ago",
      read: false,
    },
    {
      type: "success",
      title: "Route Completed",
      message: "Morning collection in Market Area completed.",
      timestamp: "1 hour ago",
      read: true,
    },
  ]);

  console.log("Database seeded successfully!");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  });
