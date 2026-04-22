export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiFailureResponse {
  success: false;
  data: null;
  error: ApiError;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiFailureResponse;

export interface BackendProfileResponse {
  id: string;
  display_name: string;
  tenant_id: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  tenantId: string;
}

export interface BackendMeResponse {
  id: string;
  display_name: string;
  email: string;
  tenant_id: string;
}

export interface CurrentUser {
  id: string;
  displayName: string;
  email: string;
  tenantId: string;
}
