import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const collectionPoints = pgTable("collection_points", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address").notNull(),
  wasteType: text("waste_type").notNull(),
  fillLevel: integer("fill_level").notNull().default(0),
  status: text("status").notNull().default("operational"),
  lastCollected: text("last_collected"),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
});

export const insertCollectionPointSchema = createInsertSchema(collectionPoints).omit({ id: true });
export type InsertCollectionPoint = z.infer<typeof insertCollectionPointSchema>;
export type CollectionPoint = typeof collectionPoints.$inferSelect;

export const employees = pgTable("employees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  role: text("role").notNull(),
  status: text("status").notNull().default("available"),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  assignedZone: text("assigned_zone"),
  shiftsThisWeek: integer("shifts_this_week").notNull().default(0),
  joinDate: text("join_date").notNull(),
});

export const insertEmployeeSchema = createInsertSchema(employees).omit({ id: true });
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Employee = typeof employees.$inferSelect;

export const vehicles = pgTable("vehicles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  plateNumber: text("plate_number").notNull().unique(),
  type: text("type").notNull(),
  status: text("status").notNull().default("available"),
  capacity: integer("capacity").notNull(),
  currentLoad: integer("current_load").notNull().default(0),
  fuelLevel: integer("fuel_level").notNull().default(100),
  lastMaintenance: text("last_maintenance").notNull(),
  assignedDriver: text("assigned_driver"),
  currentRoute: text("current_route"),
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({ id: true });
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = typeof vehicles.$inferSelect;

export const routes = pgTable("routes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  status: text("status").notNull().default("scheduled"),
  zone: text("zone").notNull(),
  scheduledTime: text("scheduled_time").notNull(),
  estimatedDuration: text("estimated_duration").notNull(),
  collectionPoints: integer("collection_points").notNull(),
  completedPoints: integer("completed_points").notNull().default(0),
  assignedVehicle: text("assigned_vehicle"),
  assignedEmployees: text("assigned_employees").array().notNull().default(sql`ARRAY[]::text[]`),
  distance: text("distance").notNull(),
});

export const insertRouteSchema = createInsertSchema(routes).omit({ id: true });
export type InsertRoute = z.infer<typeof insertRouteSchema>;
export type Route = typeof routes.$inferSelect;

export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  severity: text("severity").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location"),
  timestamp: text("timestamp").notNull(),
  acknowledged: boolean("acknowledged").notNull().default(false),
});

export const insertAlertSchema = createInsertSchema(alerts).omit({ id: true });
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  timestamp: text("timestamp").notNull(),
  read: boolean("read").notNull().default(false),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true });
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
