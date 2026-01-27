const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const CHAT_API_URL = `${BASE_URL}/chat`;

import { getAccessToken } from "./auth";

// Regular chat (kept for backward compatibility)
export const sendMessageApi = async ({ message, session_id, document_id }) => {
  const token = getAccessToken();

  const res = await fetch(CHAT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      message,
      session_id,
      document_id,
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || error.message || "Chat failed");
  }

  return res.json();
};

// Streaming chat
export const sendMessageStreamApi = async ({ message, session_id, document_id }) => {
  const token = getAccessToken();

  const res = await fetch(`${CHAT_API_URL}/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      message,
      session_id,
      document_id,
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || error.message || "Chat failed");
  }

  return res;
};

// Submit feedback
export const sendFeedbackApi = async ({ message_id, feedback_type, session_id }) => {
  const token = getAccessToken();

  const res = await fetch(`${CHAT_API_URL}/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      message_id,
      feedback_type,
      session_id,
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || error.message || "Feedback failed");
  }

  return res.json();
};

// Get conversation history
export const getChatHistoryApi = async (session_id) => {
  const token = getAccessToken();

  const res = await fetch(`${CHAT_API_URL}/history/${session_id}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) throw new Error("Failed to fetch chat history");
  return res.json(); 
};

// Regenerate answer with streaming
export const regenerateAnswerApi = async ({ message_id, session_id, document_id }) => {
  const token = getAccessToken();

  const res = await fetch(`${CHAT_API_URL}/regenerate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      message_id,
      session_id,
      document_id,
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || error.message || "Regeneration failed");
  }

  return res;
};



// Share message
export const shareMessageApi = async ({ message_id, message_text }) => {
  const token = getAccessToken();

  try {
    // For now, just copy to clipboard
    await navigator.clipboard.writeText(message_text);
    
    // Also send to backend for analytics
    const res = await fetch(`${CHAT_API_URL}/share`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        message_id,
        message_text,
      }),
    });

    if (!res.ok) {
      console.error("Share analytics failed, but clipboard copy succeeded");
    }

    return { success: true, message: "Message copied to clipboard!" };
  } catch (error) {
    throw new Error("Failed to share message");
  }
};







