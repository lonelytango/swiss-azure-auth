import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

const app = createApp("http://localhost:5173");

describe("backend routes", () => {
  it("returns health envelope", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: { status: "ok" },
    });
  });

  it("rejects protected mock-data route without token", async () => {
    const response = await request(app).get("/api/mock-data");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      success: false,
      data: null,
      error: {
        code: "UNAUTHORIZED",
        message: "Missing bearer token",
      },
    });
  });
});
