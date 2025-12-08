# Architecture Document

## Backend
- Node.js + Express API
- Streaming CSV processing using `csv-parser` to avoid loading entire file in memory.
- Routes:
  - GET /api/sales - query endpoint (search, filters, sort, pagination)
  - GET /api/sales/meta - return unique values for multi-selects
- Organization:
  - controllers/, services/, utils/, routes/

## Frontend
- React + Vite SPA
- Components: SearchBar, FiltersPanel, SortDropdown, TransactionsTable, PaginationControls
- Frontend fetches meta and data from backend.

## Data flow
1. Frontend loads meta via `/api/sales/meta`
2. Frontend sends query to `/api/sales` with filters/search/sort/page
3. Backend streams dataset row-by-row, applies filters, collects matches
4. Backend sorts matched rows in-memory (acceptably fast for filtered subsets) and returns requested page.

## Notes on performance
- The backend streams the file so memory usage does not depend on total CSV size.
- Sorting is done in-memory on the *filtered* subset. For pathological cases where filters match nearly entire dataset, consider:
  - Adding server-side indexes / database (SQLite/Postgres).
  - Implement external merge sort or pre-sorted files.

