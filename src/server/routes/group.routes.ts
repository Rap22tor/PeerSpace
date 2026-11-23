import { Router } from "express";
import { groupListQuerySchema } from "../../shared/groupSchemas";
import type { GroupListResponse } from "../../shared/groupTypes";
import type { Db } from "../db/database";
import { requireAuth } from "../middleware/requireAuth";
import { getGroups } from "../repositories/groupRepository";
import { parseBody } from "../validation/parseBody";

// Group endpoints. app.ts mounts this router at /api/groups, so paths here are
// relative: router.get("/") answers GET /api/groups and router.get("/:groupId")
// answers GET /api/groups/:groupId.
//
// Pattern for a new endpoint:
//   - input:  parseBody(schema, req.body | req.query) for bodies and query strings,
//             parseIdParam(req.params.groupId) for ids (both in ../validation/)
//   - user:   getUserId(req) from ../middleware/requireAuth. Never take an
//             owner or user id from the client.
//   - data:   a function from ../repositories/, scoped to that user where needed
//   - types:  put request and response types in src/shared/ and use them in
//             src/client/src/api/group.ts
export function groupRouter(db: Db): Router {
  const router = Router();

  // Every group route needs a signed-in user (401 otherwise).
  router.use(requireAuth);

  // GET /api/groups
  router.get("/", (req, res) => {
    const result = parseBody(groupListQuerySchema, req.query);
    if (!result.ok) {
      res.status(400).json({ error: "Invalid input", fields: result.fields });
      return;
    }

    const { q, isPrivate } = result.value;
    const body: GroupListResponse = { groups: getGroups(db, q, isPrivate) };
    res.status(200).json(body);
  });

  return router;
}
