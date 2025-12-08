{"variant":"standard","id":"58311"}
import { useEffect, useState } from "react";
import { fetchMeta } from "../services/api";

export default function FiltersPanel({ filters, setFilters, applyFilters }) {
  const [meta, setMeta] = useState({
    regions: [],
    genders: [],
    categories: [],
    paymentMethods: [],
  });

  useEffect(() => {
    fetchMeta().then(setMeta).catch(console.error);
  }, []);

  const update = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="filters-panel">
      <h3>Filters</h3>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or phone"
        value={filters.search || ""}
        onChange={(e) => update("search", e.target.value)}
      />

      {/* Regions */}
      <select onChange={(e) => update("regions", [e.target.value])}>
        <option value="">Select Region</option>
        {meta.regions.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>

      {/* Gender */}
      <select onChange={(e) => update("genders", [e.target.value])}>
        <option value="">Select Gender</option>
        {meta.genders.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>

      {/* Category */}
      <select onChange={(e) => update("categories", [e.target.value])}>
        <option value="">Select Category</option>
        {meta.categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* Payment Method */}
      <select onChange={(e) => update("paymentMethods", [e.target.value])}>
        <option value="">Select Payment Method</option>
        {meta.paymentMethods.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      <button onClick={applyFilters}>Apply</button>
    </div>
  );
}
