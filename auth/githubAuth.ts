// auth/githubAuth.ts
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

const TOKEN_STORAGE_KEY = "@github_token";

// GitHub OAuth endpoints
const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint:
    "https://github.com/settings/connections/applications/YOUR_CLIENT_ID",
};

// Config for auth request
const config = {
  clientId: "Ov23liVr4oL1TyFxpnHq",
  scopes: ["user", "repo", "read:user"], // Add scopes you need
  redirectUri: makeRedirectUri({
    scheme: "github-stats",
  }),
};

export function useGitHubAuth() {
  const [request, response, promptAsync] = useAuthRequest(config, discovery);

  // Function to exchange code for token
  const getToken = async (code: string) => {
    try {
      const tokenResponse = await fetch(
        "https://github.com/login/oauth/access_token",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client_id: config.clientId,
            client_secret: "28d6bb048ca3b385ff900250ecf47bffd46f5513", // Be careful with this
            code,
          }),
        }
      );

      const data = await tokenResponse.json();
      if (data.access_token) {
        await AsyncStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);
        return data.access_token;
      }
      throw new Error("Failed to get access token");
    } catch (error) {
      console.error("Error getting token:", error);
      throw error;
    }
  };

  return {
    request,
    response,
    promptAsync,
    getToken,
  };
}

// Helper functions for token management
export const getStoredToken = () => AsyncStorage.getItem(TOKEN_STORAGE_KEY);
export const removeStoredToken = () =>
  AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
