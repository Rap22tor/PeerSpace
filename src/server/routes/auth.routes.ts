import { Router } from "express";
import { loginSchema, registerSchema } from "../../shared/authSchemas";
import { requireAuth } from "../middleware/requireAuth";
import { parseBody } from "../validation/parseBody";

// Auth endpoints. None of them is fully implemented yet: after the body is
// validated, every handler answers 501 Not Implemented with an empty body. The
// comment on each route says what it will have to do. A user is always sent to
// the client as { user: { id, email, userName } }.
export function authRouter(): Router {
  const router = Router();

  // TODO hash pw with bcrypt (cost >= 10), validate unique email and username (409),
  // insert user into db, regenerate session and reply with 201
  router.post("/register", (req, res) => {
    // parseBody takes 'any' and returns the requested schema
    const result = parseBody(registerSchema, req.body);
    if (!result.ok) {
      // if parsing failed, result.fields contains error messages
      res.status(400).json({ error: "Invalid input", fields: result.fields });
      return;
    }

    // TODO hook up to db
    const { userName, email, password } = result.value;
    void userName;
    void email;
    void password;

    res.status(501).end();
  });

  // TODO Loginprocess. look the user up by email with a parameterized query and
  // compare with bcrypt. An unknown email and a wrong password must give the
  // same 401 { error: "Wrong email or password." }. On success regenerate the
  // session, store the userId, answer 200.
  router.post("/login", (req, res) => {
    // parseBody takes 'any' and returns the requested schema
    const result = parseBody(loginSchema, req.body);
    if (!result.ok) {
      // if parsing failed, result.fields contains error messages
      res.status(400).json({ error: "Invalid input", fields: result.fields });
      return;
    }

    // TODO
    const { email, password } = result.value;
    void email;
    void password;

    res.status(501).end();
  });

  // TODO: destroy the session, clear the "sid" cookie, answer 204.
  // Error if not logged in
  router.post("/logout", requireAuth, (_req, res) => {
    res.status(501).end();
  });

  // TODO: load the user for req.session.userId and answer 200 { user }.
  // If that user no longer exists or noone is logged in, 
  // destroy the session and answer 401.
  router.get("/me", requireAuth, (_req, res) => {
    res.status(501).end();
  });

  return router;
}
