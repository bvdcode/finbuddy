import { z } from 'zod';

const trimmedText = z.string().trim().min(1);
const minorUnits = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
const periodMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);
const sourceDate = z.iso.date();
const sourceRow = z.number().int().positive().max(Number.MAX_SAFE_INTEGER);
const sourceCell = z.string().trim().min(1).max(32).optional();
const maximumBulkParameterBytes = 2_000_000;
const textEncoder = new TextEncoder();

function fitsBulkParameter<Row>(rows: Row[]): boolean {
  const serialized = JSON.stringify(rows);
  if (serialized === undefined) {
    return false;
  }

  return textEncoder.encode(serialized).byteLength < maximumBulkParameterBytes;
}

const sourceSchema = z
  .object({
    fileName: trimmedText.max(255),
    fileHash: trimmedText.max(128),
    fileSizeBytes: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
    fileLastModified: z
      .number()
      .int()
      .nonnegative()
      .max(Number.MAX_SAFE_INTEGER),
    currency: z.literal('PLN'),
  })
  .strict();

const expenseSchema = z
  .object({
    periodMonth,
    sourceDate,
    categoryKey: trimmedText.max(128),
    categoryLabel: trimmedText.max(255),
    amountMinor: minorUnits,
    sourceSheet: trimmedText.max(128),
    sourceRow,
    sourceCell,
    sourceFormula: z.string().trim().min(1).max(4096).optional(),
  })
  .strict();

const incomeSchema = z
  .object({
    periodMonth,
    sourceDate,
    amountMinor: minorUnits,
    sourceSheet: trimmedText.max(128),
    sourceRow,
    sourceCell,
  })
  .strict();

const budgetPlanSchema = z
  .object({
    categoryKey: trimmedText.max(128),
    categoryLabel: trimmedText.max(255),
    plannedMinor: minorUnits,
    sourceSheet: trimmedText.max(128),
    sourceRow,
    sourceCell,
  })
  .strict();

export const normalizedImportSchema = z
  .object({
    source: sourceSchema,
    expenses: z.array(expenseSchema).min(1),
    incomes: z.array(incomeSchema).min(1),
    budgetPlan: z.array(budgetPlanSchema).min(1),
  })
  .strict()
  .superRefine((payload, context) => {
    if (!fitsBulkParameter(payload.expenses)) {
      context.addIssue({
        code: 'custom',
        path: ['expenses'],
        message: 'EXPENSES_JSON_TOO_LARGE',
      });
    }

    if (!fitsBulkParameter(payload.incomes)) {
      context.addIssue({
        code: 'custom',
        path: ['incomes'],
        message: 'INCOMES_JSON_TOO_LARGE',
      });
    }

    if (!fitsBulkParameter(payload.budgetPlan)) {
      context.addIssue({
        code: 'custom',
        path: ['budgetPlan'],
        message: 'BUDGET_JSON_TOO_LARGE',
      });
    }
  });

export const expensePatchSchema = z
  .object({
    amountMinor: minorUnits,
  })
  .strict();

export const expenseIdSchema = z.coerce.number().int().positive();

export type NormalizedImport = z.infer<typeof normalizedImportSchema>;
export type ExpensePatch = z.infer<typeof expensePatchSchema>;
