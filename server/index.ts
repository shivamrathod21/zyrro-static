import express, { Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import session from "express-session";
import MemoryStore from "memorystore";
import mysql from "mysql2/promise"; // <-- NEW: Using mysql2 driver
import path from "path";

const app = express();

// *******************************
// 1) MySQL Database Setup
// *******************************
export const setupDatabase = async () => {
  // Read environment variables (make sure they're set in your .env)
  const {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_PORT,
  } = process.env;

  if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    throw new Error("Missing MySQL credentials in environment variables!");
  }

  // Create a connection to MySQL
  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT ? parseInt(DB_PORT) : 3306,
  });

  console.log(Connected to MySQL at ${DB_HOST}:${DB_PORT || 3306});

  // *******************************
  // 2) Create Tables if not exist
  // *******************************
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) UNIQUE,
      password VARCHAR(255),
      isAdmin BOOLEAN
    );
  `);

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255),
      message TEXT,
      status VARCHAR(50) DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS portfolio (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255),
      description TEXT,
      imageUrl VARCHAR(1024),
      videoUrl VARCHAR(1024)
    );
  `);

  // *******************************
  // 3) Check if admin user exists
  // *******************************
  const [rows] = await connection.execute(
    "SELECT * FROM users WHERE username = ?",
    ["shakti"]
  );

  // 'rows' is an array of objects
  if (Array.isArray(rows) && rows.length === 0) {
    // Insert admin user
    await connection.execute(
      "INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)",
      ["shakti", "@shivit721", true]
    );
    console.log("Admin user created");
  }

  // Return the connection so we can query later if needed
  return connection;
};

// *******************************
// Error handling for uncaught exceptions
// *******************************
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
});

// *******************************
// 4) CORS Middleware
// *******************************
app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://zyrovisual.com",
  ];
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// *******************************
// 5) Session Middleware
// *******************************
import memorystore from "memorystore";
const MemoryStoreSession = memorystore(session);

app.use(
  session({
    name: "zyro.sid",
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStoreSession({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      httpOnly: true,
      path: "/",
      domain: process.env.NODE_ENV === "production" ? ".zyrovisual.com" : "localhost",
    },
  })
);

// *******************************
// 6) Logging Middleware
// *******************************
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = ${req.method} ${path} ${res.statusCode} in ${duration}ms;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// *******************************
// 7) Main Startup Logic
// *******************************
(async () => {
  try {
    // Initialize database
    const db = await setupDatabase();
    // We'll store the connection on app.locals
    app.locals.db = db;

    // Register your routes (adjust if your routes rely on sqlite methods)
    const server = await registerRoutes(app);

    // Global error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error("Global error handler:", err);
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });

    // If in development, use Vite dev server
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // *******************************
    // 8) Start the Server
    // *******************************
    const port = process.env.PORT || 3000;
    const retryInterval = 1000;
    const maxRetries = 5;
    let currentRetry = 0;

    const startServer = () => {
      // Listen on 0.0.0.0 so it's externally accessible
      server
        .listen(port, "0.0.0.0", () => {
          log(Server running on port ${port} in ${app.get("env")} mode);
        })
        .on("error", (error: any) => {
          if (error.code === "EADDRINUSE" && currentRetry < maxRetries) {
            currentRetry++;
            console.log(
              Port ${port} is in use, retrying in ${retryInterval}ms... (Attempt ${currentRetry}/${maxRetries})
            );
            setTimeout(startServer, retryInterval);
          } else {
            console.error("Server failed to start:", error);
            process.exit(1);
          }
        });
    };

    startServer();
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
