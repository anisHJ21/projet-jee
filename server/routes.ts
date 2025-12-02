import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertCollectionPointSchema, 
  insertEmployeeSchema, 
  insertVehicleSchema, 
  insertRouteSchema,
  insertAlertSchema,
  insertNotificationSchema
} from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Collection Points API
  app.get("/api/collection-points", async (req, res) => {
    try {
      const points = await storage.getCollectionPoints();
      res.json(points);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch collection points" });
    }
  });

  app.get("/api/collection-points/:id", async (req, res) => {
    try {
      const point = await storage.getCollectionPoint(req.params.id);
      if (!point) {
        return res.status(404).json({ message: "Collection point not found" });
      }
      res.json(point);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch collection point" });
    }
  });

  app.post("/api/collection-points", async (req, res) => {
    try {
      const parsed = insertCollectionPointSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
      }
      const point = await storage.createCollectionPoint(parsed.data);
      res.status(201).json(point);
    } catch (error) {
      res.status(500).json({ message: "Failed to create collection point" });
    }
  });

  app.patch("/api/collection-points/:id", async (req, res) => {
    try {
      const point = await storage.updateCollectionPoint(req.params.id, req.body);
      if (!point) {
        return res.status(404).json({ message: "Collection point not found" });
      }
      res.json(point);
    } catch (error) {
      res.status(500).json({ message: "Failed to update collection point" });
    }
  });

  app.delete("/api/collection-points/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCollectionPoint(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Collection point not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete collection point" });
    }
  });

  // Employees API
  app.get("/api/employees", async (req, res) => {
    try {
      const employeesList = await storage.getEmployees();
      res.json(employeesList);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch employees" });
    }
  });

  app.get("/api/employees/:id", async (req, res) => {
    try {
      const employee = await storage.getEmployee(req.params.id);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch employee" });
    }
  });

  app.post("/api/employees", async (req, res) => {
    try {
      const parsed = insertEmployeeSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
      }
      const employee = await storage.createEmployee(parsed.data);
      res.status(201).json(employee);
    } catch (error) {
      res.status(500).json({ message: "Failed to create employee" });
    }
  });

  app.patch("/api/employees/:id", async (req, res) => {
    try {
      const employee = await storage.updateEmployee(req.params.id, req.body);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      res.status(500).json({ message: "Failed to update employee" });
    }
  });

  app.delete("/api/employees/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteEmployee(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete employee" });
    }
  });

  // Vehicles API
  app.get("/api/vehicles", async (req, res) => {
    try {
      const vehiclesList = await storage.getVehicles();
      res.json(vehiclesList);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vehicles" });
    }
  });

  app.get("/api/vehicles/:id", async (req, res) => {
    try {
      const vehicle = await storage.getVehicle(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vehicle" });
    }
  });

  app.post("/api/vehicles", async (req, res) => {
    try {
      const parsed = insertVehicleSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
      }
      const vehicle = await storage.createVehicle(parsed.data);
      res.status(201).json(vehicle);
    } catch (error) {
      res.status(500).json({ message: "Failed to create vehicle" });
    }
  });

  app.patch("/api/vehicles/:id", async (req, res) => {
    try {
      const vehicle = await storage.updateVehicle(req.params.id, req.body);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ message: "Failed to update vehicle" });
    }
  });

  app.delete("/api/vehicles/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteVehicle(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete vehicle" });
    }
  });

  // Routes API
  app.get("/api/routes", async (req, res) => {
    try {
      const routesList = await storage.getRoutes();
      res.json(routesList);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch routes" });
    }
  });

  app.get("/api/routes/:id", async (req, res) => {
    try {
      const route = await storage.getRoute(req.params.id);
      if (!route) {
        return res.status(404).json({ message: "Route not found" });
      }
      res.json(route);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch route" });
    }
  });

  app.post("/api/routes", async (req, res) => {
    try {
      const parsed = insertRouteSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
      }
      const route = await storage.createRoute(parsed.data);
      res.status(201).json(route);
    } catch (error) {
      res.status(500).json({ message: "Failed to create route" });
    }
  });

  app.patch("/api/routes/:id", async (req, res) => {
    try {
      const route = await storage.updateRoute(req.params.id, req.body);
      if (!route) {
        return res.status(404).json({ message: "Route not found" });
      }
      res.json(route);
    } catch (error) {
      res.status(500).json({ message: "Failed to update route" });
    }
  });

  app.delete("/api/routes/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteRoute(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Route not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete route" });
    }
  });

  // Alerts API
  app.get("/api/alerts", async (req, res) => {
    try {
      const alertsList = await storage.getAlerts();
      res.json(alertsList);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.get("/api/alerts/:id", async (req, res) => {
    try {
      const alert = await storage.getAlert(req.params.id);
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      res.json(alert);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alert" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const parsed = insertAlertSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
      }
      const alert = await storage.createAlert(parsed.data);
      res.status(201).json(alert);
    } catch (error) {
      res.status(500).json({ message: "Failed to create alert" });
    }
  });

  app.patch("/api/alerts/:id", async (req, res) => {
    try {
      const alert = await storage.updateAlert(req.params.id, req.body);
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      res.json(alert);
    } catch (error) {
      res.status(500).json({ message: "Failed to update alert" });
    }
  });

  app.delete("/api/alerts/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAlert(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Alert not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete alert" });
    }
  });

  // Notifications API
  app.get("/api/notifications", async (req, res) => {
    try {
      const notificationsList = await storage.getNotifications();
      res.json(notificationsList);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.get("/api/notifications/:id", async (req, res) => {
    try {
      const notification = await storage.getNotification(req.params.id);
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      res.json(notification);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notification" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const parsed = insertNotificationSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
      }
      const notification = await storage.createNotification(parsed.data);
      res.status(201).json(notification);
    } catch (error) {
      res.status(500).json({ message: "Failed to create notification" });
    }
  });

  app.patch("/api/notifications/:id", async (req, res) => {
    try {
      const notification = await storage.updateNotification(req.params.id, req.body);
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      res.json(notification);
    } catch (error) {
      res.status(500).json({ message: "Failed to update notification" });
    }
  });

  app.delete("/api/notifications/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteNotification(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Notification not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete notification" });
    }
  });

  // Mark all notifications as read
  app.post("/api/notifications/mark-all-read", async (req, res) => {
    try {
      const allNotifications = await storage.getNotifications();
      for (const notification of allNotifications) {
        await storage.updateNotification(notification.id, { read: true });
      }
      res.json({ message: "All notifications marked as read" });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notifications as read" });
    }
  });

  // Dashboard stats endpoint
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const [points, routesList, employeesList, alertsList] = await Promise.all([
        storage.getCollectionPoints(),
        storage.getRoutes(),
        storage.getEmployees(),
        storage.getAlerts()
      ]);

      const criticalPoints = points.filter(p => p.fillLevel >= 80 || p.status === 'full').length;
      const activeRoutes = routesList.filter(r => r.status === 'in_progress' || r.status === 'scheduled').length;
      const onDutyEmployees = employeesList.filter(e => e.status === 'on_duty' || e.status === 'available').length;
      const availableEmployees = employeesList.filter(e => e.status === 'available').length;
      const activeAlerts = alertsList.filter(a => !a.acknowledged).length;
      const criticalAlerts = alertsList.filter(a => a.severity === 'critical' && !a.acknowledged).length;

      res.json({
        collectionPoints: {
          total: points.length,
          needingAttention: criticalPoints
        },
        routes: {
          total: routesList.length,
          active: activeRoutes
        },
        employees: {
          onDuty: onDutyEmployees,
          available: availableEmployees
        },
        alerts: {
          active: activeAlerts,
          critical: criticalAlerts
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  return httpServer;
}
