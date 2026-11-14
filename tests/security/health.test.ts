import { describe, expect, it } from "vitest";
import request from "supertest";
import { openDb } from "../../src/server/db/database";
import { createApp } from "../../src/server/app";

// Placeholder proving the test setup works; replace with the 3 required security tests.
const app = createApp(openDb(":memory:"), "x".repeat(32));

describe("health", () => {
  it("returns ok and reaches the database", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok", db: true });
  });

  it("returns JSON 404 for unknown API routes", async () => {
    const res = await request(app).get("/api/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Not found" });
  });
});
