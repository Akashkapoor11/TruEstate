// backend/src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connect } = require('./db'); // keep your db connection file
const salesRoutes = require('./routes/salesRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

(async () => {
  try {
    await connect(MONGODB_URI);
    app.get('/', (req, res) => res.send('Backend running'));
    app.use('/api/sales', salesRoutes);
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start', err);
    process.exit(1);
  }
})();
