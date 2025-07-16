import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
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
  password: true,
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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertEscapeRoomDesign = z.infer<typeof insertEscapeRoomDesignSchema>;
export type EscapeRoomDesign = typeof escapeRoomDesigns.$inferSelect;
export type InsertBusinessPlan = z.infer<typeof insertBusinessPlanSchema>;
export type BusinessPlan = typeof businessPlans.$inferSelect;
