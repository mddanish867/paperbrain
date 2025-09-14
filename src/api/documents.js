const BASE_URL = import.meta.env.API_BASE_URL;
export const DOCS_API_URL = `${BASE_URL}/documents`;

import { getAccessToken } from "./auth";

// ✅ Upload PDF
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

// ✅ List Documents
export const listDocumentsApi = async () => {
  const token = getAccessToken();
  const res = await fetch(DOCS_API_URL, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json();
};

// ✅ Delete Document
export const deleteDocumentApi = async (docId) => {
  const token = getAccessToken();
  const res = await fetch(`${DOCS_API_URL}/${docId}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error("Failed to delete document");
  return res.json();
};
