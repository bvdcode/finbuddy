# FinBuddy

FinBuddy turns a personal-finance workbook into a shared, interactive dashboard. It imports monthly expense, income, and budget-plan data, normalizes the workbook structure, and stores the resulting records in a server-side D1 database.

## Product flow

1. Open the import dialog and select an Excel workbook.
2. Review the detected months, categories, values, and warnings.
3. Confirm the import to update matching periods in the shared dataset.
4. Explore expense trends, category changes, cash flow, and budget variance.
5. Edit a monthly category value directly from the data view.

The workbook is parsed in the browser. The server receives normalized finance records and import metadata rather than the original file bytes.

## Stack

- Next App Router on vinext
- React, TypeScript, and MUI
- TanStack Query for server state
- Zustand for transient interface state
- SheetJS for workbook parsing
- Drizzle ORM with Cloudflare D1
- Vitest and Node test runner

## Local development

Requirements: Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

The development server uses the project-local D1 binding declared in `.openai/hosting.json`.

## Quality checks

```bash
npm run lint
npm run test
npm run build
```

Generate a database migration after changing `db/schema.ts`:

```bash
npm run db:generate
```

## Data model

- `import_batches` records import metadata.
- `monthly_expenses` stores category amounts by month in integer minor units.
- `monthly_incomes` stores income by month in integer minor units.
- `budget_plan` stores the latest planned category amounts.

The current demonstration uses one shared dataset. Authentication and tenant isolation are outside the current product scope.
