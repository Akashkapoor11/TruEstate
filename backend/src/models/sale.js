// backend/src/models/sale.js
const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  "Transaction ID": { type: Number, index: true },
  Date: { type: String }, // "YYYY-MM-DD" stored as string from CSV
  "Customer ID": String,
  "Customer Name": { type: String, index: true },
  "Phone Number": String,
  Gender: String,
  Age: Number,
  "Customer Region": String,
  "Customer Type": String,
  "Product ID": String,
  "Product Name": String,
  Brand: String,
  "Product Category": String,
  Tags: String,
  Quantity: Number,
  "Price per Unit": Number,
  "Discount Percentage": Number,
  "Total Amount": Number,
  "Final Amount": Number,
  "Payment Method": String,
  "Order Status": String,
  "Delivery Type": String,
  "Store ID": String,
  "Store Location": String,
  "Salesperson ID": String,
  "Employee Name": String,
}, { collection: 'sales' }); // ensure it uses the 'sales' collection

module.exports = mongoose.model('Sale', SaleSchema);
