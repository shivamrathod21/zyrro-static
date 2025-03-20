import { 
  users, 
  type User, 
  type InsertUser, 
  type Booking, 
  type InsertBooking,
  type PortfolioItem,
  type InsertPortfolioItem,
  type Creator,
  type InsertCreator,
  type Testimonial,
  type InsertTestimonial
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Booking methods
  getBookings(): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking & { status: string, createdAt: string }): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;
  
  // Portfolio methods
  getPortfolioItems(): Promise<PortfolioItem[]>;
  getPortfolioItem(id: number): Promise<PortfolioItem | undefined>;
  createPortfolioItem(item: InsertPortfolioItem & { createdAt: string }): Promise<PortfolioItem>;
  updatePortfolioItem(id: number, item: Partial<InsertPortfolioItem>): Promise<PortfolioItem | undefined>;
  deletePortfolioItem(id: number): Promise<boolean>;
  
  // Creator methods
  getCreators(): Promise<Creator[]>;
  getCreator(id: number): Promise<Creator | undefined>;
  createCreator(creator: InsertCreator & { createdAt: string }): Promise<Creator>;
  updateCreator(id: number, creator: Partial<InsertCreator>): Promise<Creator | undefined>;
  deleteCreator(id: number): Promise<boolean>;
  
  // Testimonial methods
  getTestimonials(): Promise<Testimonial[]>;
  getTestimonial(id: number): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial & { createdAt: string }): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private bookings: Map<number, Booking>;
  private portfolioItems: Map<number, PortfolioItem>;
  private creators: Map<number, Creator>;
  private testimonials: Map<number, Testimonial>;
  
  currentUserId: number;
  currentBookingId: number;
  currentPortfolioItemId: number;
  currentCreatorId: number;
  currentTestimonialId: number;

  constructor() {
    this.users = new Map();
    this.bookings = new Map();
    this.portfolioItems = new Map();
    this.creators = new Map();
    this.testimonials = new Map();
    
    this.currentUserId = 1;
    this.currentBookingId = 1;
    this.currentPortfolioItemId = 1;
    this.currentCreatorId = 1;
    this.currentTestimonialId = 1;
    
    // Create default admin user
    this.createUser({
      username: "shakti",
      password: "shivit721",
      isAdmin: true
    });
  }

  // USER METHODS
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
    // Ensure isAdmin has a default value if not provided
    const user: User = { 
      ...insertUser, 
      id,
      isAdmin: insertUser.isAdmin === undefined ? false : insertUser.isAdmin
    };
    this.users.set(id, user);
    return user;
  }

  // BOOKING METHODS
  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }
  
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async createBooking(bookingData: InsertBooking & { status: string, createdAt: string }): Promise<Booking> {
    const id = this.currentBookingId++;
    const booking: Booking = { ...bookingData, id };
    this.bookings.set(id, booking);
    return booking;
  }
  
  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const updatedBooking = { ...booking, status };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  // PORTFOLIO ITEM METHODS
  async getPortfolioItems(): Promise<PortfolioItem[]> {
    return Array.from(this.portfolioItems.values());
  }
  
  async getPortfolioItem(id: number): Promise<PortfolioItem | undefined> {
    return this.portfolioItems.get(id);
  }
  
  async createPortfolioItem(itemData: InsertPortfolioItem & { createdAt: string }): Promise<PortfolioItem> {
    const id = this.currentPortfolioItemId++;
    const item: PortfolioItem = { 
      ...itemData, 
      id,
      featured: itemData.featured === undefined ? false : itemData.featured
    };
    this.portfolioItems.set(id, item);
    return item;
  }
  
  async updatePortfolioItem(id: number, itemData: Partial<InsertPortfolioItem>): Promise<PortfolioItem | undefined> {
    const item = this.portfolioItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...itemData };
    this.portfolioItems.set(id, updatedItem);
    return updatedItem;
  }
  
  async deletePortfolioItem(id: number): Promise<boolean> {
    return this.portfolioItems.delete(id);
  }

  // CREATOR METHODS
  async getCreators(): Promise<Creator[]> {
    return Array.from(this.creators.values());
  }
  
  async getCreator(id: number): Promise<Creator | undefined> {
    return this.creators.get(id);
  }
  
  async createCreator(creatorData: InsertCreator & { createdAt: string }): Promise<Creator> {
    const id = this.currentCreatorId++;
    const creator: Creator = { 
      ...creatorData, 
      id,
      featured: creatorData.featured === undefined ? false : creatorData.featured,
      testimonial: creatorData.testimonial === undefined ? null : creatorData.testimonial
    };
    this.creators.set(id, creator);
    return creator;
  }
  
  async updateCreator(id: number, creatorData: Partial<InsertCreator>): Promise<Creator | undefined> {
    const creator = this.creators.get(id);
    if (!creator) return undefined;
    
    const updatedCreator = { ...creator, ...creatorData };
    this.creators.set(id, updatedCreator);
    return updatedCreator;
  }
  
  async deleteCreator(id: number): Promise<boolean> {
    return this.creators.delete(id);
  }

  // TESTIMONIAL METHODS
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }
  
  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    return this.testimonials.get(id);
  }
  
  async createTestimonial(testimonialData: InsertTestimonial & { createdAt: string }): Promise<Testimonial> {
    const id = this.currentTestimonialId++;
    const testimonial: Testimonial = { 
      ...testimonialData, 
      id,
      featured: testimonialData.featured === undefined ? false : testimonialData.featured
    };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }
  
  async updateTestimonial(id: number, testimonialData: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const testimonial = this.testimonials.get(id);
    if (!testimonial) return undefined;
    
    const updatedTestimonial = { ...testimonial, ...testimonialData };
    this.testimonials.set(id, updatedTestimonial);
    return updatedTestimonial;
  }
  
  async deleteTestimonial(id: number): Promise<boolean> {
    return this.testimonials.delete(id);
  }
}

export const storage = new MemStorage();
