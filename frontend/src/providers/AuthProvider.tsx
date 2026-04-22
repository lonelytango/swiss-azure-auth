import {
  InteractionStatus,
  PublicClientApplication,
  type AccountInfo,
} from "@azure/msal-browser";
import { MsalProvider, useIsAuthenticated, useMsal } from "@azure/msal-react";
import { useEffect, useMemo, useState } from "react";
import { loginRequest, msalConfig } from "../auth/msalConfig";
import {
  AuthContext,
  type AuthContextValue,
  type UserData,
} from "./auth-context";

const msalInstance = new PublicClientApplication(msalConfig);

const guestUser: UserData = {
  userId: "Guest",
  firstName: "",
  lastName: "",
  email: "",
  idToken: "",
};

function parseName(fullName: string) {
  const [firstName = "", ...rest] = fullName.trim().split(/\s+/);
  return {
    firstName,
    lastName: rest.join(" "),
  };
}

function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  const { instance, inProgress, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [error] = useState<string | null>(null);

  const activeAccount = useMemo<AccountInfo | null>(
    () => instance.getActiveAccount() ?? accounts[0] ?? null,
    [accounts, instance]
  );

  useEffect(() => {
    if (activeAccount) {
      instance.setActiveAccount(activeAccount);
    }
  }, [activeAccount, instance]);

  useEffect(() => {
    if (!isAuthenticated && inProgress === InteractionStatus.None) {
      void instance.loginRedirect(loginRequest);
    }
  }, [inProgress, instance, isAuthenticated]);

  const accessToken = useMemo(() => {
    if (
      !activeAccount ||
      !isAuthenticated ||
      inProgress !== InteractionStatus.None
    ) {
      return null;
    }

    // Use the ID token to authorize backend calls in this simplified single-scope flow.
    return activeAccount.idToken || null;
  }, [activeAccount, inProgress, isAuthenticated]);

  const user = useMemo<UserData>(() => {
    if (!isAuthenticated || !activeAccount) {
      return guestUser;
    }
    const { firstName, lastName } = parseName(activeAccount.name || "");
    return {
      userId: activeAccount.localAccountId,
      firstName: firstName || "User",
      lastName,
      email:
        (activeAccount.idTokenClaims?.email as string) ||
        activeAccount.username ||
        "",
      idToken: activeAccount.idToken || "",
    };
  }, [activeAccount, isAuthenticated]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isAuthenticated,
      isLoading: inProgress !== InteractionStatus.None,
      error,
      signIn: async () => {
        await instance.loginRedirect(loginRequest);
      },
      signOut: async () => {
        await instance.logoutRedirect({
          account: instance.getActiveAccount() ?? undefined,
        });
      },
    }),
    [accessToken, error, inProgress, instance, isAuthenticated, user]
  );

  if (!isAuthenticated || inProgress !== InteractionStatus.None) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-700">
        Verifying session...
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const initMsal = async () => {
      try {
        await msalInstance.initialize();
        await msalInstance.handleRedirectPromise();
      } catch (err) {
        setInitError(
          err instanceof Error ? err.message : "MSAL initialization failed."
        );
      } finally {
        setIsReady(true);
      }
    };

    void initMsal();
  }, []);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (initError) {
    return <div className="p-6 text-red-600">{initError}</div>;
  }

  return (
    <MsalProvider instance={msalInstance}>
      <AuthSessionProvider>{children}</AuthSessionProvider>
    </MsalProvider>
  );
}
