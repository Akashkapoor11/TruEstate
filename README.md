# TruEstate Retail Sales Management System

A full-stack Retail Sales Management System built for the TruEstate SDE Intern assignment.  
The system supports real-time search, multi-field filtering, sorting, and server-side pagination over a large sales dataset.  
Backend is optimized for streaming responses without loading the whole CSV in memory, and frontend provides a clean dashboard UI.

---

## 🚀 Live Deployment

### **Frontend (React + Vite)**
🔗 https://truestate-21.onrender.com/

### **Backend (Node.js + Express + MongoDB)**
🔗 https://truestate-4.onrender.com/

---

## 🛠 Tech Stack

### **Frontend**
- React (Vite)
- Custom Components (Search, Filters, Table, Sorting, Pagination)
- CSS (Modular, responsive layout)
- Fetch API for backend communication

### **Backend**
- Node.js + Express
- MongoDB Atlas
- CSV Streaming (No full memory loading)
- Modular MVC structure (controllers, services, utils)
- Query-based filtering + sorting + pagination

---

## 🔍 Search Implementation

Search is performed on:
- **Customer Name**
- **Phone Number**

Features:
- Case-insensitive regex search  
- Works with filters, sorting, and pagination  
- Server-side for scalability  

Backend logic:
- Builds a `$or` query using regex  
- Efficient indexed search (text or field-based)

---

## 🎯 Filter Implementation

Filters supported:
- Status  
- Store  
- Region  
- Gender  
- Age Range (minAge, maxAge)  
- Category  
- Payment Method  
- Date Range (startDate, endDate)

Behavior:
- Each filter works independently  
- Filters combine seamlessly with search + sorting  
- Invalid filters gracefully return zero results  
- Server-side queries ensure performance  

---

## 🔽 Sorting Implementation

Sorting fields:
- **Date** (Newest → Oldest / Oldest → Newest)  
- **Customer Name** (A → Z / Z → A)  
- **Quantity** (High → Low / Low → High)  

Mechanism:
- Sorting key maps to backend query  
- Returned dataset always respects filters + search  
- Sorting resets pagination to page 1  

---

## 📄 Pagination Implementation

- **10 items per page**
- `Prev` / `Next` navigation
- Displays current page and total pages
- Server-side skip/limit ensures scalability
- Pagination retains active search, filter, sort state

---

## 📦 Project Structure

root/
├── backend/
│ ├── src/
│ │ ├── controllers/
│ │ ├── services/
│ │ ├── routes/
│ │ ├── utils/
│ │ └── index.js
│ ├── package.json
│ └── README.md
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── services/
│ │ ├── styles/
│ │ └── App.jsx / main.jsx
│ ├── public/
│ ├── package.json
│ └── README.md
│
├── docs/
│ └── architecture.md
│
└── README.md

yaml
Copy code

---

## 🏗 Setup Instructions

### **Backend**
```sh
cd backend
npm install
npm start
Environment variables required:

ini
Copy code
MONGODB_URI=your_mongo_connection_string
PORT=3001
Frontend
sh
Copy code
cd frontend
npm install
npm run dev
For production build:

sh
Copy code
npm run build
npm run preview
Environment variable:

ini
Copy code
VITE_API_URL=https://truestate-4.onrender.com
## Architecture Document
Located at:
/docs/architecture.md

Includes:

Backend architecture

Frontend component architecture

Data flow explanation

Module responsibilities

## Assignment Compliance
This solution satisfies all requirements from the TruEstate assignment:
✔ Search
✔ Filters
✔ Sorting
✔ Pagination
✔ Modular backend services
✔ Clean React component structure
✔ Live deployment (frontend + backend)
✔ README in required format
✔ Architecture document included

## Deployment Link
Live App: https://truestate-21.onrender.com/
Backend API: https://truestate-4.onrender.com/











