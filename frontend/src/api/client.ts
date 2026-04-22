import { mapCurrentUserResponse, mapProfileResponse } from './apiMapper'
import type {
  ApiResponse,
  BackendMeResponse,
  BackendProfileResponse,
  CurrentUser,
  UserProfile,
} from '../types/api'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function parseApiResponse<T>(response: Response, label: string): Promise<T> {
  const payload = (await response.json()) as ApiResponse<T>

  if (!response.ok || !payload.success) {
    const errorMessage =
      !payload.success && payload.error?.message
        ? payload.error.message
        : `${label} request failed: ${response.status}`
    throw new ApiError(errorMessage, response.status)
  }

  return payload.data
}

export async function getUserProfile(accessToken: string): Promise<UserProfile> {
  const response = await fetch('/api/profile', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const payload = await parseApiResponse<BackendProfileResponse>(response, 'Profile')
  return mapProfileResponse(payload)
}

export async function getCurrentUser(accessToken: string): Promise<CurrentUser> {
  const response = await fetch('/api/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const payload = await parseApiResponse<BackendMeResponse>(response, 'Current user')
  return mapCurrentUserResponse(payload)
}
