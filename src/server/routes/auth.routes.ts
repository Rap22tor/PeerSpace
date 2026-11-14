import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";

// Auth endpoints. None of them is implemented yet: every handler answers
// 501 Not Implemented with an empty body. The comment on each route says what
// it will have to do. A user is always sent to the client as
// { user: { id, email, name } }.
export function authRouter(): Router {
  const router = Router();

  // POST /api/register, body { name, email, password }
  // To implement: validate every field (400 with { error } and optionally
  // { fields: { name?, email?, password? } }), hash the password with bcrypt
  // (cost 10 or more; bcrypt only uses the first 72 bytes), insert the user
  // (409 with { error } if the email already exists), regenerate the session
  // and store the userId in it, then answer 201 { user }.
  router.post("/register", (_req, res) => {
    res.status(501).end();
  });

  // POST /api/login, body { email, password }
  // To implement: validate the fields (400), look the user up by email with a
  // parameterized query and compare with bcrypt. An unknown email and a wrong
  // password must give the same 401 { error: "Wrong email or password." }.
  // On success regenerate the session, store the userId, answer 200 { user }.
  router.post("/login", (_req, res) => {
    res.status(501).end();
  });

  // POST /api/logout (signed in only)
  // To implement: destroy the session, clear the "sid" cookie, answer 204.
  router.post("/logout", requireAuth, (_req, res) => {
    res.status(501).end();
  });

  // GET /api/me (signed in only)
  // To implement: load the user for req.session.userId and answer 200 { user }.
  // If that user no longer exists, destroy the session and answer 401.
  router.get("/me", requireAuth, (_req, res) => {
    res.status(501).end();
  });

  return router;
}
