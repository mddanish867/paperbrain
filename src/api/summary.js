const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const SUMMARY_API_URL = `${BASE_URL}/summary`;

import { getAccessToken } from "./auth";

// ============================
// 1️ Generate structured summary (JSON)
// ============================
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

  //  अब backend structured JSON return करता है
  return res.json();
};

// ============================
// 2️ Download DOCX
// ============================
export const downloadSummaryDocxApi = async (doc_id) => {
  const token = getAccessToken();

  const res = await fetch(
    `${SUMMARY_API_URL}/export-docx?doc_id=${doc_id}`,
    {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to download DOCX report");
  }

  return res.blob();
};

// ============================
// 3️ Download PDF
// ============================
export const downloadSummaryPdfApi = async (doc_id) => {
  const token = getAccessToken();

  const res = await fetch(
    `${SUMMARY_API_URL}/export-pdf?doc_id=${doc_id}`,
    {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to download PDF report");
  }

  return res.blob();
};
