# The Bank Transaction UPI Summary & Categorization App

Full-stack React + Express app for parsing UPI bank alerts, assigning categories, reducing analytics, and surfacing reward-based savings metadata.

## Architecture

- Thick server: parsing, keyword categorization, validation, reward eligibility, signed amount handling, and cumulative reducers are all implemented in `server/`.
- Thin client: React renders API payloads, lets users select categories, and sends `PATCH` requests for manual overrides.
- State: in-memory transaction seed data in `server/data/transactions.js`, shaped like a production API boundary.

## Run Locally

```bash
npm install
npm run dev:api
```

In another terminal:

```bash
npm run dev:web
```

Open `http://127.0.0.1:5173`.

## API

- `GET /api/transactions` returns parsed transaction cards and allowed categories.
- `GET /api/analytics` returns category totals, caps, progress percentages, inflow, outflow, and net totals.
- `PATCH /api/transactions/:id` accepts `{ "category": "Travel" }`, validates the category, mutates server state, and returns refreshed transactions plus analytics.

## Git Commit Milestones

1. `feat-backend-parser-and-reducer`
   - Set up Express.
   - Add raw UPI alert seed data.
   - Implement parser, category matcher, reward metadata injector, and analytics reducer.
   - Expose `GET /api/transactions` and `GET /api/analytics`.

2. `feat-frontend-dashboard-layout`
   - Set up Vite, React, Tailwind CSS, and Lucide React.
   - Build sticky analytics progress blocks.
   - Render chronological transaction stream from backend data.

3. `feat-vibe-check-and-dropdown-interactions`
   - Render green Expected Savings rows from backend metadata.
   - Add category selector dropdown.
   - Wire `PATCH` updates to server state and refresh analytics without a page reload.

## Suggested Commit Commands

```bash
git add server package.json
git commit -m "feat-backend-parser-and-reducer"

git add index.html vite.config.js tailwind.config.js postcss.config.js src
git commit -m "feat-frontend-dashboard-layout"

git add server/routes/transactions.js src/App.jsx src/components/TransactionCard.jsx README.md
git commit -m "feat-vibe-check-and-dropdown-interactions"
```
