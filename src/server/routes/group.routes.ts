import { randomBytes } from "node:crypto";
import { Router } from "express";
import {
  createGroupSchema,
  groupListQuerySchema,
} from "../../shared/groupSchemas";
import type {
  CreateGroupResponse,
  GroupListResponse,
} from "../../shared/groupTypes";
import type { Db } from "../db/database";
import { getUserId, requireAuth } from "../middleware/requireAuth";
import {
  addGroup,
  getGroups,
  getGroupWithUserMembership,
} from "../repositories/groupRepository";
import { parseBody } from "../validation/parseBody";

// Code for joining a group. Generated here, never taken from the client.
function generateInviteCode(): string {
  return randomBytes(8).toString("base64url");
}

// Group endpoints, mounted at /api/groups in app.ts (paths here are relative).
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

  // POST /api/groups
  router.post("/", (req, res) => {
    const result = parseBody(createGroupSchema, req.body);
    if (!result.ok) {
      res.status(400).json({ error: "Invalid input", fields: result.fields });
      return;
    }

    // The owner always comes from the session, never from the request body.
    const userId = getUserId(req);
    const { title, description, tags, isPrivate, maxCapacity } = result.value;

    const groupId = addGroup(db, {
      title,
      description,
      tags,
      isPrivate: isPrivate ? 1 : 0,
      maxCapacity,
      inviteCode: generateInviteCode(),
      ownerId: userId,
    });

    const group = getGroupWithUserMembership(db, groupId, userId);
    if (group === undefined) {
      throw new Error(`Group ${groupId} was not found right after creating it`);
    }

    const body: CreateGroupResponse = { group };
    res.status(201).json(body);
  });

  return router;
}
