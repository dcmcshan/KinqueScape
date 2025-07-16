import { pgTable, text, serial, integer, boolean, jsonb, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles enum
export const userRoleEnum = pgEnum("user_role", ["admin", "designer", "master", "participant", "voyeur"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").notNull().default("participant"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  isActive: boolean("is_active").notNull().default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const escapeRoomDesigns = pgTable("escape_room_designs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  theme: text("theme").notNull(),
  backstory: text("backstory"),
  victoryCondition: text("victory_condition"),
  layout: jsonb("layout"), // Canvas/room layout data
  puzzles: jsonb("puzzles"), // Array of puzzle configurations
  props: jsonb("props"), // Array of props and effects
  atmosphere: jsonb("atmosphere"), // Lighting, sound settings
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const businessPlans = pgTable("business_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  businessName: text("business_name").notNull(),
  location: text("location"),
  missionStatement: text("mission_statement"),
  targetMarket: jsonb("target_market"), // Primary/secondary audiences
  revenueStreams: jsonb("revenue_streams"), // Different revenue sources
  expenses: jsonb("expenses"), // Monthly expense breakdown
  marketingStrategy: jsonb("marketing_strategy"), // Marketing channels and budgets
  operations: jsonb("operations"), // Staffing, schedule, requirements
  timeline: jsonb("timeline"), // Launch milestones
  financialProjections: jsonb("financial_projections"), // Revenue/expense projections
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  role: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

// Authentication schemas
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Role permissions
export const rolePermissions = {
  admin: {
    canManageUsers: true,
    canCreateDesigns: true,
    canEditDesigns: true,
    canDeleteDesigns: true,
    canCreatePlans: true,
    canEditPlans: true,
    canDeletePlans: true,
    canControlDashboard: true,
    canViewDashboard: true,
    canManageScapes: true,
  },
  designer: {
    canManageUsers: false,
    canCreateDesigns: true,
    canEditDesigns: true,
    canDeleteDesigns: true,
    canCreatePlans: true,
    canEditPlans: true,
    canDeletePlans: true,
    canControlDashboard: false,
    canViewDashboard: true,
    canManageScapes: false,
  },
  master: {
    canManageUsers: false,
    canCreateDesigns: false,
    canEditDesigns: false,
    canDeleteDesigns: false,
    canCreatePlans: false,
    canEditPlans: false,
    canDeletePlans: false,
    canControlDashboard: true,
    canViewDashboard: true,
    canManageScapes: true,
  },
  participant: {
    canManageUsers: false,
    canCreateDesigns: false,
    canEditDesigns: false,
    canDeleteDesigns: false,
    canCreatePlans: false,
    canEditPlans: false,
    canDeletePlans: false,
    canControlDashboard: false,
    canViewDashboard: false,
    canManageScapes: false,
  },
  voyeur: {
    canManageUsers: false,
    canCreateDesigns: false,
    canEditDesigns: false,
    canDeleteDesigns: false,
    canCreatePlans: false,
    canEditPlans: false,
    canDeletePlans: false,
    canControlDashboard: false,
    canViewDashboard: true,
    canManageScapes: false,
  },
} as const;

// Room status enum
export const roomStatusEnum = pgEnum("room_status", ["waiting", "active", "paused", "completed"]);

// Device type enum
export const deviceTypeEnum = pgEnum("device_type", ["light", "sound", "prop", "sensor", "camera", "lock", "display"]);

// Rooms table for escape room instances
export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  designId: integer("design_id").references(() => escapeRoomDesigns.id),
  masterId: integer("master_id").references(() => users.id),
  status: roomStatusEnum("status").notNull().default("waiting"),
  modelPath: text("model_path"), // Path to 3D model file
  unityBuildPath: text("unity_build_path"), // Path to Unity WebGL build
  maxParticipants: integer("max_participants").notNull().default(6),
  currentParticipants: integer("current_participants").notNull().default(0),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  settings: jsonb("settings"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Room participants table
export const roomParticipants = pgTable("room_participants", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull().references(() => rooms.id),
  userId: integer("user_id").references(() => users.id),
  participantName: text("participant_name").notNull(),
  watchId: text("watch_id"), // AmazFit Active 2 device ID
  positionX: integer("position_x").default(0),
  positionY: integer("position_y").default(0),
  positionZ: integer("position_z").default(0),
  joinedAt: timestamp("joined_at").defaultNow(),
  leftAt: timestamp("left_at"),
  isActive: boolean("is_active").notNull().default(true),
});

// Biometric data table for real-time monitoring
export const biometricData = pgTable("biometric_data", {
  id: serial("id").primaryKey(),
  participantId: integer("participant_id").notNull().references(() => roomParticipants.id),
  heartRate: integer("heart_rate"), // BPM
  hrv: integer("hrv"), // Heart Rate Variability in ms
  stressLevel: integer("stress_level"), // 1-100 scale
  oxygenSaturation: integer("oxygen_saturation"), // SpO2 percentage
  skinTemperature: integer("skin_temperature"), // Temperature in Celsius * 100
  stepCount: integer("step_count"),
  caloriesBurned: integer("calories_burned"),
  batteryLevel: integer("battery_level"), // Watch battery percentage
  timestamp: timestamp("timestamp").defaultNow(),
});

// Room devices table
export const roomDevices = pgTable("room_devices", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull().references(() => rooms.id),
  name: text("name").notNull(),
  type: deviceTypeEnum("type").notNull(),
  location: jsonb("location"), // {x, y, z} coordinates
  status: text("status").notNull().default("offline"), // offline, online, active, error
  properties: jsonb("properties"), // device-specific properties
  lastUpdate: timestamp("last_update").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Room events table for logging
export const roomEvents = pgTable("room_events", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull().references(() => rooms.id),
  userId: integer("user_id").references(() => users.id),
  deviceId: integer("device_id").references(() => roomDevices.id),
  eventType: text("event_type").notNull(), // join, leave, device_action, puzzle_solve, etc.
  eventData: jsonb("event_data"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertEscapeRoomDesignSchema = createInsertSchema(escapeRoomDesigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBusinessPlanSchema = createInsertSchema(businessPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRoomSchema = createInsertSchema(rooms).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRoomParticipantSchema = createInsertSchema(roomParticipants).omit({
  id: true,
  joinedAt: true,
});

export const insertRoomDeviceSchema = createInsertSchema(roomDevices).omit({
  id: true,
  lastUpdate: true,
  createdAt: true,
});

export const insertBiometricDataSchema = createInsertSchema(biometricData).omit({
  id: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertEscapeRoomDesign = z.infer<typeof insertEscapeRoomDesignSchema>;
export type EscapeRoomDesign = typeof escapeRoomDesigns.$inferSelect;
export type InsertBusinessPlan = z.infer<typeof insertBusinessPlanSchema>;
export type BusinessPlan = typeof businessPlans.$inferSelect;
export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type Room = typeof rooms.$inferSelect;
export type InsertRoomParticipant = z.infer<typeof insertRoomParticipantSchema>;
export type RoomParticipant = typeof roomParticipants.$inferSelect;
export type InsertRoomDevice = z.infer<typeof insertRoomDeviceSchema>;
export type RoomDevice = typeof roomDevices.$inferSelect;
export type RoomEvent = typeof roomEvents.$inferSelect;
export type InsertBiometricData = z.infer<typeof insertBiometricDataSchema>;
export type BiometricData = typeof biometricData.$inferSelect;
