import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Video content management table
export const videoContent = pgTable("video_content", {
  id: serial("id").primaryKey(),
  section: text("section").notNull(), // 'hero', 'portfolio', 'before_after'
  title: text("title").notNull(),
  description: text("description"),
  videoUrl: text("video_url"),
  beforeVideoUrl: text("before_video_url"),
  afterVideoUrl: text("after_video_url"),
  thumbnailUrl: text("thumbnail_url"),
  active: boolean("active").notNull().default(true),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull()
});

export const insertVideoContentSchema = createInsertSchema(videoContent).pick({
  section: true,
  title: true,
  description: true,
  videoUrl: true,
  beforeVideoUrl: true,
  afterVideoUrl: true,
  thumbnailUrl: true,
  active: true
});


export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

export const adminSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  password: z.string().min(4, {
    message: "Password must be at least 4 characters.",
  }),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  channel: text("channel").notNull(),
  serviceType: text("service_type").notNull(), 
  projectDetails: text("project_details").notNull(),
  budgetRange: text("budget_range").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull()
});

export const insertBookingSchema = createInsertSchema(bookings).pick({
  name: true,
  email: true,
  channel: true,
  serviceType: true,
  projectDetails: true,
  budgetRange: true
});

// Portfolio Items (videos, projects)
export const portfolioItems = pgTable("portfolio_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  videoUrl: text("video_url").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  category: text("category").notNull(),
  featured: boolean("featured").notNull().default(false),
  createdAt: text("created_at").notNull()
});

export const insertPortfolioItemSchema = createInsertSchema(portfolioItems).pick({
  title: true,
  description: true,
  videoUrl: true,
  thumbnailUrl: true,
  category: true,
  featured: true,
});

// Creators
export const creators = pgTable("creators", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  subscribers: text("subscribers").notNull(),
  testimonial: text("testimonial"),
  avatarUrl: text("avatar_url").notNull(),
  featured: boolean("featured").notNull().default(false),
  createdAt: text("created_at").notNull()
});

export const insertCreatorSchema = createInsertSchema(creators).pick({
  name: true,
  subscribers: true,
  testimonial: true,
  avatarUrl: true,
  featured: true,
});

// Testimonials
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  quote: text("quote").notNull(),
  creatorId: integer("creator_id").notNull(),
  rating: integer("rating").notNull(),
  featured: boolean("featured").notNull().default(false),
  createdAt: text("created_at").notNull()
});

export const insertTestimonialSchema = createInsertSchema(testimonials).pick({
  quote: true,
  creatorId: true,
  rating: true,
  featured: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;
export type PortfolioItem = typeof portfolioItems.$inferSelect;

export type InsertCreator = z.infer<typeof insertCreatorSchema>;
export type Creator = typeof creators.$inferSelect;

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;
