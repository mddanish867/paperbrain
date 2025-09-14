const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const CHAT_API_URL = `${BASE_URL}/chat`;

import { getAccessToken } from "./auth";

// ✅ Send a chat message
export const sendMessageApi = async ({ message, session_id }) => {
  const token = getAccessToken();

  const res = await fetch(CHAT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ message, session_id }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || error.message || "Chat failed");
  }

  return res.json(); // { reply: "...", session_id: "...", ... }
};

// ✅ Get conversation history
export const getChatHistoryApi = async (session_id) => {
  const token = getAccessToken();

  const res = await fetch(`${CHAT_API_URL}/history/${session_id}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) throw new Error("Failed to fetch chat history");
  return res.json(); // { messages: [...], session_id: "..." }
};

// ✅ Clear chat history
export const clearChatHistoryApi = async (session_id) => {
  const token = getAccessToken();

  const res = await fetch(`${CHAT_API_URL}/history/${session_id}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) throw new Error("Failed to clear chat history");
  return res.json(); // { message: "Chat history cleared for session ..." }
};

// ✅ List chat sessions
export const listSessionsApi = async () => {
  const token = getAccessToken();

  const res = await fetch(`${CHAT_API_URL}/sessions`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) throw new Error("Failed to fetch sessions");
  return res.json(); // { sessions: [...] }
};

// ✅ Get session info
export const getSessionInfoApi = async (session_id) => {
  const token = getAccessToken();

  const res = await fetch(`${CHAT_API_URL}/session/${session_id}/info`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Session not found");
  }

  return res.json();
};
