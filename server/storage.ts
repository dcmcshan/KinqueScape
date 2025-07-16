import { users, escapeRoomDesigns, businessPlans, type User, type InsertUser, type EscapeRoomDesign, type InsertEscapeRoomDesign, type BusinessPlan, type InsertBusinessPlan } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getEscapeRoomDesign(id: number): Promise<EscapeRoomDesign | undefined>;
  getEscapeRoomDesignsByUserId(userId: number): Promise<EscapeRoomDesign[]>;
  createEscapeRoomDesign(design: InsertEscapeRoomDesign): Promise<EscapeRoomDesign>;
  updateEscapeRoomDesign(id: number, design: Partial<InsertEscapeRoomDesign>): Promise<EscapeRoomDesign | undefined>;
  deleteEscapeRoomDesign(id: number): Promise<boolean>;
  
  getBusinessPlan(id: number): Promise<BusinessPlan | undefined>;
  getBusinessPlansByUserId(userId: number): Promise<BusinessPlan[]>;
  createBusinessPlan(plan: InsertBusinessPlan): Promise<BusinessPlan>;
  updateBusinessPlan(id: number, plan: Partial<InsertBusinessPlan>): Promise<BusinessPlan | undefined>;
  deleteBusinessPlan(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private escapeRoomDesigns: Map<number, EscapeRoomDesign>;
  private businessPlans: Map<number, BusinessPlan>;
  private currentUserId: number;
  private currentDesignId: number;
  private currentPlanId: number;

  constructor() {
    this.users = new Map();
    this.escapeRoomDesigns = new Map();
    this.businessPlans = new Map();
    this.currentUserId = 1;
    this.currentDesignId = 1;
    this.currentPlanId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
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
}

export const storage = new MemStorage();
