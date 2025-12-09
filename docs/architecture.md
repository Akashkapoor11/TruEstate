# TruEstate Retail Sales Management System — Architecture Document

This document describes the overall architecture, module structure, data flow, and design decisions for the TruEstate Retail Sales Management System.  
The solution is designed to meet the requirements of the TruEstate SDE Intern Assignment, supporting large-scale sales datasets with streaming, optimized filtering, sorting, and pagination.

---

# 1. System Overview

The project is a **full-stack Retail Sales Dashboard** consisting of:

- **Frontend** → React (Vite), modular component architecture  
- **Backend** → Node.js + Express + MongoDB  
- **Database** → MongoDB Atlas  
- **Deployment** → Render (frontend + backend)  

The system allows users to:

- Search by customer name or phone  
- Apply multiple filters simultaneously  
- Sort results dynamically  
- Paginate through large datasets  
- View KPIs (total units, total discount, total revenue)  

All functionality is fully server-driven for scalability.

---

# 2. High-Level Architecture Diagram

sql
Copy code
               +--------------------+
               |   Frontend (Vite)  |
               | React Components   |
               +---------+----------+
                         |
                         | REST API Calls (Fetch)
                         v
+-------------------+ +------------------------+
| MongoDB Atlas |<--| Backend (Express) |
| Sales Collection | | Controllers/Services|
+-------------------+ +------------------------+
|
| Query Building, Filtering,
| Sorting, Pagination
v
+-----------------------+
| Streaming Data Output |
+-----------------------+

yaml
Copy code

---

# 3. Backend Architecture

Backend root: `/backend`

### **Key Principles**
- Do NOT load entire CSV into memory  
- Use **MongoDB queries + indexes** for fast filtering  
- Apply filters, sorting, pagination **server-side**  
- Modular MVC structure for clarity and testability  

---

## 3.1 Folder Structure

backend/
├── src/
│ ├── controllers/
│ │ └── salesController.js
│ ├── services/
│ │ └── salesService.js
│ ├── routes/
│ │ └── salesRoutes.js
│ ├── utils/
│ │ ├── filters.js
│ │ ├── db.js
│ │ └── index.js
│ └── index.js (express app)
├── scripts/
│ ├── createIndexes.js
│ └── normalizeFields.js
├── package.json
└── .env

markdown
Copy code

---

## 3.2 Backend Modules

### **1. `salesRoutes.js`**
Defines `/api/sales` endpoint and maps to controller.

### **2. `salesController.js`**
- Reads query params (search, filters, pagination, sort)
- Passes clean parameters to service layer
- Returns JSON output to frontend

### **3. `salesService.js`**
Core business logic:
- Builds MongoDB query object  
- Applies search filters  
- Applies range filters (age, date)  
- Applies category-based filters  
- Applies sorting  
- Applies skip/limit for pagination  
- Returns:
  - paginated results  
  - total pages  
  - aggregated totals  

### **4. Utility Files**
- `filters.js` → builds reusable MongoDB filter objects  
- `db.js` → handles MongoDB connection  
- `index.js` → app bootstrap  

### **5. `/scripts`**
- Normalize inconsistent CSV fields before import  
- Create MongoDB indexes (e.g., name, phone, date)

---

## 3.3 Backend Data Flow

1. Frontend calls:  
GET /api/sales?search=karan&gender=Male&sortBy=date_desc&page=1

markdown
Copy code
2. Controller extracts parameters  
3. Service builds a MongoDB query:
- `search` → regex on customer name / phone  
- `date range` → `$gte` / `$lte`  
- `sorting` → `.sort({ Date: -1 })`  
- `pagination` → `.skip()` + `.limit()`  
4. Database executes query  
5. Backend returns:
```json
{
  "data": [...],
  "totalPages": 60900,
  "totals": {
    "totalUnits": 1827756,
    "totalAmount": 4614915757,
    "totalDiscount": 1154317573
  }
}
4. Frontend Architecture
Frontend root: /frontend

Framework: React + Vite
Key Characteristics
Component-based architecture

Stateless UI components

api.js service to isolate fetch logic

Responsive table with scroll handling

Dashboard layout optimized to fit on one page

4.1 Folder Structure
css
Copy code
frontend/
├── src/
│   ├── components/
│   │   ├── FiltersPanel.jsx
│   │   ├── SearchBar.jsx
│   │   ├── SortDropdown.jsx
│   │   ├── TransactionsTable.jsx
│   │   └── PaginationControls.jsx
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   └── main.css
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
4.2 Component Responsibilities
App.jsx
Main dashboard layout

Manages all filters, sorting, pagination state

Calls backend on every filter/sort/page change

Passes results to table component

Displays KPIs

SearchBar.jsx
Top-right global search

Searches on customer name / phone

FiltersPanel.jsx
Dropdown filters (status, store, region, gender, etc.)

Date range picker

Age range filters

SortDropdown.jsx
Allows user to change sorting strategy

Triggers instant re-fetch

TransactionsTable.jsx
Sticky header table

Handles wide-table horizontal scrolling

Displays 25+ columns cleanly

PaginationControls.jsx
Prev / Next

Displays page number and total pages

5. Data Flow Diagram (End-to-end)
pgsql
Copy code
 User Input (Search / Filters / Sort / Page)
                    |
                    v
          React State Updates
                    |
                    v
         api.js → fetch(API_URL)
                    |
                    v
         Express Controller
                    |
                    v
          Sales Service Layer
                    |
    Build MongoDB Query + Sorting + Pagination
                    |
                    v
             MongoDB Execution
                    |
                    v
          Return JSON Result + Totals
                    |
                    v
         React Updates UI Components
6. Database Design
MongoDB Collection: sales
Sample fields

mathematica
Copy code
Transaction ID
Date
Customer ID
Customer Name
Phone Number
Gender
Age
Customer Region
Customer Type
Product ID
Product Name
Brand
Product Category
Tags
Quantity
Price per Unit
Discount Percentage
Total Amount
Final Amount
Payment Method
Order Status
Delivery Type
Store ID
Store Location
Salesperson ID
Employee Name
Indexes Created
json
Copy code
{ "Customer Name": 1 }
{ "Phone Number": 1 }
{ "Date": -1 }
{ "Customer Region": 1 }
{ "Product Category": 1 }
Indexes dramatically improve search and filter performance.

7. Deployment Architecture
Backend Deployment
Platform: Render

Auto-builds Node.js backend

Serves /api/sales endpoint

Environment variables stored securely

Frontend Deployment
Platform: Render (Static Site)

Vite builds into /dist

API URL injected using:

ini
Copy code
VITE_API_URL=https://truestate-4.onrender.com
8. Performance Optimizations
Backend
Streaming CSV import instead of full reads

No in-memory dataset — everything is MongoDB driven

Indexed fields for faster filtering

Pagination ensures constant memory usage

Frontend
No unnecessary re-renders

Filters grouped logically

Table scroll optimized for wide datasets

Responsive header layout

9. Conclusion
This architecture ensures:

Scalable performance

Clean separation of concerns

Maintainable codebase

Assignment-compliant features

Production-ready deployment

The system successfully implements all required functionalities:
✔ Search
✔ Filters
✔ Sorting
✔ Pagination
✔ KPIs
✔ Clean UI/UX
✔ Modular code
✔ Live deployments on Render

10. Deployment Links
Frontend
🔗 https://truestate-21.onrender.com/

Backend
🔗 https://truestate-4.onrender.com/

yaml
Copy code
