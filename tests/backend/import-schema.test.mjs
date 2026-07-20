import assert from 'node:assert/strict';
import test from 'node:test';
import {
  expensePatchSchema,
  normalizedImportSchema,
} from '../../lib/domain/import-schema.ts';
import { bulkImportStatements } from '../../lib/server/import-sql.ts';
import { runtimeSchemaStatements } from '../../db/runtime-schema.ts';

const normalizedImport = {
  source: {
    fileName: 'Finances.xlsx',
    fileHash: 'sample-hash',
    fileSizeBytes: 4096,
    fileLastModified: 1_721_500_000_000,
    currency: 'PLN',
  },
  expenses: [
    {
      periodMonth: '2026-07',
      sourceDate: '2026-07-01',
      categoryKey: 'housing',
      categoryLabel: 'Housing',
      amountMinor: 250_000,
      sourceSheet: 'Expenses',
      sourceRow: 2,
      sourceCell: 'B2',
      sourceFormula: '=SUM(B3:B4)',
    },
  ],
  incomes: [
    {
      periodMonth: '2026-07',
      sourceDate: '2026-07-01',
      amountMinor: 700_000,
      sourceSheet: 'Income',
      sourceRow: 2,
      sourceCell: 'B2',
    },
  ],
  budgetPlan: [
    {
      categoryKey: 'housing',
      categoryLabel: 'Housing',
      plannedMinor: 220_000,
      sourceSheet: 'Budget',
      sourceRow: 2,
      sourceCell: 'B2',
    },
  ],
};

test('accepts the normalized workbook payload', () => {
  const result = normalizedImportSchema.safeParse(normalizedImport);
  assert.equal(result.success, true);
});

test('rejects fractional minor units', () => {
  const result = normalizedImportSchema.safeParse({
    ...normalizedImport,
    expenses: [{ ...normalizedImport.expenses[0], amountMinor: 25.5 }],
  });

  assert.equal(result.success, false);
});

test('rejects fields outside the import contract', () => {
  const result = normalizedImportSchema.safeParse({
    ...normalizedImport,
    source: { ...normalizedImport.source, workbookOwner: 'Example' },
  });

  assert.equal(result.success, false);
});

test('accepts a nonnegative integer expense patch', () => {
  assert.equal(expensePatchSchema.safeParse({ amountMinor: 0 }).success, true);
  assert.equal(
    expensePatchSchema.safeParse({ amountMinor: -1 }).success,
    false,
  );
});

test('keeps every runtime schema preparation to one SQL statement', () => {
  assert.equal(runtimeSchemaStatements.length, 17);

  for (const statement of runtimeSchemaStatements) {
    assert.equal(statement.includes(';'), false);
  }
});

test('uses three unambiguous json_each bulk upserts', () => {
  const statements = Object.values(bulkImportStatements);
  assert.equal(statements.length, 3);

  for (const statement of statements) {
    assert.match(statement, /FROM json_each\(\?\) AS item/);
    assert.match(statement, /WHERE true\s+ON CONFLICT/);
    assert.equal(statement.includes(';'), false);
  }
});

test('rejects a bulk parameter at or above two million bytes', () => {
  const sourceFormula = '=' + 'X'.repeat(4095);
  const expenses = Array.from({ length: 500 }, (_, index) => ({
    ...normalizedImport.expenses[0],
    categoryKey: 'category-' + index,
    sourceRow: index + 1,
    sourceFormula,
  }));

  const result = normalizedImportSchema.safeParse({
    ...normalizedImport,
    expenses,
  });

  assert.equal(result.success, false);
});
