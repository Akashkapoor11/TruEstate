// backend/src/services/salesService.js
const Sales = require('../models/sale'); // adjust if your model file name is different (sale.js)
const DEFAULT_PAGE_SIZE = 10;

function arrayFromParam(param) {
  if (!param) return null;
  if (Array.isArray(param)) return param;
  return String(param).split(',').map(s => s.trim()).filter(Boolean);
}

function buildMatchFromQuery(qs) {
  const match = {};

  // Search (exact word match for name, regex fallback for phone)
  if (qs.search && String(qs.search).trim()) {
    const term = String(qs.search).trim();
    // word boundary regex for customer name (so "neha" doesn't match "Sneha")
    const nameRegex = { $regex: `\\b${term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\b`, $options: 'i' };
    const phoneRegex = { $regex: term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), $options: 'i' };
    match.$or = [
      { 'Customer Name': nameRegex },
      { 'Phone Number': phoneRegex }
    ];
  }

  // simple equality filters (support comma-separated values)
  if (qs.status) {
    const arr = arrayFromParam(qs.status); if (arr) match['Order Status'] = { $in: arr };
  }
  if (qs.store) {
    const arr = arrayFromParam(qs.store); if (arr) match['Store Location'] = { $in: arr };
  }
  if (qs.region) {
    const arr = arrayFromParam(qs.region); if (arr) match['Customer Region'] = { $in: arr };
  }
  if (qs.gender) {
    const arr = arrayFromParam(qs.gender); if (arr) match['Gender'] = { $in: arr };
  }
  if (qs.category) {
    const arr = arrayFromParam(qs.category); if (arr) match['Product Category'] = { $in: arr };
  }
  if (qs.payment) {
    const arr = arrayFromParam(qs.payment); if (arr) match['Payment Method'] = { $in: arr };
  }

  // Age range
  if (qs.minAge || qs.maxAge) {
    match['Age'] = {};
    if (qs.minAge) match['Age'].$gte = Number(qs.minAge);
    if (qs.maxAge) match['Age'].$lte = Number(qs.maxAge);
  }

  // Date range: expects ISO dates from frontend or 'YYYY-MM-DD'
  if (qs.startDate || qs.endDate) {
    match['Date'] = {};
    if (qs.startDate) {
      const d = new Date(qs.startDate);
      if (!isNaN(d)) match['Date'].$gte = d.toISOString().split('T')[0];
      else match['Date'].$gte = qs.startDate;
    }
    if (qs.endDate) {
      const d = new Date(qs.endDate);
      if (!isNaN(d)) match['Date'].$lte = d.toISOString().split('T')[0];
      else match['Date'].$lte = qs.endDate;
    }
  }

  return match;
}

function buildSort(sortBy) {
  const map = {
    'date_desc': { 'Date': -1 },
    'date_asc': { 'Date': 1 },
    'name_asc': { 'Customer Name': 1 },
    'name_desc': { 'Customer Name': -1 },
    'qty_desc': { 'Quantity': -1 },
    'qty_asc': { 'Quantity': 1 },
    'transaction_asc': { 'Transaction ID': 1 },
    'transaction_desc': { 'Transaction ID': -1 },
  };
  return map[sortBy] || { 'Date': -1 };
}

/**
 * findSales - returns paginated data + totals for filtered set (totals computed on whole filtered set)
 * queryString: { page, pageSize, sortBy, ...filters }
 */
async function findSales(queryString) {
  let {
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    sortBy
  } = queryString;

  page = Math.max(1, parseInt(page, 10) || 1);
  pageSize = Math.max(1, parseInt(pageSize, 10) || DEFAULT_PAGE_SIZE);

  const match = buildMatchFromQuery(queryString);
  const sort = buildSort(sortBy);

  const skip = (page - 1) * pageSize;

  // Aggregation pipeline using facet:
  //  - metadata.count
  //  - paginated data
  //  - totals over all matched docs
  const pipeline = [
    { $match: match },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [
          { $sort: sort },
          { $skip: skip },
          { $limit: pageSize }
        ],
        totals: [
          {
            $group: {
              _id: null,
              totalUnits: { $sum: { $toDouble: { $ifNull: ["$Quantity", 0] } } },
              totalAmount: { $sum: { $toDouble: { $ifNull: ["$Total Amount", 0] } } },
              totalFinalAmount: { $sum: { $toDouble: { $ifNull: ["$Final Amount", 0] } } }
            }
          }
        ]
      }
    }
  ];

  const aggRes = await Sales.aggregate(pipeline).allowDiskUse(true).exec();

  const facet = (aggRes && aggRes[0]) || {};
  const total = (facet.metadata && facet.metadata[0] && facet.metadata[0].total) || 0;
  const docs = facet.data || [];

  const totalsDoc = (facet.totals && facet.totals[0]) || { totalUnits: 0, totalAmount: 0, totalFinalAmount: 0 };

  const totalUnits = Number(totalsDoc.totalUnits || 0);
  const totalAmount = Number(totalsDoc.totalAmount || 0);
  const totalFinalAmount = Number(totalsDoc.totalFinalAmount || 0);
  const totalDiscount = Number((totalAmount - totalFinalAmount) || 0);

  return {
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    data: docs,
    totals: {
      totalUnits,
      totalAmount,
      totalDiscount
    }
  };
}

module.exports = { findSales };
