// scripts/normalizeFields.js
require('dotenv').config();
const { connect, mongoose } = require('../src/db');

const mapping = {
  'Transaction ID': 'transactionId',
  'Date': 'date',
  'Customer ID': 'customerId',
  'Customer Name': 'customerName',
  'Phone Number': 'phoneNumber',
  'Gender': 'gender',
  'Age': 'age',
  'Customer Region': 'customerRegion',
  'Customer Type': 'customerType',
  'Product ID': 'productId',
  'Product Name': 'productName',
  'Brand': 'brand',
  'Product Category': 'productCategory',
  'Tags': 'tags',
  'Quantity': 'quantity',
  'Price per Unit': 'pricePerUnit',
  'Discount %': 'discountPercent',
  'Total Amount': 'totalAmount',
  'Final Amount': 'finalAmount',
  'Payment Method': 'paymentMethod',
  'Order Status': 'orderStatus',
  'Delivery Type': 'deliveryType',
  'Store ID': 'storeId',
  'Store Location': 'storeLocation',
  'Salesperson ID': 'salespersonId',
  'Employee Name': 'employeeName'
};

(async () => {
  try {
    await connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const coll = db.collection('sales');

    console.log('Starting field rename for sample of documents...');
    // Bulk update: add new field and unset old field
    const bulkOps = [];
    // For large collection do this in batches; here is a streaming approach
    const cursor = coll.find({}, { projection: Object.keys(mapping).reduce((p,k)=>{p[k]=1;return p;},{}) });

    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      const update = {};
      for (const [oldKey, newKey] of Object.entries(mapping)) {
        if (doc.hasOwnProperty(oldKey)) {
          update[newKey] = doc[oldKey];
        }
      }
      if (Object.keys(update).length) {
        bulkOps.push({
          updateOne: {
            filter: { _id: doc._id },
            update: { $set: update, $unset: Object.keys(mapping).reduce((u,k)=>{u[k]="";return u;},{}) }
          }
        });
      }
      if (bulkOps.length >= 500) {
        await coll.bulkWrite(bulkOps, { ordered: false });
        console.log('Wrote 500 ops');
        bulkOps.length = 0;
      }
    }
    if (bulkOps.length) {
      await coll.bulkWrite(bulkOps, { ordered: false });
    }
    console.log('Field normalization complete.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('normalize error', err);
    process.exit(1);
  }
})();
