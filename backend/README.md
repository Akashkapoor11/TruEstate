# Backend (Streaming-ready)

## Setup

1. Place your CSV dataset at `backend/src/data/sales_data.csv`.
2. Install dependencies:
   ```
   cd backend
   npm install
   ```
3. Start the backend:
   ```
   npm run dev
   ```
   or
   ```
   npm start
   ```

API endpoints:
- GET /api/sales  -> query sales. Accepts query parameters described in the assignment (search, region[], gender[], minAge, maxAge, category[], tags[], paymentMethod[], startDate, endDate, sortBy, sortOrder, page, pageSize)
- GET /api/sales/meta -> returns lists for regions, genders, categories, tags, paymentMethods
