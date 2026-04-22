import React from "react";
import { render, screen } from "@testing-library/react-native";
import App from "../App";

jest.mock("expo-status-bar", () => ({
  StatusBar: () => null,
}));

jest.mock("expo-web-browser", () => ({
  maybeCompleteAuthSession: jest.fn(),
}));

jest.mock("expo-auth-session", () => ({
  ResponseType: { Code: "code" },
  useAuthRequest: jest.fn(() => [{}, null, jest.fn()]),
  exchangeCodeAsync: jest.fn(),
}));

jest.mock("../src/auth", () => ({
  azureClientId: "client-id",
  azureDiscovery: {
    authorizationEndpoint:
      "https://login.microsoftonline.com/tenant/oauth2/v2.0/authorize",
    tokenEndpoint: "https://login.microsoftonline.com/tenant/oauth2/v2.0/token",
  },
  azureScopes: ["openid", "profile", "email", "User.Read"],
  redirectUri: "msauth.com.ziandev.swissazureauthmobile://auth",
}));

jest.mock("../src/api", () => ({
  getProtectedProfile: jest.fn(),
}));

describe("Mobile App", () => {
  it("renders default unauthenticated state", () => {
    render(<App />);

    expect(screen.getByText("Swiss Azure Auth Mobile")).toBeTruthy();
    expect(screen.getByText("Status: Not authenticated")).toBeTruthy();
    expect(screen.getByText("ID Token")).toBeTruthy();
    expect(screen.getByText("Access Token")).toBeTruthy();
  });
});
