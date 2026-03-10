# Cashlio

Cashlio is an Ionic + Angular personal finance app for tracking credits/debits across profiles, viewing summaries and charts, exporting PDF reports, and backing up/restoring data when moving to a new phone.

## Demo APK

- The repository includes `cashlio.apk` for direct Android installation/testing.

## Features

- **Dashboard**
  - Total balance hero card
  - Income/Expense summary cards
  - Quick actions for add/history
- **Add Transaction**
  - Credit/debit entry form
  - Category, note, date selection
- **History**
  - Profile-specific transaction list
  - Delete transaction support
  - **PDF export** with running balance
- **Analytics**
  - Income vs Expense bar chart
  - Expense-by-category pie chart
- **Profiles**
  - Multi-profile management (add/rename/delete/switch)
  - **Theme selector** (Dark/Light)
  - **Backup tools**
    - Download backup JSON
    - Restore backup JSON
- **Persistent Theme**
  - Theme is stored and applied app-wide
- **Phone Migration Ready**
  - Transfer backup file to a new device and restore all app data

## Backup & Restore (New Phone Transfer)

Use **Profiles → Download Backup** to generate a JSON file containing:

- Profiles
- Transactions
- Active profile
- Selected theme
- Export metadata

On the new phone:

1. Install/open Cashlio.
2. Go to **Profiles**.
3. Tap **Restore Backup**.
4. Select the backup JSON file.

The app restores your data and applies the saved theme.

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
  theme.service.ts
```

## Data Storage

- App data is stored in `localStorage`.
- Main keys used:
  - `cashlio_profiles`
  - `cashlio_expenses`
  - `cashlio_active_profile`
  - `cashlio_theme`
