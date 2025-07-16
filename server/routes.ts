import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEscapeRoomDesignSchema, insertBusinessPlanSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Escape Room Design routes
  app.get("/api/designs", async (req, res) => {
    try {
      // For demo purposes, using userId 1
      const designs = await storage.getEscapeRoomDesignsByUserId(1);
      res.json(designs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch designs" });
    }
  });

  app.get("/api/designs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const design = await storage.getEscapeRoomDesign(id);
      
      if (!design) {
        return res.status(404).json({ message: "Design not found" });
      }
      
      res.json(design);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch design" });
    }
  });

  app.post("/api/designs", async (req, res) => {
    try {
      const validatedData = insertEscapeRoomDesignSchema.parse({
        ...req.body,
        userId: 1 // For demo purposes
      });
      
      const design = await storage.createEscapeRoomDesign(validatedData);
      res.status(201).json(design);
    } catch (error) {
      res.status(400).json({ message: "Invalid design data" });
    }
  });

  app.put("/api/designs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertEscapeRoomDesignSchema.partial().parse(req.body);
      
      const design = await storage.updateEscapeRoomDesign(id, validatedData);
      
      if (!design) {
        return res.status(404).json({ message: "Design not found" });
      }
      
      res.json(design);
    } catch (error) {
      res.status(400).json({ message: "Invalid design data" });
    }
  });

  app.delete("/api/designs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteEscapeRoomDesign(id);
      
      if (!success) {
        return res.status(404).json({ message: "Design not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete design" });
    }
  });

  // Business Plan routes
  app.get("/api/plans", async (req, res) => {
    try {
      // For demo purposes, using userId 1
      const plans = await storage.getBusinessPlansByUserId(1);
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch plans" });
    }
  });

  app.get("/api/plans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const plan = await storage.getBusinessPlan(id);
      
      if (!plan) {
        return res.status(404).json({ message: "Plan not found" });
      }
      
      res.json(plan);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch plan" });
    }
  });

  app.post("/api/plans", async (req, res) => {
    try {
      const validatedData = insertBusinessPlanSchema.parse({
        ...req.body,
        userId: 1 // For demo purposes
      });
      
      const plan = await storage.createBusinessPlan(validatedData);
      res.status(201).json(plan);
    } catch (error) {
      res.status(400).json({ message: "Invalid plan data" });
    }
  });

  app.put("/api/plans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertBusinessPlanSchema.partial().parse(req.body);
      
      const plan = await storage.updateBusinessPlan(id, validatedData);
      
      if (!plan) {
        return res.status(404).json({ message: "Plan not found" });
      }
      
      res.json(plan);
    } catch (error) {
      res.status(400).json({ message: "Invalid plan data" });
    }
  });

  app.delete("/api/plans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBusinessPlan(id);
      
      if (!success) {
        return res.status(404).json({ message: "Plan not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete plan" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
