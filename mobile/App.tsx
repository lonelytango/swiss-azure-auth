import * as AuthSession from "expo-auth-session";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  azureClientId,
  azureDiscovery,
  azureScopes,
  redirectUri,
} from "./src/auth";
import {
  getProtectedMockData,
  getProtectedProfile,
  type MobileProfile,
  type MockDataItem,
} from "./src/api";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [idToken, setIdToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [accountName, setAccountName] = useState<string | null>(null);
  const [accountEmail, setAccountEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<MobileProfile | null>(null);
  const [mockData, setMockData] = useState<MockDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAuthEvent, setLastAuthEvent] = useState("No auth response yet");

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: azureClientId,
      responseType: AuthSession.ResponseType.Code,
      scopes: azureScopes,
      redirectUri,
    },
    azureDiscovery
  );

  useEffect(() => {
    if (!response) {
      return;
    }

    console.log("AuthSession response:", JSON.stringify(response, null, 2));
    setLastAuthEvent(`Auth response type: ${response.type}`);

    const params =
      "params" in response
        ? (response.params as Record<string, string> | undefined)
        : undefined;

    if (response.type !== "success") {
      const authError =
        params?.error_description ||
        params?.error ||
        "Authentication was cancelled.";
      setError(authError);
      return;
    }

    const code = params?.code;
    if (!code || !request?.codeVerifier) {
      setError("Missing authorization code or PKCE verifier.");
      return;
    }

    void exchangeAuthorizationCode(code, request.codeVerifier)
      .then((tokenResponse) => {
        const nextIdToken = tokenResponse.idToken || null;
        const nextAccessToken = tokenResponse.accessToken || null;

        console.log("Received id_token:", Boolean(nextIdToken));
        console.log("Received access_token:", Boolean(nextAccessToken));

        setAccessToken(nextAccessToken);
        setIdToken(nextIdToken);
        setError(nextIdToken ? null : "Missing id_token from Azure response.");

        if (nextAccessToken) {
          void loadGraphAccount(nextAccessToken)
            .then((account) => {
              setAccountName(account.displayName);
              setAccountEmail(
                account.mail || account.userPrincipalName || null
              );
            })
            .catch((err) => {
              console.warn("Graph profile fetch failed:", err);
            });
        }
      })
      .catch((err) => {
        console.error("Code exchange failed:", err);
        setError(err instanceof Error ? err.message : "Token exchange failed.");
      });
  }, [request, response]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!idToken) {
        setProfile(null);
        return;
      }

      setIsLoading(true);
      try {
        const nextProfile = await getProtectedProfile(idToken);
        setProfile(nextProfile);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Profile request failed."
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadProfile();
  }, [idToken]);

  const authStatus = useMemo(() => {
    if (idToken) {
      return "Authenticated";
    }
    return "Not authenticated";
  }, [idToken]);

  const shortToken = useMemo(() => {
    if (!idToken) {
      return "Unavailable";
    }
    return `${idToken.slice(0, 24)}...${idToken.slice(-18)}`;
  }, [idToken]);

  const shortAccessToken = useMemo(() => {
    if (!accessToken) {
      return "Unavailable";
    }
    return `${accessToken.slice(0, 24)}...${accessToken.slice(-18)}`;
  }, [accessToken]);

  const handleFetchMockData = async () => {
    if (!idToken) {
      setError("Sign in first to fetch mock data.");
      return;
    }

    setIsLoading(true);
    try {
      const items = await getProtectedMockData(idToken);
      setMockData(items);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Mock data request failed."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.card}>
        <Text style={styles.title}>Swiss Azure Auth Mobile</Text>
        <Text style={styles.subtitle}>Status: {authStatus}</Text>
        <Text style={styles.debug}>{lastAuthEvent}</Text>
        {idToken ? <Text style={styles.success}>Login success</Text> : null}
        {accountName ? (
          <Text style={styles.profileText}>Account: {accountName}</Text>
        ) : null}
        {accountEmail ? (
          <Text style={styles.profileText}>Email: {accountEmail}</Text>
        ) : null}

        <Pressable
          style={styles.button}
          disabled={!request}
          onPress={() => void promptAsync()}
        >
          <Text style={styles.buttonText}>Sign in with Azure</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => void handleFetchMockData()}
        >
          <Text style={styles.buttonText}>Fetch Mock Data</Text>
        </Pressable>

        {isLoading ? <ActivityIndicator size="small" /> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {profile ? (
          <View style={styles.profile}>
            <Text style={styles.profileText}>Name: {profile.display_name}</Text>
            <Text style={styles.profileText}>Tenant: {profile.tenant_id}</Text>
          </View>
        ) : null}
        {mockData.length > 0 ? (
          <View style={styles.profile}>
            <Text style={styles.profileText}>Mock rows: {mockData.length}</Text>
            <Text style={styles.profileText}>
              First item: {mockData[0]?.label} (score {mockData[0]?.score})
            </Text>
          </View>
        ) : null}
        <View style={styles.tokenBox}>
          <Text style={styles.tokenLabel}>ID Token</Text>
          <Text style={styles.tokenValue}>{shortToken}</Text>
          <Text style={[styles.tokenLabel, { marginTop: 8 }]}>
            Access Token
          </Text>
          <Text style={styles.tokenValue}>{shortAccessToken}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

interface GraphMe {
  displayName: string;
  mail?: string;
  userPrincipalName?: string;
}

async function loadGraphAccount(token: string): Promise<GraphMe> {
  const response = await fetch("https://graph.microsoft.com/v1.0/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Graph /me failed: ${response.status}`);
  }

  return (await response.json()) as GraphMe;
}

async function exchangeAuthorizationCode(code: string, codeVerifier: string) {
  return AuthSession.exchangeCodeAsync(
    {
      clientId: azureClientId,
      code,
      redirectUri,
      extraParams: {
        code_verifier: codeVerifier,
      },
    },
    azureDiscovery
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  card: {
    margin: 24,
    marginTop: 80,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    padding: 20,
    gap: 12,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
  },
  subtitle: {
    color: "#334155",
  },
  debug: {
    fontSize: 12,
    color: "#475569",
  },
  button: {
    borderRadius: 8,
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  error: {
    color: "#dc2626",
  },
  success: {
    color: "#16a34a",
    fontWeight: "600",
  },
  profile: {
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    padding: 12,
    gap: 4,
  },
  profileText: {
    color: "#334155",
  },
  tokenBox: {
    borderRadius: 8,
    backgroundColor: "#e2e8f0",
    padding: 10,
  },
  tokenLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0f172a",
  },
  tokenValue: {
    fontSize: 11,
    color: "#334155",
  },
});
