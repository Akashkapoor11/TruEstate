// backend/src/db.js
const mongoose = require('mongoose');

async function connect(uri) {
  if (!uri) throw new Error('Please provide MONGODB_URI');
  await mongoose.connect(uri, {
    // options
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('✅ MongoDB connected');
}

module.exports = { connect, mongoose };
