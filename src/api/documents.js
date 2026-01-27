const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const DOCS_API_URL = `${BASE_URL}/documents`;

import { getAccessToken } from "./auth";

// Upload PDF
export const uploadDocumentApi = async (file) => {
  const token = getAccessToken();
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${DOCS_API_URL}/upload`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || error.message || "Upload failed");
  }

  return res.json();
};

//  Delete Session (Document + Chats)
export const deleteSessionApi = async (sessionId) => {
  const token = getAccessToken();

  const res = await fetch(
    `${DOCS_API_URL}/sessions/${sessionId}`,
    {
      method: "DELETE",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.detail || error.message || "Failed to delete session"
    );
  }

  return res.json();
};


//  Rename Session
export const renameSessionApi = async (sessionId, filename) => {
  const token = getAccessToken();

  const res = await fetch(
    `${DOCS_API_URL}/sessions/${sessionId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ filename }),
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.detail || error.message || "Failed to rename session"
    );
  }

  return res.json();
};

// List User Document Sessions (NEW – sidebar use)
export const listDocumentSessionsApi = async () => {
  const token = getAccessToken();

  const res = await fetch(`${DOCS_API_URL}/sessions`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.detail || error.message || "Failed to fetch document sessions"
    );
  }

  return res.json();
};


