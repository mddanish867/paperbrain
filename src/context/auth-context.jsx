import { createContext, useContext, useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { 
  loginApi, 
  registerApi, 
  logoutApi, 
  getCurrentUserApi,
  getAccessToken
} from "../api/auth";

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => getAccessToken());
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Sync with /me on load
  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setUser(null);
        setIsInitialLoading(false);
        return;
      }
      try {
        const data = await getCurrentUserApi(); // Already attaches token
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } catch (err) {
        console.error("Auth check failed:", err.message);
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setIsInitialLoading(false);
      }
    };
    checkAuth();
  }, [token]);

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      // backend returns: { status_code, message, email, token }
      const normalizedUser = {
        username: data?.email?.split("@")[0],
        email: data.email,
      };

      setUser(normalizedUser);
      setToken(data.token.access_token); // Only access_token

      localStorage.setItem("user", JSON.stringify(normalizedUser));
      localStorage.setItem("token", data.token.access_token);
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      setUser({ email: data.email, username: data.email.split("@")[0] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  });

  const value = {
    user,
    token,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    loginLoading: loginMutation.isPending,
    registerLoading: registerMutation.isPending,
    logoutLoading: logoutMutation.isPending,
    isLoading: loginMutation.isPending || registerMutation.isPending || isInitialLoading,
    isInitialLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
