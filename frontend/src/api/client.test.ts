import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, getCurrentUser, getUserProfile } from "./client";

describe("api client", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns mapped profile data from envelope", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        data: {
          id: "1",
          display_name: "Alice",
          tenant_id: "tenant-1",
        },
      }),
    } as Response);

    const result = await getUserProfile("token-1");
    expect(result).toEqual({
      id: "1",
      displayName: "Alice",
      tenantId: "tenant-1",
    });
  });

  it("throws ApiError when envelope returns failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({
        success: false,
        data: null,
        error: {
          code: "UNAUTHORIZED",
          message: "Invalid token",
        },
      }),
    } as Response);

    await expect(getCurrentUser("token-2")).rejects.toEqual(
      expect.objectContaining<ApiError>({
        message: "Invalid token",
        status: 401,
      })
    );
  });
});
