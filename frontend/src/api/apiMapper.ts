import type {
  BackendMeResponse,
  BackendProfileResponse,
  CurrentUser,
  UserProfile,
} from "@/types/api";

export function mapProfileResponse(
  response: BackendProfileResponse
): UserProfile {
  return {
    id: response.id,
    displayName: response.display_name,
    tenantId: response.tenant_id,
  };
}

export function mapCurrentUserResponse(
  response: BackendMeResponse
): CurrentUser {
  return {
    id: response.id,
    displayName: response.display_name,
    email: response.email,
    tenantId: response.tenant_id,
  };
}
