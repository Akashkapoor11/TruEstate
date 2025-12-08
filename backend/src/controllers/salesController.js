// backend/src/controllers/salesController.js
const salesService = require('../services/salesService');

async function getSales(req, res) {
  try {
    const result = await salesService.findSales(req.query);
    res.json(result);
  } catch (err) {
    console.error('getSales error', err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { getSales };
