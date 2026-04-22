const backendBaseUrl =
  process.env.EXPO_PUBLIC_BACKEND_BASE_URL || "http://localhost:3001";

export interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  error?: {
    code: string;
    message: string;
  };
}

export interface MobileProfile {
  id: string;
  display_name: string;
  tenant_id: string;
}

export interface MockDataItem {
  id: string;
  label: string;
  score: number;
  isActive: boolean;
  created_at: string;
}

export async function getProtectedProfile(
  token: string
): Promise<MobileProfile> {
  const response = await fetch(`${backendBaseUrl}/api/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const payload = (await response.json()) as ApiEnvelope<MobileProfile>;
  if (!response.ok || !payload.success || !payload.data) {
    throw new Error(
      payload.error?.message || `Request failed: ${response.status}`
    );
  }

  return payload.data;
}

export async function getProtectedMockData(
  token: string
): Promise<MockDataItem[]> {
  const response = await fetch(`${backendBaseUrl}/api/mock-data`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const payload = (await response.json()) as ApiEnvelope<MockDataItem[]>;
  if (!response.ok || !payload.success || !payload.data) {
    throw new Error(
      payload.error?.message || `Request failed: ${response.status}`
    );
  }

  return payload.data;
}
