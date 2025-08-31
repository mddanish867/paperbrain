// api/auth.js

// Base API URL
export const API_URL = "http://127.0.0.1:8000/auth";

// ------------------- TOKEN HELPERS ------------------- //
export const saveTokens = ({ access_token, refresh_token }) => {
  if (access_token) localStorage.setItem("token", access_token);
  if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
};

export const clearTokens = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
};

export const getAccessToken = () => localStorage.getItem("token");
export const getRefreshToken = () => localStorage.getItem("refresh_token");

// ------------------- GENERIC FETCH WRAPPER ------------------- //
export const authFetch = async (url, options = {}) => {
  const token = getAccessToken();

  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = "Request failed";
    try {
      const error = await response.json();
      errorMsg = error.detail || error.message || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  return response.json();
};

// ------------------- AUTH ROUTES ------------------- //

// 1. Register
export const registerApi = async ({ username, email, password }) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || error.message || "Registration failed");
  }

  return res.json();
};

// 2. Verify Account (OTP)
export const verifyAccountApi = async ({ email, otp }) => {
  return authFetch("/verify-account", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
};

// 3. Resend OTP
export const resendOtpApi = async ({ email }) => {
  return authFetch("/resend-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

// 4. Login
export const loginApi = async ({ username_or_email, password }) => {
  const payload = { username_or_email, password };

  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || error.message || "Login failed");
  }

  const data = await res.json();

  // ✅ Correctly extract access/refresh tokens
  if (data.token) {
    saveTokens({
      access_token: data.token.access_token,
      refresh_token: data.token.refresh_token,
    });
  }

  return data;
};

// 5. Forgot Password
export const forgotPasswordApi = async ({ email }) => {
  return authFetch("/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

// 6. Reset Password
export const resetPasswordApi = async ({ email, token, new_password }) => {
  return authFetch("/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, token, new_password }),
  });
};

// 7. Refresh Token
export const refreshTokenApi = async () => {
  const refresh_token = getRefreshToken();
  if (!refresh_token) throw new Error("No refresh token available");

  const res = await fetch(`${API_URL}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || error.message || "Token refresh failed");
  }

  const data = await res.json();
  saveTokens({
    access_token: data.access_token || data.token,
    refresh_token: data.refresh_token,
  });

  return data;
};

// 8. Get Current User
export const getCurrentUserApi = async () => {
  return authFetch("/me", { method: "GET" });
};

// 9. Logout
export const logoutApi = async () => {
  clearTokens();
  return { success: true };
};
