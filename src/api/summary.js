const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const SUMMARY_API_URL = `${BASE_URL}/summary`;

import { getAccessToken } from "./auth";

export const generateSummaryApi = async ({ doc_id, session_id }) => {
  const token = getAccessToken();

  const res = await fetch(SUMMARY_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ doc_id, session_id }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to generate summary");
  }

  return res.json(); // { summary: "..." }
};
