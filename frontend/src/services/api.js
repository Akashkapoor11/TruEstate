// 👇 ALWAYS load API URL from environment
const API_BASE_URL = import.meta.env.VITE_API_URL;

console.log("🌍 Loaded API BASE URL:", API_BASE_URL);

// Safety check: prevent localhost from being used in production
if (!API_BASE_URL || API_BASE_URL.includes("localhost")) {
  console.warn("⚠️ WARNING: Invalid API URL. Backend will not load.");
}

// ----------------------
// Fetch sales data
// ----------------------
export const fetchSales = async ({ 
  page = 1, 
  limit = 50, 
  filters = {} 
}) => {

  const params = new URLSearchParams({ page, limit });

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.append(key, value);
    }
  });

  const url = `${API_BASE_URL}/api/sales?${params.toString()}`;

  console.log("📡 Fetching from:", url);

  const response = await fetch(url);

  if (!response.ok) {
    console.error("❌ API fetch failed:", response.status, response.statusText);
    throw new Error("Failed to fetch sales data");
  }

  return response.json();
};
