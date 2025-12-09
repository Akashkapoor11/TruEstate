// frontend/src/App.js
import React, { useEffect, useState } from "react";
import "./styles/main.css";

// Load API base URL from env (set VITE_API_URL in Render/Vercel).
// If missing, fallback to the Render backend you already have.
const RAW_API_BASE = import.meta.env.VITE_API_URL || "https://truestate-4.onrender.com";
const API_BASE_URL = RAW_API_BASE.replace(/\/+$/, ""); // remove trailing slash(s)

console.log("🌍 API_BASE_URL =", API_BASE_URL);
if (!API_BASE_URL || API_BASE_URL.includes("localhost")) {
  console.warn(
    "⚠️ API_BASE_URL is not set or points to localhost. Set VITE_API_URL to your Render backend URL."
  );
}

function App() {
  const [data, setData] = useState([]);

  // FILTER STATES
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [store, setStore] = useState("");
  const [region, setRegion] = useState("");
  const [gender, setGender] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [category, setCategory] = useState("");
  const [payment, setPayment] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // sorting key must match backend keys
  const [sortBy, setSortBy] = useState("date_desc");

  // pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // totals returned by backend
  const [totals, setTotals] = useState({
    totalUnits: 0,
    totalAmount: 0,
    totalDiscount: 0
  });

  const PAGE_SIZE = 10;

  const fetchData = async () => {
    const params = new URLSearchParams({
      search,
      status,
      store,
      region,
      gender,
      minAge,
      maxAge,
      category,
      payment,
      startDate,
      endDate,
      sortBy,
      page,
      pageSize: PAGE_SIZE
    });

    // Build URL safely
    const url = new URL("/api/sales", API_BASE_URL);
    url.search = params.toString();

    console.log("📡 Fetching:", url.toString());

    try {
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      const json = await res.json();

      setData(json.data || []);
      setTotalPages(json.totalPages || 1);
      setTotals(json.totals || { totalUnits: 0, totalAmount: 0, totalDiscount: 0 });
    } catch (err) {
      console.error("Fetch Error:", err);
      setData([]);
      setTotalPages(1);
      setTotals({ totalUnits: 0, totalAmount: 0, totalDiscount: 0 });
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, sortBy]); // eslint-disable-line

  const applyFilters = () => {
    setPage(1);
    setTimeout(fetchData, 0);
  };

  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setStore("");
    setRegion("");
    setGender("");
    setMinAge("");
    setMaxAge("");
    setCategory("");
    setPayment("");
    setStartDate("");
    setEndDate("");
    setSortBy("date_desc");
    setPage(1);
    setTimeout(fetchData, 0);
  };

  const onSortChange = (val) => {
    setSortBy(val);
    setPage(1);
    setTimeout(fetchData, 0);
  };

  const formatNumber = (n) => Number(n || 0).toLocaleString();
  const formatCurrency = (n) => `₹${Number(n || 0).toLocaleString()}`;

  return (
    <div className="dashboard">
      <div className="header-row">
        <h1 className="brand-title">Sales Management System</h1>
        <div className="search-inline">
          <input
            type="text"
            placeholder="Search by Customer Name or Phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn-primary" onClick={applyFilters}>
            Search
          </button>
        </div>
      </div>

      <div className="filter-bar">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option>Completed</option>
          <option>Pending</option>
          <option>Cancelled</option>
          <option>Returned</option>
        </select>

        <select value={store} onChange={(e) => setStore(e.target.value)}>
          <option value="">All Stores</option>
          <option>Delhi</option>
          <option>Mumbai</option>
          <option>Kolkata</option>
          <option>Pune</option>
          <option>Bengaluru</option>
          <option>Jaipur</option>
        </select>

        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="">All Regions</option>
          <option>North</option>
          <option>South</option>
          <option>East</option>
          <option>West</option>
          <option>Central</option>
        </select>

        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">All Genders</option>
          <option>Male</option>
          <option>Female</option>
        </select>

        <input type="number" placeholder="Min Age" value={minAge} onChange={(e) => setMinAge(e.target.value)} />
        <input type="number" placeholder="Max Age" value={maxAge} onChange={(e) => setMaxAge(e.target.value)} />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option>Beauty</option>
          <option>Clothing</option>
          <option>Electronics</option>
        </select>

        <select value={payment} onChange={(e) => setPayment(e.target.value)}>
          <option value="">All Payments</option>
          <option>Cash</option>
          <option>UPI</option>
          <option>Debit Card</option>
          <option>Credit Card</option>
          <option>Wallet</option>
          <option>Net Banking</option>
        </select>

        <div className="date-group">
          <label>Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <label>End Date</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>

        <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
          <option value="date_desc">Date (Newest → Oldest)</option>
          <option value="date_asc">Date (Oldest → Newest)</option>
          <option value="name_asc">Customer Name (A → Z)</option>
          <option value="name_desc">Customer Name (Z → A)</option>
          <option value="qty_desc">Quantity (High → Low)</option>
          <option value="qty_asc">Quantity (Low → High)</option>
        </select>

        <button className="btn-primary" onClick={applyFilters}>
          Apply Filters
        </button>
        <button className="reset-btn" onClick={resetFilters}>Reset</button>
      </div>

      <div style={{ display: "flex", gap: 12, margin: "18px 0" }}>
        <div className="kpi-card">
          <div className="kpi-title">Total units sold</div>
          <div className="kpi-value">{formatNumber(totals.totalUnits)}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">Total Amount</div>
          <div className="kpi-value">{formatCurrency(totals.totalAmount)}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">Total Discount</div>
          <div className="kpi-value">{formatCurrency(totals.totalDiscount)}</div>
        </div>
      </div>

      <div className="table-outer">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Customer ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Region</th>
                <th>Customer Type</th>
                <th>Product ID</th>
                <th>Product</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Tags</th>
                <th>Qty</th>
                <th>Price/Unit</th>
                <th>Discount %</th>
                <th>Total Amount</th>
                <th>Final Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Delivery</th>
                <th>Store ID</th>
                <th>Store</th>
                <th>Salesperson ID</th>
                <th>Employee</th>
              </tr>
            </thead>
            <tbody>
              {data.length ? (
                data.map((item) => (
                  <tr key={(item["Transaction ID"] || "") + "-" + (item._id || "")}>
                    <td>{item["Transaction ID"]}</td>
                    <td>{item["Date"]}</td>
                    <td>{item["Customer ID"]}</td>
                    <td>{item["Customer Name"]}</td>
                    <td>{item["Phone Number"]}</td>
                    <td>{item["Gender"]}</td>
                    <td>{item["Age"]}</td>
                    <td>{item["Customer Region"]}</td>
                    <td>{item["Customer Type"]}</td>
                    <td>{item["Product ID"]}</td>
                    <td>{item["Product Name"]}</td>
                    <td>{item["Brand"]}</td>
                    <td>{item["Product Category"]}</td>
                    <td>{item["Tags"]}</td>
                    <td>{item["Quantity"]}</td>
                    <td>{item["Price per Unit"]}</td>
                    <td>{item["Discount Percentage"]}</td>
                    <td>{item["Total Amount"]}</td>
                    <td>{item["Final Amount"]}</td>
                    <td>{item["Payment Method"]}</td>
                    <td>{item["Order Status"]}</td>
                    <td>{item["Delivery Type"]}</td>
                    <td>{item["Store ID"]}</td>
                    <td>{item["Store Location"]}</td>
                    <td>{item["Salesperson ID"]}</td>
                    <td>{item["Employee Name"]}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="27" style={{ textAlign: "center", padding: 20 }}>
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
        <span>Page {page} / {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
      </div>
    </div>
  );
}

export default App;
