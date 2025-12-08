import React from "react";

function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search by customer name or phone..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "8px 12px",
        borderRadius: 8,
        border: "1px solid #d1d5db",
        fontSize: 14
      }}
    />
  );
}

export default SearchBar;
