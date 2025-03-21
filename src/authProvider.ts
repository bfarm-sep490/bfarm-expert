import { notification } from "antd";
import { disableAutoLogin } from "./hooks";
import type { AuthProvider } from "@refinedev/core";
import axios from "axios";

export const TOKEN_KEY = "bfarmx-auth";
export const USER_KEY = "bfarmx-user";

const API_URL =
  import.meta.env.VITE_API_URL || "https://api.outfit4rent.online/api";
const authApiClient = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    "Content-Type": "application/json",
    accept: "text/plain",
  },
});

function safelyDecodeJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await authApiClient.post("/auth/login", {
        email,
        password,
      });

      if (response.data.status === 200) {
        const { accessToken } = response.data.data;

        localStorage.setItem(TOKEN_KEY, accessToken);

        const tokenPayload = safelyDecodeJwt(accessToken);

        if (!tokenPayload) {
          return {
            success: false,
            error: {
              message: "Failed to decode token",
              name: "Token decode error",
            },
          };
        }

        const userInfo = {
          id: tokenPayload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
          name: tokenPayload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
          email: tokenPayload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
          role: tokenPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
          avatar: tokenPayload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/uri"],
        };

        localStorage.setItem(USER_KEY, JSON.stringify(userInfo));

        // enableAutoLogin();

        return {
          success: true,
          redirectTo: "/",
        };
      }

      return {
        success: false,
        error: {
          message: "Login failed",
          name: "Invalid response from server",
        },
      };
    } catch (error) {
      const errorMessage =
        (axios.isAxiosError(error) && error.response?.data?.message) ||
        "Login failed. Please check your credentials.";

      notification.error({
        message: "Login Error",
        description: errorMessage,
      });

      return {
        success: false,
        error: {
          message: "Login failed",
          name: errorMessage,
        },
      };
    }
  },
  register: async ({ email, password }) => {
    try {
      await authProvider.login({ email, password });
      return {
        success: true,
      };
    } catch {
      return {
        success: false,
        error: {
          message: "Register failed",
          name: "Invalid email or password",
        },
      };
    }
  },
  updatePassword: async () => {
    notification.success({
      message: "Updated Password",
      description: "Password updated successfully",
    });
    return {
      success: true,
    };
  },
  forgotPassword: async ({ email }) => {
    notification.success({
      message: "Reset Password",
      description: `Reset password link sent to "${email}"`,
    });
    return {
      success: true,
    };
  },
  logout: async () => {
    disableAutoLogin();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  onError: async (error) => {
    if (error.response?.status === 401) {
      return {
        logout: true,
        redirectTo: "/login",
        error: {
          message: "Session expired",
          name: "Unauthorized",
        },
      };
    }

    return { error };
  },
  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      return {
        authenticated: false,
        error: {
          message: "Check failed",
          name: "Token not found",
        },
        logout: true,
        redirectTo: "/login",
      };
    }

    try {
      const tokenPayload = safelyDecodeJwt(token);

      if (!tokenPayload) {
        return {
          authenticated: false,
          error: {
            message: "Invalid token format",
            name: "Token decode error",
          },
          logout: true,
          redirectTo: "/login",
        };
      }

      const expirationTime = tokenPayload.exp * 1000;

      if (Date.now() >= expirationTime) {
        return {
          authenticated: false,
          error: {
            message: "Session expired",
            name: "Token expired",
          },
          logout: true,
          redirectTo: "/login",
        };
      }

      return {
        authenticated: true,
      };
    } catch (error) {
      console.error("Token verification error:", error);
      return {
        authenticated: false,
        error: {
          message: "Invalid token",
          name: "Token verification error",
        },
        logout: true,
        redirectTo: "/login",
      };
    }
  },

  getPermissions: async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        return null;
      }

      const tokenPayload = safelyDecodeJwt(token);
      return tokenPayload
        ? tokenPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
        : null;
    } catch (error) {
      console.error("Error getting permissions:", error);
      return null;
    }
  },

  getIdentity: async () => {
    try {
      const userStr = localStorage.getItem(USER_KEY);

      if (!userStr) {
        return null;
      }

      const user = JSON.parse(userStr);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || "https://i.pravatar.cc/150",
      };
    } catch (error) {
      console.error("Error getting identity:", error);
      return null;
    }
  },
};
