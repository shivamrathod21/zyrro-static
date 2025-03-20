import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.post("/api/bookings", async (req, res) => {
    try {
      // Validate the request body
      const booking = insertBookingSchema.parse(req.body);
      
      // Create the booking with current timestamp
      const newBooking = {
        ...booking,
        status: "pending",
        createdAt: new Date().toISOString()
      };
      
      // Save to storage
      const created = await storage.createBooking(newBooking);
      
      // Return success response
      res.status(201).json({ 
        message: "Booking created successfully", 
        booking: created 
      });
    } catch (error) {
      // Handle validation errors
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationError.details 
        });
      }
      
      // Handle other errors
      console.error("Error creating booking:", error);
      res.status(500).json({ 
        message: "Failed to create booking" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
