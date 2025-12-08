import React from "react";

function SortDropdown({ sortBy, sortOrder, onChange }) {
  const handle = (value) => {
    if (value === "date") {
      onChange({ sortBy: "date", sortOrder: "desc" });
    } else if (value === "quantity") {
      onChange({ sortBy: "quantity", sortOrder: "desc" });
    } else if (value === "customerName") {
      onChange({ sortBy: "customerName", sortOrder: "asc" });
    }
  };

  let selected = "date";
  if (sortBy === "quantity") selected = "quantity";
  if (sortBy === "customerName") selected = "customerName";

  return (
    <select value={selected} onChange={(e) => handle(e.target.value)}>
      <option value="date">Date (Newest first)</option>
      <option value="quantity">Quantity (High to Low)</option>
      <option value="customerName">Customer Name (A–Z)</option>
    </select>
  );
}

export default SortDropdown;
