# Cashlio

Cashlio is an Ionic + Angular personal finance app for tracking credits/debits across profiles, viewing dashboard summaries, and exporting history reports.

##demo

-You can find the cashlio.apk file to download.

## Features

- **Dashboard** with total income, total expense, and balance
- **Add Transaction** for credit/debit entries
- **History** view with delete support
- **PDF export** from History with columns:
  - Date
  - Credit or Debit
  - Category
  - Amount
  - Balance (running)
- **Analytics** charts for income vs expense and category breakdown
- **Profiles** support for multi-profile tracking

## Tech Stack

- Ionic Framework 8
- Angular 20 (standalone components)
- Capacitor 8
- Chart.js
- jsPDF + jspdf-autotable

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Run the app

```bash
npm start
```

By default this starts Angular dev server on `http://localhost:4200`.

### 3) Build for production

```bash
npm run build
```

## Useful Scripts

- `npm start` – run dev server
- `npm run build` – production build
- `npm run test` – unit tests
- `npm run lint` – lint checks

## Project Structure

```text
src/app/pages/
  dashboard/
  add-expense/
  history/
  analytics/
  profiles/
src/app/services/
  expense.service.ts
  profile.service.ts
```

## Notes

- App data is currently stored in browser `localStorage`.
- Lint output may include pre-existing issues unrelated to recent feature work.
