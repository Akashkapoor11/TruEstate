const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Fetch paginated and filtered sales data
export const fetchSales = async ({ page = 1, limit = 50, filters = {} }) => {
  const params = new URLSearchParams({ page, limit });

  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  const response = await fetch(`${API_BASE_URL}/api/sales?${params.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch sales data");

  return response.json();
};
