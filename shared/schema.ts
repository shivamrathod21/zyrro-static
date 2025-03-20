import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;
