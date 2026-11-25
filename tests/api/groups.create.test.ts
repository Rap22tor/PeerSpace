import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../src/server/app";
import { openDb, type Db } from "../../src/server/db/database";
import type { CreateGroupResponse } from "../../src/shared/groupTypes";

const VALID_GROUP = {
  title: "Algorithms study group",
  description: "Weekly practice",
  tags: "algorithms, exam prep",
  isPrivate: false,
  maxCapacity: 8,
};

let db: Db;
let app: ReturnType<typeof createApp>;

beforeEach(() => {
  db = openDb(":memory:");
  app = createApp(db, "x".repeat(32));
});

// An agent keeps the session cookie. Registering signs the user in.
async function signedInAgent() {
  const agent = request.agent(app);
  const res = await agent.post("/api/register").send({
    username: "alice",
    email: "alice@test.com",
    password: "password1",
  });
  expect(res.status).toBe(201);
  const body = res.body as { user: { id: number } };
  return { agent, userId: body.user.id };
}

function countGroups(): number {
  const row = db.prepare("SELECT COUNT(*) AS total FROM groups").get() as {
    total: number;
  };
  return row.total;
}

describe("POST /api/groups", () => {
  it("answers 401 without a session", async () => {
    const res = await request(app).post("/api/groups").send(VALID_GROUP);
    expect(res.status).toBe(401);
    expect(countGroups()).toBe(0);
  });

  it("creates the group and makes the caller its approved admin", async () => {
    const { agent, userId } = await signedInAgent();

    const res = await agent.post("/api/groups").send(VALID_GROUP);

    expect(res.status).toBe(201);
    const { group } = res.body as CreateGroupResponse;
    expect(group).toMatchObject({
      title: "Algorithms study group",
      description: "Weekly practice",
      tags: "algorithms, exam prep",
      is_private: 0,
      max_capacity: 8,
      owner_id: userId,
      role: "admin",
      status: "approved",
    });
    // The invite code is generated server-side and not sent back.
    expect(group).not.toHaveProperty("invite_code");

    const membership = db
      .prepare(
        "SELECT role, status FROM group_members WHERE group_id = ? AND user_id = ?",
      )
      .get(group.group_id, userId);
    expect(membership).toEqual({ role: "admin", status: "approved" });
  });

  it("stores a private group as private", async () => {
    const { agent } = await signedInAgent();

    const res = await agent
      .post("/api/groups")
      .send({ ...VALID_GROUP, isPrivate: true });

    expect(res.status).toBe(201);
    expect((res.body as CreateGroupResponse).group.is_private).toBe(1);
  });

  it("ignores an ownerId and an inviteCode in the body", async () => {
    const { agent, userId } = await signedInAgent();

    const res = await agent
      .post("/api/groups")
      .send({ ...VALID_GROUP, ownerId: 999, inviteCode: "chosen-by-client" });

    expect(res.status).toBe(201);
    const { group } = res.body as CreateGroupResponse;
    expect(group.owner_id).toBe(userId);

    const row = db
      .prepare("SELECT invite_code FROM groups WHERE group_id = ?")
      .get(group.group_id) as { invite_code: string };
    expect(row.invite_code).not.toBe("chosen-by-client");
    expect(row.invite_code.length).toBeGreaterThan(0);
  });

  it("stores a blank description and blank tags as null", async () => {
    const { agent } = await signedInAgent();

    const res = await agent
      .post("/api/groups")
      .send({ ...VALID_GROUP, description: "   ", tags: "" });

    expect(res.status).toBe(201);
    const { group } = res.body as CreateGroupResponse;
    const row = db
      .prepare("SELECT description, tags FROM groups WHERE group_id = ?")
      .get(group.group_id);
    expect(row).toEqual({ description: null, tags: null });
  });

  it("accepts a body without description and tags", async () => {
    const { agent } = await signedInAgent();

    const res = await agent.post("/api/groups").send({
      title: "Just a title",
      isPrivate: false,
      maxCapacity: 5,
    });

    expect(res.status).toBe(201);
  });

  const invalidBodies: Array<[string, Record<string, unknown>, string]> = [
    ["an empty title", { title: "   " }, "title"],
    ["a title over 100 characters", { title: "a".repeat(101) }, "title"],
    [
      "a description over 1000 characters",
      { description: "a".repeat(1001) },
      "description",
    ],
    ["tags over 200 characters", { tags: "a".repeat(201) }, "tags"],
    ["a capacity of 0", { maxCapacity: 0 }, "maxCapacity"],
    ["a capacity of 51", { maxCapacity: 51 }, "maxCapacity"],
    ["a fractional capacity", { maxCapacity: 2.5 }, "maxCapacity"],
    ["a text capacity", { maxCapacity: "abc" }, "maxCapacity"],
    ["a missing isPrivate", { isPrivate: undefined }, "isPrivate"],
  ];

  it.each(invalidBodies)(
    "rejects %s with 400 and a message for the field",
    async (_name, override, field) => {
      const { agent } = await signedInAgent();

      const res = await agent
        .post("/api/groups")
        .send({ ...VALID_GROUP, ...override });

      expect(res.status).toBe(400);
      const body = res.body as {
        error: string;
        fields: Record<string, string>;
      };
      expect(body.fields[field]).toBeDefined();
      expect(countGroups()).toBe(0);
    },
  );
});
