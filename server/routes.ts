import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertBookingSchema, 
  insertPortfolioItemSchema, 
  insertCreatorSchema, 
  insertTestimonialSchema,
  loginSchema,
  adminSchema
} from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import session from "express-session";
import MemoryStore from "memorystore";
// Import our custom session type declarations
import "./types";

// Helper function to handle zod validation
const validateRequest = (schema: z.ZodType<any, any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationError.details 
        });
      }
      next(error);
    }
  };
};

// Authentication middleware
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Admin middleware
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user && req.session.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Admin access required" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session middleware with memory store
  const SessionStore = MemoryStore(session);
  app.use(session({
    secret: 'zyro-visuals-secret',
    resave: false,
    saveUninitialized: false,
    store: new SessionStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    cookie: { 
      secure: false, // set to true if using https
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Add user data to session
  app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
  });
  
  // ================= AUTH ROUTES =================
  
  // Login route
  app.post("/api/auth/login", validateRequest(loginSchema), async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set user in session
      req.session.user = {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin
      };
      
      return res.status(200).json({ 
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          isAdmin: user.isAdmin
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  // Logout route
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie('connect.sid');
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
  
  // Get current user
  app.get("/api/auth/me", (req, res) => {
    if (req.session.user) {
      res.status(200).json({ user: req.session.user });
    } else {
      res.status(401).json({ message: "Not logged in" });
    }
  });
  
  // Register admin user (only first admin can do this)
  app.post("/api/auth/register", isAdmin, validateRequest(adminSchema), async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Create new admin user
      const newUser = await storage.createUser({
        username,
        password,
        isAdmin: true
      });
      
      res.status(201).json({ 
        message: "Admin created successfully",
        user: {
          id: newUser.id,
          username: newUser.username,
          isAdmin: newUser.isAdmin
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Failed to create admin" });
    }
  });
  
  // ================= PUBLIC API ROUTES =================
  
  // Bookings route
  app.post("/api/bookings", validateRequest(insertBookingSchema), async (req, res) => {
    try {
      // Create the booking with current timestamp
      const newBooking = {
        ...req.body,
        status: "pending",
        createdAt: new Date().toISOString()
      };
      
      // Save to storage
      const created = await storage.createBooking(newBooking);
      
      // Return success response
      res.status(201).json(created);
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  });
  
  // Get all portfolio items
  app.get("/api/portfolio", async (req, res) => {
    try {
      const portfolioItems = await storage.getPortfolioItems();
      res.status(200).json(portfolioItems);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      res.status(500).json({ message: "Failed to fetch portfolio items" });
    }
  });
  
  // Get all creators
  app.get("/api/creators", async (req, res) => {
    try {
      const creators = await storage.getCreators();
      res.status(200).json(creators);
    } catch (error) {
      console.error("Error fetching creators:", error);
      res.status(500).json({ message: "Failed to fetch creators" });
    }
  });
  
  // Get all testimonials
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.status(200).json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });
  
  // ================= ADMIN API ROUTES =================
  
  // Get all bookings (admin only)
  app.get("/api/bookings", isAuthenticated, async (req, res) => {
    try {
      const bookings = await storage.getBookings();
      res.status(200).json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });
  
  // Update booking status (admin only)
  app.patch("/api/bookings/:id/status", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["pending", "confirmed", "completed", "canceled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      
      const updatedBooking = await storage.updateBookingStatus(id, status);
      
      if (!updatedBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.status(200).json({ 
        message: "Booking status updated", 
        booking: updatedBooking 
      });
    } catch (error) {
      console.error("Error updating booking:", error);
      res.status(500).json({ message: "Failed to update booking" });
    }
  });
  
  // PORTFOLIO ITEM ADMIN ROUTES
  
  // Create portfolio item (admin only)
  app.post("/api/portfolio", isAuthenticated, validateRequest(insertPortfolioItemSchema), async (req, res) => {
    try {
      const portfolioItem = {
        ...req.body,
        createdAt: new Date().toISOString()
      };
      
      const created = await storage.createPortfolioItem(portfolioItem);
      
      res.status(201).json(created);
    } catch (error) {
      console.error("Error creating portfolio item:", error);
      res.status(500).json({ message: "Failed to create portfolio item" });
    }
  });
  
  // Update portfolio item (admin only)
  app.patch("/api/portfolio/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const updatedItem = await storage.updatePortfolioItem(id, req.body);
      
      if (!updatedItem) {
        return res.status(404).json({ message: "Portfolio item not found" });
      }
      
      res.status(200).json(updatedItem);
    } catch (error) {
      console.error("Error updating portfolio item:", error);
      res.status(500).json({ message: "Failed to update portfolio item" });
    }
  });
  
  // Delete portfolio item (admin only)
  app.delete("/api/portfolio/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const deleted = await storage.deletePortfolioItem(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Portfolio item not found" });
      }
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error deleting portfolio item:", error);
      res.status(500).json({ message: "Failed to delete portfolio item" });
    }
  });
  
  // CREATOR ADMIN ROUTES
  
  // Create creator (admin only)
  app.post("/api/creators", isAuthenticated, validateRequest(insertCreatorSchema), async (req, res) => {
    try {
      const creator = {
        ...req.body,
        createdAt: new Date().toISOString()
      };
      
      const created = await storage.createCreator(creator);
      
      res.status(201).json(created);
    } catch (error) {
      console.error("Error creating creator:", error);
      res.status(500).json({ message: "Failed to create creator" });
    }
  });
  
  // Update creator (admin only)
  app.patch("/api/creators/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const updatedCreator = await storage.updateCreator(id, req.body);
      
      if (!updatedCreator) {
        return res.status(404).json({ message: "Creator not found" });
      }
      
      res.status(200).json(updatedCreator);
    } catch (error) {
      console.error("Error updating creator:", error);
      res.status(500).json({ message: "Failed to update creator" });
    }
  });
  
  // Delete creator (admin only)
  app.delete("/api/creators/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const deleted = await storage.deleteCreator(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Creator not found" });
      }
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error deleting creator:", error);
      res.status(500).json({ message: "Failed to delete creator" });
    }
  });
  
  // TESTIMONIAL ADMIN ROUTES
  
  // Create testimonial (admin only)
  app.post("/api/testimonials", isAuthenticated, validateRequest(insertTestimonialSchema), async (req, res) => {
    try {
      const testimonial = {
        ...req.body,
        createdAt: new Date().toISOString()
      };
      
      const created = await storage.createTestimonial(testimonial);
      
      res.status(201).json(created);
    } catch (error) {
      console.error("Error creating testimonial:", error);
      res.status(500).json({ message: "Failed to create testimonial" });
    }
  });
  
  // Update testimonial (admin only)
  app.patch("/api/testimonials/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const updatedTestimonial = await storage.updateTestimonial(id, req.body);
      
      if (!updatedTestimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      
      res.status(200).json(updatedTestimonial);
    } catch (error) {
      console.error("Error updating testimonial:", error);
      res.status(500).json({ message: "Failed to update testimonial" });
    }
  });
  
  // Delete testimonial (admin only)
  app.delete("/api/testimonials/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const deleted = await storage.deleteTestimonial(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      res.status(500).json({ message: "Failed to delete testimonial" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
