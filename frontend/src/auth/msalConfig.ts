import { LogLevel, type Configuration } from "@azure/msal-browser";

const clientId =
  import.meta.env.VITE_AZURE_CLIENT_ID || import.meta.env.VITE_CLIENT_ID;
const tenantId =
  import.meta.env.VITE_AZURE_TENANT_ID || import.meta.env.VITE_TENANT_ID;
const redirectUri =
  import.meta.env.VITE_AZURE_REDIRECT_URI || import.meta.env.VITE_REDIRECT_URI;
const postLogoutRedirectUri = import.meta.env.VITE_POST_LOGOUT_REDIRECT_URI;
const authorityHost =
  import.meta.env.VITE_AZURE_AUTHORITY_HOST || "login.microsoftonline.com";

if (!tenantId || !clientId || !redirectUri) {
  throw new Error("Missing MSAL environment variables in frontend .env file.");
}

export const msalConfig: Configuration = {
  auth: {
    authority: `https://${authorityHost}/${tenantId}`,
    clientId,
    redirectUri,
    postLogoutRedirectUri,
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      },
    },
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
};
