import { describe, expect, it } from "vitest";
import { mapCurrentUserResponse, mapProfileResponse } from "@api/apiMapper";

describe("apiMapper", () => {
  it("maps profile payload to frontend shape", () => {
    const result = mapProfileResponse({
      id: "u1",
      display_name: "Jane Doe",
      tenant_id: "t1",
    });

    expect(result).toEqual({
      id: "u1",
      displayName: "Jane Doe",
      tenantId: "t1",
    });
  });

  it("maps current user payload to frontend shape", () => {
    const result = mapCurrentUserResponse({
      id: "u2",
      display_name: "John Smith",
      email: "john@example.com",
      tenant_id: "t2",
    });

    expect(result).toEqual({
      id: "u2",
      displayName: "John Smith",
      email: "john@example.com",
      tenantId: "t2",
    });
  });
});
