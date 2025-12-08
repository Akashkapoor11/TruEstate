// frontend/src/services/api.js

const rawBase = (import.meta.env.VITE_API_URL || "http://localhost:3001").trim();
// remove trailing slash if present
const API_BASE_URL = rawBase.replace(/\/+$/, "");

console.log("FRONTEND -> API_BASE:", API_BASE_URL);

export const fetchSales = async ({ page = 1, limit = 50, filters = {} } = {}) => {
  const params = new URLSearchParams({ page, limit });

  Object.entries(filters).forEach(([k, v]) => {
    if (v !== "" && v !== null && v !== undefined) params.append(k, v);
  });

  const url = `${API_BASE_URL}/api/sales?${params.toString()}`;
  console.log("Fetching sales:", url);

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      console.error("Fetch failed", res.status, res.statusText, txt);
      throw new Error(`Failed to fetch sales: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
};
