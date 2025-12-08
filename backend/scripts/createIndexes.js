// scripts/createIndexes.js
require('dotenv').config();
const { connect, mongoose } = require('../src/db');

(async () => {
  try {
    await connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const coll = db.collection('sales');

    console.log('Creating text index on customerName and phoneNumber (if not exists)...');
    await coll.createIndex({ customerName: 'text', phoneNumber: 'text' }, { name: 'TextCustomer_Phone' });

    console.log('Creating index on customerRegion...');
    await coll.createIndex({ customerRegion: 1 });

    console.log('Creating index on productCategory...');
    await coll.createIndex({ productCategory: 1 });

    console.log('Creating index on date (descending)...');
    await coll.createIndex({ date: -1 });

    console.log('Creating index on tags...');
    await coll.createIndex({ tags: 1 });

    console.log('Indexes created.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('index creation error', err);
    process.exit(1);
  }
})();
