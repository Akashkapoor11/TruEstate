import React from "react";

function TransactionsTable({ data, loading }) {
  if (loading) {
    return (
      <div className="card">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  if (!loading && (!data || data.length === 0)) {
    return (
      <div className="card">
        <p>No results found. Try changing filters or search.</p>
      </div>
    );
  }

  return (
    <div className="card table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Region</th>
            <th>Product</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Final Amount</th>
            <th>Payment</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={(row.customerId || "") + (row.productId || "") + idx}>
              <td>{row.date}</td>
              <td>{row.customerName}</td>
              <td>{row.phoneNumber}</td>
              <td>{row.customerRegion}</td>
              <td>{row.productName}</td>
              <td>{row.productCategory}</td>
              <td>{row.quantity}</td>
              <td>{row.finalAmount}</td>
              <td>{row.paymentMethod}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionsTable;
