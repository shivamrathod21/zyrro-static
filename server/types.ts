import 'express-session';

// Extend express-session with our custom user data
declare module 'express-session' {
  interface SessionData {
    user: {
      id: number;
      username: string;
      isAdmin: boolean;
    };
  }
}