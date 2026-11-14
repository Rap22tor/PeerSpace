import "express-session";

// Tells TypeScript what we keep in req.session.
declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}
