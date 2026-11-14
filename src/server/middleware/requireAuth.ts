import type { NextFunction, Request, Response } from "express";

// every private route goes through this; 401 when not signed in.
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    res.status(401).json({ error: "Not signed in" });
    return;
  }
  next();
}
