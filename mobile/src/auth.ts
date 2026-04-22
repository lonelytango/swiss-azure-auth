import * as AuthSession from "expo-auth-session";

const clientId = process.env.EXPO_PUBLIC_AZURE_CLIENT_ID;
const configuredRedirectUri = process.env.EXPO_PUBLIC_AZURE_REDIRECT_URI;
const configuredAuthority = process.env.EXPO_PUBLIC_AZURE_AUTHORITY;

if (!clientId || !configuredAuthority) {
  throw new Error(
    "Missing EXPO_PUBLIC_AZURE_CLIENT_ID or EXPO_PUBLIC_AZURE_AUTHORITY in mobile env."
  );
}

const authorityBase = configuredAuthority;
const authority = authorityBase.includes("/oauth2/")
  ? authorityBase
  : `${authorityBase.replace(/\/$/, "")}/oauth2/v2.0`;

export const azureDiscovery: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: `${authority}/authorize`,
  tokenEndpoint: `${authority}/token`,
  revocationEndpoint: `${authority}/logout`,
};

export const azureScopes = ["openid", "profile", "email", "User.Read"];

export const redirectUri =
  configuredRedirectUri ||
  AuthSession.makeRedirectUri({
    scheme: "swissazureauthmobile",
    path: "auth",
  });

export const azureClientId = clientId;
