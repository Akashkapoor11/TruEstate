// Load API from environment (Render/Vercel)
const API_BASE_URL = import.meta.env.VITE_API_URL;

console.log("🌐 API BASE URL from ENV:", API_BASE_URL);

// Fallback warning (only warns, does NOT use localhost)
if (!API_BASE_URL) {
  console.error("❌ ERROR: VITE_API_URL is missing! API calls will fail.");
}

// ------------------------------
// Fetch Sales with Filters
// ------------------------------
export const fetchSales = async ({ page = 1, limit = 50, filters = {} }) => {
  const params = new URLSearchParams({ page, limit });

  // Attach filters if present
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.append(key, value);
    }
  });

  const url = `${API_BASE_URL}/api/sales?${params.toString()}`;
  console.log("📡 Request URL:", url);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`❌ API Error ${response.status}: ${response.statusText}`);
      throw new Error("Failed to fetch sales data");
    }

    return await response.json();
  } catch (err) {
    console.error("🔥 Fetch Error:", err);
    throw err;
  }
};
