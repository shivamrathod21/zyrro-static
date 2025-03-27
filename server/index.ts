import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import session from "express-session";
import MemoryStore from "memorystore";
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const app = express();

// Database setup
export const setupDatabase = async () => {
  const dbPath = process.env.NODE_ENV === 'production' 
    ? path.join(process.cwd(), 'database.sqlite')
    : path.join(process.cwd(), 'database.sqlite');

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  console.log(`Database initialized at: ${dbPath}`);

  // Create tables if they don't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      isAdmin BOOLEAN
    );
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      message TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS portfolio (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      imageUrl TEXT,
      videoUrl TEXT
    );
  `);

  // Check if admin user exists, if not create one
  const adminUser = await db.get('SELECT * FROM users WHERE username = ?', ['shakti']);
  if (!adminUser) {
    await db.run(
      'INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)',
      ['shakti', '@shivit721', true]
    );
    console.log('Admin user created');
  }

  return db;
};

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

// CORS middleware
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'https://zyrovisual.com'];
  const origin = req.headers.origin;
  
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure session middleware
const MemoryStoreSession = MemoryStore(session);
app.use(session({
  name: 'zyro.sid',
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: new MemoryStoreSession({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    httpOnly: true,
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? '.zyrovisual.com' : 'localhost'
  }
}));

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
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
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

(async () => {
  try {
    // Initialize database
    const db = await setupDatabase();
    app.locals.db = db;

    const server = await registerRoutes(app);

    // Global error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error('Global error handler:', err);
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });

    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    const port = process.env.PORT || 3000;
    const retryInterval = 1000;
    const maxRetries = 5;
    let currentRetry = 0;

    const startServer = () => {
      server.listen(port, () => {
        log(`Server running on port ${port} in ${app.get("env")} mode`);
      }).on('error', (error: any) => {
        if (error.code === 'EADDRINUSE' && currentRetry < maxRetries) {
          currentRetry++;
          console.log(`Port ${port} is in use, retrying in ${retryInterval}ms... (Attempt ${currentRetry}/${maxRetries})`);
          setTimeout(startServer, retryInterval);
        } else {
          console.error('Server failed to start:', error);
          process.exit(1);
        }
      });
    };

    startServer();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
