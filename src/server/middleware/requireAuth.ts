import type { NextFunction, Request, Response } from "express";

// every private route goes through this; 401 when not signed in.
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    res.status(401).json({ error: "Not signed in" });
    return;
  }
  next();
}

// The signed-in user's id. Owner and admin ids come from here, never from the request body.
export function getUserId(req: Request): number {
  const userId = req.session.userId;
  if (userId === undefined) {
    throw new Error("getUserId was called on a route without requireAuth");
  }
  return userId;
}
