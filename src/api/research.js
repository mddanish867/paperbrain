const BASE_URL = import.meta.env.VITE_API_RSEARCH_BASE_URL;
export const RESEARCH_API_URL = `${BASE_URL}/v1/generate-report`;
export const QUICK_ANALYSIS_API_URL = `${BASE_URL}/v1/quick-analysis`;

import { getAccessToken } from "./auth";

// Generate comprehensive research report
export const generateResearchReportApi = async ({ query, priority = "standard", focus_areas = [] }) => {
  const token = getAccessToken();

  const res = await fetch(RESEARCH_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ 
      query, 
      priority, 
      focus_areas 
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail?.message || error.detail || "Failed to generate research report");
  }

  return res.json();
};

// Generate quick analysis (faster, simplified report)
export const generateQuickAnalysisApi = async ({ query, priority = "standard", focus_areas = [] }) => {
  const token = getAccessToken();

  const res = await fetch(QUICK_ANALYSIS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ 
      query, 
      priority, 
      focus_areas 
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail?.message || error.detail || "Failed to generate quick analysis");
  }

  return res.json();
};