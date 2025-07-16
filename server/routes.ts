import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEscapeRoomDesignSchema, insertBusinessPlanSchema, loginSchema, registerSchema, rolePermissions, insertRoomSchema, insertRoomParticipantSchema, insertRoomDeviceSchema, insertBiometricDataSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import session from "express-session";
import { Request, Response, NextFunction } from "express";
import path from "path";

// Extend session type
declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

// Extended request type for authenticated requests
interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
    role: string;
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
  };
}

// Auth middleware
async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  const user = await storage.getUser(req.session.userId);
  if (!user || !user.isActive) {
    return res.status(401).json({ error: "User not found or inactive" });
  }
  
  req.user = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    profileImageUrl: user.profileImageUrl,
  };
  
  next();
}

// Role-based access control middleware
function requireRole(roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    
    next();
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || "kinquescape-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }));

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(data.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(data.email);
      if (existingEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);
      
      // Create user
      const user = await storage.createUser({
        username: data.username,
        email: data.email,
        password: hashedPassword,
        role: data.role || "participant",
        firstName: data.firstName,
        lastName: data.lastName,
        profileImageUrl: data.profileImageUrl,
      });
      
      // Create session
      req.session.userId = user.id;
      
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);
      
      // Find user
      const user = await storage.getUserByUsername(data.username);
      if (!user || !user.isActive) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Check password
      const isValid = await bcrypt.compare(data.password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Update last login
      await storage.updateUserLastLogin(user.id);
      
      // Create session
      req.session.userId = user.id;
      
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        permissions: rolePermissions[user.role as keyof typeof rolePermissions],
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", requireAuth, (req: AuthRequest, res) => {
    res.json({
      ...req.user,
      permissions: rolePermissions[req.user!.role as keyof typeof rolePermissions],
    });
  });

  // Admin routes
  app.get("/api/admin/users", requireAuth, requireRole(["admin"]), async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const safeUsers = users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      }));
      res.json(safeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.put("/api/admin/users/:id", requireAuth, requireRole(["admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { role, isActive } = req.body;
      
      const updateData: any = {};
      if (role) updateData.role = role;
      if (typeof isActive === 'boolean') updateData.isActive = isActive;
      
      const user = await storage.updateUser(id, updateData);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Escape Room Design routes - restricted to designers and admins
  app.get("/api/designs", requireAuth, requireRole(["designer", "admin"]), async (req: AuthRequest, res) => {
    try {
      const designs = await storage.getEscapeRoomDesignsByUserId(req.user!.id);
      res.json(designs);
    } catch (error) {
      console.error("Error fetching designs:", error);
      res.status(500).json({ error: "Failed to fetch designs" });
    }
  });

  app.get("/api/designs/:id", requireAuth, requireRole(["designer", "admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const design = await storage.getEscapeRoomDesign(id);
      
      if (!design) {
        return res.status(404).json({ error: "Design not found" });
      }
      
      res.json(design);
    } catch (error) {
      console.error("Error fetching design:", error);
      res.status(500).json({ error: "Failed to fetch design" });
    }
  });

  app.post("/api/designs", requireAuth, requireRole(["designer", "admin"]), async (req: AuthRequest, res) => {
    try {
      const data = insertEscapeRoomDesignSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });
      
      const design = await storage.createEscapeRoomDesign(data);
      res.status(201).json(design);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid design data", details: error.errors });
      }
      console.error("Error creating design:", error);
      res.status(500).json({ error: "Failed to create design" });
    }
  });

  app.put("/api/designs/:id", requireAuth, requireRole(["designer", "admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertEscapeRoomDesignSchema.partial().parse(req.body);
      
      const design = await storage.updateEscapeRoomDesign(id, data);
      
      if (!design) {
        return res.status(404).json({ error: "Design not found" });
      }
      
      res.json(design);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid design data", details: error.errors });
      }
      console.error("Error updating design:", error);
      res.status(500).json({ error: "Failed to update design" });
    }
  });

  app.delete("/api/designs/:id", requireAuth, requireRole(["designer", "admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteEscapeRoomDesign(id);
      
      if (!success) {
        return res.status(404).json({ error: "Design not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting design:", error);
      res.status(500).json({ error: "Failed to delete design" });
    }
  });

  // Business Plan routes - restricted to designers and admins
  app.get("/api/plans", requireAuth, requireRole(["designer", "admin"]), async (req: AuthRequest, res) => {
    try {
      const plans = await storage.getBusinessPlansByUserId(req.user!.id);
      res.json(plans);
    } catch (error) {
      console.error("Error fetching plans:", error);
      res.status(500).json({ error: "Failed to fetch plans" });
    }
  });

  app.get("/api/plans/:id", requireAuth, requireRole(["designer", "admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const plan = await storage.getBusinessPlan(id);
      
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }
      
      res.json(plan);
    } catch (error) {
      console.error("Error fetching plan:", error);
      res.status(500).json({ error: "Failed to fetch plan" });
    }
  });

  app.post("/api/plans", requireAuth, requireRole(["designer", "admin"]), async (req: AuthRequest, res) => {
    try {
      const data = insertBusinessPlanSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });
      
      const plan = await storage.createBusinessPlan(data);
      res.status(201).json(plan);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid plan data", details: error.errors });
      }
      console.error("Error creating plan:", error);
      res.status(500).json({ error: "Failed to create plan" });
    }
  });

  app.put("/api/plans/:id", requireAuth, requireRole(["designer", "admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertBusinessPlanSchema.partial().parse(req.body);
      
      const plan = await storage.updateBusinessPlan(id, data);
      
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }
      
      res.json(plan);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid plan data", details: error.errors });
      }
      console.error("Error updating plan:", error);
      res.status(500).json({ error: "Failed to update plan" });
    }
  });

  app.delete("/api/plans/:id", requireAuth, requireRole(["designer", "admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBusinessPlan(id);
      
      if (!success) {
        return res.status(404).json({ error: "Plan not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting plan:", error);
      res.status(500).json({ error: "Failed to delete plan" });
    }
  });

  // Dashboard routes - restricted to masters, voyeurs, and admins
  app.get("/api/dashboard", requireAuth, requireRole(["master", "voyeur", "admin"]), (req: AuthRequest, res) => {
    res.json({
      message: "Dashboard access granted",
      user: req.user,
      permissions: rolePermissions[req.user!.role as keyof typeof rolePermissions],
    });
  });

  // Room management routes
  app.get("/api/rooms", requireAuth, requireRole(["master", "admin"]), async (req: AuthRequest, res) => {
    try {
      const rooms = await storage.getRoomsByMasterId(req.user!.id);
      res.json(rooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      res.status(500).json({ error: "Failed to fetch rooms" });
    }
  });

  app.get("/api/rooms/:slug", async (req, res) => {
    try {
      const room = await storage.getRoomBySlug(req.params.slug);
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }
      res.json(room);
    } catch (error) {
      console.error("Error fetching room:", error);
      res.status(500).json({ error: "Failed to fetch room" });
    }
  });

  app.post("/api/rooms", requireAuth, requireRole(["master", "admin"]), async (req: AuthRequest, res) => {
    try {
      const data = insertRoomSchema.parse({
        ...req.body,
        masterId: req.user!.id,
      });
      const room = await storage.createRoom(data);
      res.status(201).json(room);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid room data", details: error.errors });
      }
      console.error("Error creating room:", error);
      res.status(500).json({ error: "Failed to create room" });
    }
  });

  app.put("/api/rooms/:id", requireAuth, requireRole(["master", "admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertRoomSchema.partial().parse(req.body);
      const room = await storage.updateRoom(id, data);
      
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }
      
      res.json(room);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid room data", details: error.errors });
      }
      console.error("Error updating room:", error);
      res.status(500).json({ error: "Failed to update room" });
    }
  });

  // Room participants routes
  app.get("/api/rooms/:roomId/participants", async (req, res) => {
    try {
      const roomId = parseInt(req.params.roomId);
      const participants = await storage.getRoomParticipants(roomId);
      res.json(participants);
    } catch (error) {
      console.error("Error fetching participants:", error);
      res.status(500).json({ error: "Failed to fetch participants" });
    }
  });

  app.post("/api/rooms/:roomId/participants", async (req, res) => {
    try {
      const roomId = parseInt(req.params.roomId);
      const data = insertRoomParticipantSchema.parse({
        ...req.body,
        roomId,
      });
      const participant = await storage.addRoomParticipant(data);
      
      // Log join event
      await storage.createRoomEvent({
        roomId,
        userId: data.userId || null,
        deviceId: null,
        eventType: "join",
        eventData: { participantName: data.participantName },
        timestamp: new Date(),
      });
      
      res.status(201).json(participant);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid participant data", details: error.errors });
      }
      console.error("Error adding participant:", error);
      res.status(500).json({ error: "Failed to add participant" });
    }
  });

  app.delete("/api/rooms/:roomId/participants/:participantId", async (req, res) => {
    try {
      const participantId = parseInt(req.params.participantId);
      const roomId = parseInt(req.params.roomId);
      
      const success = await storage.removeRoomParticipant(participantId);
      if (!success) {
        return res.status(404).json({ error: "Participant not found" });
      }
      
      // Log leave event
      await storage.createRoomEvent({
        roomId,
        userId: null,
        deviceId: null,
        eventType: "leave",
        eventData: { participantId },
        timestamp: new Date(),
      });
      
      res.status(204).send();
    } catch (error) {
      console.error("Error removing participant:", error);
      res.status(500).json({ error: "Failed to remove participant" });
    }
  });

  // Room devices routes
  app.get("/api/rooms/:roomId/devices", async (req, res) => {
    try {
      const roomId = parseInt(req.params.roomId);
      const devices = await storage.getRoomDevices(roomId);
      res.json(devices);
    } catch (error) {
      console.error("Error fetching devices:", error);
      res.status(500).json({ error: "Failed to fetch devices" });
    }
  });

  app.put("/api/rooms/:roomId/devices/:deviceId", requireAuth, requireRole(["master", "admin"]), async (req: AuthRequest, res) => {
    try {
      const deviceId = parseInt(req.params.deviceId);
      const roomId = parseInt(req.params.roomId);
      const { status, properties } = req.body;
      
      const device = await storage.updateRoomDevice(deviceId, { status, properties });
      if (!device) {
        return res.status(404).json({ error: "Device not found" });
      }
      
      // Log device action event
      await storage.createRoomEvent({
        roomId,
        userId: req.user!.id,
        deviceId,
        eventType: "device_action",
        eventData: { action: "update", status, properties },
        timestamp: new Date(),
      });
      
      res.json(device);
    } catch (error) {
      console.error("Error updating device:", error);
      res.status(500).json({ error: "Failed to update device" });
    }
  });

  // Room events routes
  app.get("/api/rooms/:roomId/events", requireAuth, requireRole(["master", "admin"]), async (req, res) => {
    try {
      const roomId = parseInt(req.params.roomId);
      const events = await storage.getRoomEvents(roomId);
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  // Add demo participant
  app.post("/api/rooms/:roomId/participants/demo", async (req, res) => {
    try {
      const roomId = parseInt(req.params.roomId);
      const participant = await storage.addDemoParticipant(roomId);
      res.json(participant);
    } catch (error) {
      console.error("Error adding demo participant:", error);
      res.status(500).json({ error: "Failed to add demo participant" });
    }
  });

  // Simulate biometric data for participant
  app.post("/api/rooms/:roomId/participants/:participantId/simulate-biometrics", async (req, res) => {
    try {
      const roomId = parseInt(req.params.roomId);
      const participantId = parseInt(req.params.participantId);
      
      // Generate realistic biometric data with escape room stress simulation
      const baseHeartRate = 75 + Math.random() * 20; // 75-95 base
      const stressMultiplier = 1 + Math.random() * 0.5; // 1.0-1.5x stress
      const heartRate = baseHeartRate * stressMultiplier;
      
      const hrv = Math.max(15, 50 - (heartRate - 75) * 0.5); // Lower HRV = higher stress
      const oxygenSaturation = 96 + Math.random() * 4; // 96-100%
      const skinTemperature = 3600 + Math.random() * 200; // 36-38°C * 100
      const stepCount = Math.floor(Math.random() * 50) + 10; // 10-60 steps
      const caloriesBurned = Math.floor(stepCount * 0.04); // ~0.04 cal per step
      const batteryLevel = Math.max(20, 100 - Math.random() * 30); // 70-100%
      
      const biometricData = await storage.createBiometricData({
        participantId,
        heartRate: Math.round(heartRate),
        hrv: Math.round(hrv),
        stressLevel: Math.min(100, Math.round((heartRate - 60) * 1.5)), // Stress scale 1-100
        oxygenSaturation: Math.round(oxygenSaturation),
        skinTemperature: Math.round(skinTemperature),
        stepCount,
        caloriesBurned,
        batteryLevel: Math.round(batteryLevel),
      });
      
      res.json(biometricData);
    } catch (error) {
      console.error("Error simulating biometric data:", error);
      res.status(500).json({ error: "Failed to simulate biometric data" });
    }
  });

  // Biometric data routes
  app.get("/api/participants/:participantId/biometrics", async (req, res) => {
    try {
      const participantId = parseInt(req.params.participantId);
      const data = await storage.getBiometricData(participantId);
      res.json(data);
    } catch (error) {
      console.error("Error fetching biometric data:", error);
      res.status(500).json({ error: "Failed to fetch biometric data" });
    }
  });

  app.get("/api/participants/:participantId/biometrics/latest", async (req, res) => {
    try {
      const participantId = parseInt(req.params.participantId);
      const data = await storage.getLatestBiometricData(participantId);
      res.json(data || null);
    } catch (error) {
      console.error("Error fetching latest biometric data:", error);
      res.status(500).json({ error: "Failed to fetch latest biometric data" });
    }
  });

  app.post("/api/participants/:participantId/biometrics", async (req, res) => {
    try {
      const participantId = parseInt(req.params.participantId);
      const data = insertBiometricDataSchema.parse({
        ...req.body,
        participantId,
      });
      const biometricData = await storage.createBiometricData(data);
      res.status(201).json(biometricData);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid biometric data", details: error.errors });
      }
      console.error("Error creating biometric data:", error);
      res.status(500).json({ error: "Failed to create biometric data" });
    }
  });

  app.get("/api/rooms/:roomId/biometrics", async (req, res) => {
    try {
      const roomId = parseInt(req.params.roomId);
      const data = await storage.getBiometricDataByRoom(roomId);
      res.json(data);
    } catch (error) {
      console.error("Error fetching room biometric data:", error);
      res.status(500).json({ error: "Failed to fetch room biometric data" });
    }
  });

  // Scape management routes - restricted to masters and admins
  app.get("/api/scapes", requireAuth, requireRole(["master", "admin"]), async (req: AuthRequest, res) => {
    try {
      // For now, return designs as scapes - this can be expanded later
      const designs = await storage.getEscapeRoomDesignsByUserId(req.user!.id);
      res.json(designs);
    } catch (error) {
      console.error("Error fetching scapes:", error);
      res.status(500).json({ error: "Failed to fetch scapes" });
    }
  });

  // GLB mesh data endpoint for Unity
  app.get("/api/glb-mesh", async (req, res) => {
    try {
      const { GLBProcessor } = await import('./glb-processor');
      const processor = new GLBProcessor();
      
      const glbPath = path.join(process.cwd(), 'public', 'unity-build', '7_16_2025.glb');
      console.log(`Processing GLB file at: ${glbPath}`);
      
      const meshData = await processor.processGLBFile(glbPath);
      
      console.log(`Sending mesh data: ${meshData.meshes.length} meshes`);
      res.json(meshData);
    } catch (error) {
      console.error("Error processing GLB file:", error);
      res.status(500).json({ error: "Failed to process GLB file", details: error.message });
    }
  });

  const httpServer = createServer(app);
  
  // Start automatic biometric simulation
  startBiometricSimulation();
  
  return httpServer;
}

// Automatic biometric simulation function
async function startBiometricSimulation() {
  setInterval(async () => {
    try {
      // Get all active participants from all rooms
      const rooms = await storage.getRoomsByMasterId(1); // Use master user ID 1
      for (const room of rooms) {
        const participants = await storage.getRoomParticipants(room.id);
        
        for (const participant of participants) {
          if (participant.isActive) {
            // Generate realistic biometric data with escape room stress simulation
            const baseHeartRate = 75 + Math.random() * 20; // 75-95 base
            const stressMultiplier = 1 + Math.random() * 0.3; // 1.0-1.3x stress
            const heartRate = baseHeartRate * stressMultiplier;
            
            const hrv = Math.max(15, 50 - (heartRate - 75) * 0.5); // Lower HRV = higher stress
            const oxygenSaturation = 96 + Math.random() * 4; // 96-100%
            const skinTemperature = 3600 + Math.random() * 200; // 36-38°C * 100
            const stepCount = Math.floor(Math.random() * 10) + 1; // 1-10 steps per interval
            const caloriesBurned = Math.floor(stepCount * 0.04); // ~0.04 cal per step
            const batteryLevel = Math.max(20, 100 - Math.random() * 2); // Slow battery drain
            
            await storage.createBiometricData({
              participantId: participant.id,
              heartRate: Math.round(heartRate),
              hrv: Math.round(hrv),
              stressLevel: Math.min(100, Math.round((heartRate - 60) * 1.5)), // Stress scale 1-100
              oxygenSaturation: Math.round(oxygenSaturation),
              skinTemperature: Math.round(skinTemperature),
              stepCount,
              caloriesBurned,
              batteryLevel: Math.round(batteryLevel),
            });
          }
        }
      }
    } catch (error) {
      console.error("Error in biometric simulation:", error);
    }
  }, 3000); // Update every 3 seconds
}