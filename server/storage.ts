import { users, escapeRoomDesigns, businessPlans, rooms, roomParticipants, roomDevices, roomEvents, biometricData, type User, type InsertUser, type EscapeRoomDesign, type InsertEscapeRoomDesign, type BusinessPlan, type InsertBusinessPlan, type Room, type InsertRoom, type RoomParticipant, type InsertRoomParticipant, type RoomDevice, type InsertRoomDevice, type RoomEvent, type BiometricData, type InsertBiometricData } from "@shared/schema";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser> & { isActive?: boolean }): Promise<User | undefined>;
  updateUserLastLogin(id: number): Promise<void>;
  getUsersByRole(role: string): Promise<User[]>;
  getAllUsers(): Promise<User[]>;
  
  // Escape room designs
  getEscapeRoomDesign(id: number): Promise<EscapeRoomDesign | undefined>;
  getEscapeRoomDesignsByUserId(userId: number): Promise<EscapeRoomDesign[]>;
  createEscapeRoomDesign(design: InsertEscapeRoomDesign): Promise<EscapeRoomDesign>;
  updateEscapeRoomDesign(id: number, design: Partial<InsertEscapeRoomDesign>): Promise<EscapeRoomDesign | undefined>;
  deleteEscapeRoomDesign(id: number): Promise<boolean>;
  
  // Business plans
  getBusinessPlan(id: number): Promise<BusinessPlan | undefined>;
  getBusinessPlansByUserId(userId: number): Promise<BusinessPlan[]>;
  createBusinessPlan(plan: InsertBusinessPlan): Promise<BusinessPlan>;
  updateBusinessPlan(id: number, plan: Partial<InsertBusinessPlan>): Promise<BusinessPlan | undefined>;
  deleteBusinessPlan(id: number): Promise<boolean>;
  
  // Room management
  getRoom(id: number): Promise<Room | undefined>;
  getRoomBySlug(slug: string): Promise<Room | undefined>;
  getRoomsByMasterId(masterId: number): Promise<Room[]>;
  createRoom(room: InsertRoom): Promise<Room>;
  updateRoom(id: number, room: Partial<InsertRoom>): Promise<Room | undefined>;
  deleteRoom(id: number): Promise<boolean>;
  
  // Room participants
  getRoomParticipants(roomId: number): Promise<RoomParticipant[]>;
  addRoomParticipant(participant: InsertRoomParticipant): Promise<RoomParticipant>;
  updateRoomParticipant(id: number, participant: Partial<InsertRoomParticipant>): Promise<RoomParticipant | undefined>;
  removeRoomParticipant(id: number): Promise<boolean>;
  
  // Room devices
  getRoomDevices(roomId: number): Promise<RoomDevice[]>;
  getRoomDevice(id: number): Promise<RoomDevice | undefined>;
  createRoomDevice(device: InsertRoomDevice): Promise<RoomDevice>;
  updateRoomDevice(id: number, device: Partial<InsertRoomDevice>): Promise<RoomDevice | undefined>;
  deleteRoomDevice(id: number): Promise<boolean>;
  
  // Room events
  getRoomEvents(roomId: number): Promise<RoomEvent[]>;
  createRoomEvent(event: Omit<RoomEvent, 'id'>): Promise<RoomEvent>;
  
  // Biometric data
  getBiometricData(participantId: number): Promise<BiometricData[]>;
  getLatestBiometricData(participantId: number): Promise<BiometricData | undefined>;
  createBiometricData(data: InsertBiometricData): Promise<BiometricData>;
  getBiometricDataByRoom(roomId: number): Promise<BiometricData[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private escapeRoomDesigns: Map<number, EscapeRoomDesign>;
  private businessPlans: Map<number, BusinessPlan>;
  private rooms: Map<number, Room>;
  private roomParticipants: Map<number, RoomParticipant>;
  private roomDevices: Map<number, RoomDevice>;
  private roomEvents: Map<number, RoomEvent>;
  private biometricData: Map<number, BiometricData>;
  private currentUserId: number;
  private currentDesignId: number;
  private currentPlanId: number;
  private currentRoomId: number;
  private currentParticipantId: number;
  private currentDeviceId: number;
  private currentEventId: number;
  private currentBiometricId: number;

  constructor() {
    this.users = new Map();
    this.escapeRoomDesigns = new Map();
    this.businessPlans = new Map();
    this.rooms = new Map();
    this.roomParticipants = new Map();
    this.roomDevices = new Map();
    this.roomEvents = new Map();
    this.biometricData = new Map();
    this.currentUserId = 1;
    this.currentDesignId = 1;
    this.currentPlanId = 1;
    this.currentRoomId = 1;
    this.currentParticipantId = 1;
    this.currentDeviceId = 1;
    this.currentEventId = 1;
    this.currentBiometricId = 1;
    
    // Initialize demo dungeon room
    this.initializeDemoRoom();
  }
  
  private initializeDemoRoom() {
    const now = new Date();
    const dungeonRoom: Room = {
      id: 1,
      name: "Dungeon Demo",
      slug: "dungeon",
      designId: null,
      masterId: 1,
      status: "waiting",
      modelPath: "/assets/7_16_2025.glb",
      unityBuildPath: "/unity/dungeon",
      maxParticipants: 6,
      currentParticipants: 0,
      startTime: null,
      endTime: null,
      settings: {
        lighting: { ambient: 0.3, directional: 0.7 },
        audio: { volume: 0.8, ambient: true },
        interaction: { enabled: true, haptics: false }
      },
      createdAt: now,
      updatedAt: now,
    };
    
    this.rooms.set(1, dungeonRoom);
    this.currentRoomId = 2;
    
    // Add demo devices including torture devices
    const devices = [
      { name: "Main Door Lock", type: "lock", location: { x: 0, y: 0, z: 5 } },
      { name: "Torch Light 1", type: "light", location: { x: -2, y: 2, z: 0 } },
      { name: "Torch Light 2", type: "light", location: { x: 2, y: 2, z: 0 } },
      { name: "Ambient Sound", type: "sound", location: { x: 0, y: 3, z: 0 } },
      { name: "Security Camera", type: "camera", location: { x: 0, y: 4, z: 0 } },
      { name: "Iron Maiden", type: "prop", location: { x: -3, y: 0, z: -2 } },
      { name: "Torture Rack", type: "prop", location: { x: 3, y: 0, z: -2 } },
      { name: "Guillotine", type: "prop", location: { x: 0, y: 0, z: -4 } },
      { name: "Chains & Shackles", type: "prop", location: { x: -2, y: 0, z: 2 } },
      { name: "Dungeon Wheel", type: "prop", location: { x: 2, y: 0, z: 2 } },
      { name: "Skull Display", type: "prop", location: { x: -1, y: 1, z: -1 } },
      { name: "Cauldron", type: "prop", location: { x: 1, y: 0, z: -1 } },
      { name: "Coffin", type: "prop", location: { x: 0, y: 0, z: 0 } },
      { name: "Pressure Plate", type: "sensor", location: { x: 0, y: 0, z: 1 } },
      { name: "Spike Trap", type: "prop", location: { x: -1, y: 0, z: 3 } },
      { name: "Pendulum", type: "prop", location: { x: 1, y: 2, z: 1 } },
      { name: "Cage", type: "prop", location: { x: 2, y: 0, z: 0 } },
      { name: "Executioner's Block", type: "prop", location: { x: -2, y: 0, z: 0 } },
      { name: "Torture Chamber Sound", type: "sound", location: { x: 0, y: 1, z: -2 } },
      { name: "Flickering Torch", type: "light", location: { x: 0, y: 2, z: -3 } },
    ];
    
    devices.forEach((device, index) => {
      const roomDevice: RoomDevice = {
        id: index + 1,
        roomId: 1,
        name: device.name,
        type: device.type as any,
        location: device.location,
        status: "online",
        properties: {},
        lastUpdate: now,
        createdAt: now,
      };
      this.roomDevices.set(index + 1, roomDevice);
    });
    
    this.currentDeviceId = devices.length + 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async updateUser(id: number, updateData: Partial<InsertUser> & { isActive?: boolean }): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const now = new Date();
    const updated: User = { 
      ...user, 
      ...updateData,
      updatedAt: now
    };
    this.users.set(id, updated);
    return updated;
  }

  async updateUserLastLogin(id: number): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.lastLogin = new Date();
      user.updatedAt = new Date();
      this.users.set(id, user);
    }
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.role === role,
    );
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { 
      id,
      username: insertUser.username,
      email: insertUser.email,
      password: insertUser.password,
      role: insertUser.role || "participant",
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      profileImageUrl: insertUser.profileImageUrl || null,
      isActive: true,
      lastLogin: null,
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async getEscapeRoomDesign(id: number): Promise<EscapeRoomDesign | undefined> {
    return this.escapeRoomDesigns.get(id);
  }

  async getEscapeRoomDesignsByUserId(userId: number): Promise<EscapeRoomDesign[]> {
    return Array.from(this.escapeRoomDesigns.values()).filter(
      (design) => design.userId === userId,
    );
  }

  async createEscapeRoomDesign(insertDesign: InsertEscapeRoomDesign): Promise<EscapeRoomDesign> {
    const id = this.currentDesignId++;
    const now = new Date();
    const design: EscapeRoomDesign = { 
      ...insertDesign, 
      id, 
      createdAt: now,
      updatedAt: now,
      backstory: insertDesign.backstory || null,
      victoryCondition: insertDesign.victoryCondition || null,
      layout: insertDesign.layout || null,
      puzzles: insertDesign.puzzles || null,
      props: insertDesign.props || null,
      atmosphere: insertDesign.atmosphere || null
    };
    this.escapeRoomDesigns.set(id, design);
    return design;
  }

  async updateEscapeRoomDesign(id: number, updateData: Partial<InsertEscapeRoomDesign>): Promise<EscapeRoomDesign | undefined> {
    const existing = this.escapeRoomDesigns.get(id);
    if (!existing) return undefined;
    
    const updated: EscapeRoomDesign = { 
      ...existing, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.escapeRoomDesigns.set(id, updated);
    return updated;
  }

  async deleteEscapeRoomDesign(id: number): Promise<boolean> {
    return this.escapeRoomDesigns.delete(id);
  }

  async getBusinessPlan(id: number): Promise<BusinessPlan | undefined> {
    return this.businessPlans.get(id);
  }

  async getBusinessPlansByUserId(userId: number): Promise<BusinessPlan[]> {
    return Array.from(this.businessPlans.values()).filter(
      (plan) => plan.userId === userId,
    );
  }

  async createBusinessPlan(insertPlan: InsertBusinessPlan): Promise<BusinessPlan> {
    const id = this.currentPlanId++;
    const now = new Date();
    const plan: BusinessPlan = { 
      ...insertPlan, 
      id, 
      createdAt: now,
      updatedAt: now,
      location: insertPlan.location || null,
      missionStatement: insertPlan.missionStatement || null,
      targetMarket: insertPlan.targetMarket || null,
      revenueStreams: insertPlan.revenueStreams || null,
      expenses: insertPlan.expenses || null,
      marketingStrategy: insertPlan.marketingStrategy || null,
      operations: insertPlan.operations || null,
      timeline: insertPlan.timeline || null,
      financialProjections: insertPlan.financialProjections || null
    };
    this.businessPlans.set(id, plan);
    return plan;
  }

  async updateBusinessPlan(id: number, updateData: Partial<InsertBusinessPlan>): Promise<BusinessPlan | undefined> {
    const existing = this.businessPlans.get(id);
    if (!existing) return undefined;
    
    const updated: BusinessPlan = { 
      ...existing, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.businessPlans.set(id, updated);
    return updated;
  }

  async deleteBusinessPlan(id: number): Promise<boolean> {
    return this.businessPlans.delete(id);
  }

  // Room management methods
  async getRoom(id: number): Promise<Room | undefined> {
    return this.rooms.get(id);
  }

  async getRoomBySlug(slug: string): Promise<Room | undefined> {
    return Array.from(this.rooms.values()).find(room => room.slug === slug);
  }

  async getRoomsByMasterId(masterId: number): Promise<Room[]> {
    return Array.from(this.rooms.values()).filter(room => room.masterId === masterId);
  }

  async createRoom(insertRoom: InsertRoom): Promise<Room> {
    const id = this.currentRoomId++;
    const now = new Date();
    const room: Room = {
      id,
      name: insertRoom.name,
      slug: insertRoom.slug,
      designId: insertRoom.designId || null,
      masterId: insertRoom.masterId || null,
      status: insertRoom.status || "waiting",
      modelPath: insertRoom.modelPath || null,
      unityBuildPath: insertRoom.unityBuildPath || null,
      maxParticipants: insertRoom.maxParticipants || 6,
      currentParticipants: insertRoom.currentParticipants || 0,
      startTime: insertRoom.startTime || null,
      endTime: insertRoom.endTime || null,
      settings: insertRoom.settings || null,
      createdAt: now,
      updatedAt: now,
    };
    this.rooms.set(id, room);
    return room;
  }

  async updateRoom(id: number, updateData: Partial<InsertRoom>): Promise<Room | undefined> {
    const room = this.rooms.get(id);
    if (!room) return undefined;

    const now = new Date();
    const updated: Room = {
      ...room,
      ...updateData,
      updatedAt: now,
    };
    this.rooms.set(id, updated);
    return updated;
  }

  async deleteRoom(id: number): Promise<boolean> {
    return this.rooms.delete(id);
  }

  // Room participants methods
  async getRoomParticipants(roomId: number): Promise<RoomParticipant[]> {
    return Array.from(this.roomParticipants.values()).filter(
      participant => participant.roomId === roomId
    );
  }

  async addRoomParticipant(insertParticipant: InsertRoomParticipant): Promise<RoomParticipant> {
    const id = this.currentParticipantId++;
    const now = new Date();
    const participant: RoomParticipant = {
      id,
      roomId: insertParticipant.roomId,
      userId: insertParticipant.userId || null,
      participantName: insertParticipant.participantName,
      watchId: insertParticipant.watchId || null,
      positionX: insertParticipant.positionX || 0,
      positionY: insertParticipant.positionY || 0,
      positionZ: insertParticipant.positionZ || 0,
      joinedAt: now,
      leftAt: null,
      isActive: true,
    };
    this.roomParticipants.set(id, participant);
    
    // Update room participant count
    const room = this.rooms.get(insertParticipant.roomId);
    if (room) {
      room.currentParticipants++;
      this.rooms.set(room.id, room);
    }
    
    return participant;
  }

  async updateRoomParticipant(id: number, updateData: Partial<InsertRoomParticipant>): Promise<RoomParticipant | undefined> {
    const participant = this.roomParticipants.get(id);
    if (!participant) return undefined;

    const updated: RoomParticipant = {
      ...participant,
      ...updateData,
    };
    this.roomParticipants.set(id, updated);
    return updated;
  }

  async removeRoomParticipant(id: number): Promise<boolean> {
    const participant = this.roomParticipants.get(id);
    if (!participant) return false;

    // Update room participant count
    const room = this.rooms.get(participant.roomId);
    if (room && room.currentParticipants > 0) {
      room.currentParticipants--;
      this.rooms.set(room.id, room);
    }

    return this.roomParticipants.delete(id);
  }

  // Room devices methods
  async getRoomDevices(roomId: number): Promise<RoomDevice[]> {
    return Array.from(this.roomDevices.values()).filter(
      device => device.roomId === roomId
    );
  }

  async getRoomDevice(id: number): Promise<RoomDevice | undefined> {
    return this.roomDevices.get(id);
  }

  async createRoomDevice(insertDevice: InsertRoomDevice): Promise<RoomDevice> {
    const id = this.currentDeviceId++;
    const now = new Date();
    const device: RoomDevice = {
      id,
      roomId: insertDevice.roomId,
      name: insertDevice.name,
      type: insertDevice.type,
      location: insertDevice.location || null,
      status: insertDevice.status || "offline",
      properties: insertDevice.properties || null,
      lastUpdate: now,
      createdAt: now,
    };
    this.roomDevices.set(id, device);
    return device;
  }

  async updateRoomDevice(id: number, updateData: Partial<InsertRoomDevice>): Promise<RoomDevice | undefined> {
    const device = this.roomDevices.get(id);
    if (!device) return undefined;

    const now = new Date();
    const updated: RoomDevice = {
      ...device,
      ...updateData,
      lastUpdate: now,
    };
    this.roomDevices.set(id, updated);
    return updated;
  }

  async deleteRoomDevice(id: number): Promise<boolean> {
    return this.roomDevices.delete(id);
  }

  // Room events methods
  async getRoomEvents(roomId: number): Promise<RoomEvent[]> {
    return Array.from(this.roomEvents.values()).filter(
      event => event.roomId === roomId
    );
  }

  async createRoomEvent(insertEvent: Omit<RoomEvent, 'id'>): Promise<RoomEvent> {
    const id = this.currentEventId++;
    const event: RoomEvent = {
      id,
      ...insertEvent,
    };
    this.roomEvents.set(id, event);
    return event;
  }

  // Biometric data methods
  async getBiometricData(participantId: number): Promise<BiometricData[]> {
    return Array.from(this.biometricData.values()).filter(
      data => data.participantId === participantId
    );
  }

  async getLatestBiometricData(participantId: number): Promise<BiometricData | undefined> {
    const data = await this.getBiometricData(participantId);
    return data.sort((a, b) => b.timestamp!.getTime() - a.timestamp!.getTime())[0];
  }

  async createBiometricData(insertData: InsertBiometricData): Promise<BiometricData> {
    const id = this.currentBiometricId++;
    const data: BiometricData = {
      id,
      participantId: insertData.participantId,
      heartRate: insertData.heartRate || null,
      hrv: insertData.hrv || null,
      stressLevel: insertData.stressLevel || null,
      oxygenSaturation: insertData.oxygenSaturation || null,
      skinTemperature: insertData.skinTemperature || null,
      stepCount: insertData.stepCount || null,
      caloriesBurned: insertData.caloriesBurned || null,
      batteryLevel: insertData.batteryLevel || null,
      timestamp: new Date(),
    };
    this.biometricData.set(id, data);
    return data;
  }

  async getBiometricDataByRoom(roomId: number): Promise<BiometricData[]> {
    const participants = await this.getRoomParticipants(roomId);
    const participantIds = participants.map(p => p.id);
    return Array.from(this.biometricData.values()).filter(
      data => participantIds.includes(data.participantId)
    );
  }
}

export const storage = new MemStorage();
