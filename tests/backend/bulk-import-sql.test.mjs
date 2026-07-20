import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import test from 'node:test';
import { runtimeSchemaStatements } from '../../db/runtime-schema.ts';
import { bulkImportStatements } from '../../lib/server/import-sql.ts';

const expenses = [
  {
    periodMonth: '2026-07',
    sourceDate: '2026-07-01',
    categoryKey: 'housing',
    categoryLabel: 'Housing',
    amountMinor: 250_000,
    sourceSheet: 'Expenses',
    sourceRow: 2,
    sourceCell: 'B2',
  },
];

const incomes = [
  {
    periodMonth: '2026-07',
    sourceDate: '2026-07-01',
    amountMinor: 700_000,
    sourceSheet: 'Income',
    sourceRow: 2,
    sourceCell: 'B2',
  },
];

const budgetPlan = [
  {
    categoryKey: 'housing',
    categoryLabel: 'Housing',
    plannedMinor: 220_000,
    sourceSheet: 'Budget',
    sourceRow: 2,
    sourceCell: 'B2',
  },
];

test('bulk SQL is idempotent and isolated by profile', () => {
  const database = new DatabaseSync(':memory:');

  for (const statement of runtimeSchemaStatements) {
    database.exec(statement);
  }

  const insertProfile = database.prepare(
    `INSERT INTO profiles (first_name, last_name, normalized_name)
     VALUES (?, ?, ?)`,
  );
  insertProfile.run('First', 'Profile', 'first profile');
  insertProfile.run('Second', 'Profile', 'second profile');

  const insertBatch = database.prepare(
    `INSERT INTO import_batches (
      profile_id, file_hash, file_name, file_size_bytes,
      file_last_modified, currency
    ) VALUES (?, ?, ?, ?, ?, ?)`,
  );
  insertBatch.run(1, 'shared-hash', 'Finances.xlsx', 4096, 1, 'PLN');
  insertBatch.run(2, 'shared-hash', 'Finances.xlsx', 4096, 1, 'PLN');

  for (const [profileId, batchId] of [
    [1, 1],
    [2, 2],
  ]) {
    database
      .prepare(bulkImportStatements.expenses)
      .run(profileId, batchId, JSON.stringify(expenses));
    database
      .prepare(bulkImportStatements.incomes)
      .run(profileId, batchId, JSON.stringify(incomes));
    database
      .prepare(bulkImportStatements.budgetPlan)
      .run(profileId, batchId, JSON.stringify(budgetPlan));
  }

  const originalExpense = database
    .prepare(
      `SELECT id FROM monthly_expenses
       WHERE profile_id = ? AND period_month = ? AND category_key = ?`,
    )
    .get(1, '2026-07', 'housing');

  database
    .prepare(bulkImportStatements.expenses)
    .run(
      1,
      1,
      JSON.stringify([{ ...expenses[0], amountMinor: 245_000 }]),
    );

  const firstProfileExpense = database
    .prepare(
      `SELECT id, amount_minor AS amountMinor FROM monthly_expenses
       WHERE profile_id = ? AND period_month = ? AND category_key = ?`,
    )
    .get(1, '2026-07', 'housing');
  const secondProfileExpense = database
    .prepare(
      `SELECT amount_minor AS amountMinor FROM monthly_expenses
       WHERE profile_id = ? AND period_month = ? AND category_key = ?`,
    )
    .get(2, '2026-07', 'housing');
  const counts = database
    .prepare(
      `SELECT
        (SELECT COUNT(*) FROM import_batches) AS imports,
        (SELECT COUNT(*) FROM monthly_expenses) AS expenses,
        (SELECT COUNT(*) FROM monthly_incomes) AS incomes,
        (SELECT COUNT(*) FROM budget_plan) AS budgetPlan`,
    )
    .get();

  assert.equal(firstProfileExpense.id, originalExpense.id);
  assert.equal(firstProfileExpense.amountMinor, 245_000);
  assert.equal(secondProfileExpense.amountMinor, 250_000);
  assert.equal(counts.imports, 2);
  assert.equal(counts.expenses, 2);
  assert.equal(counts.incomes, 2);
  assert.equal(counts.budgetPlan, 2);

  database.close();
});
