import type {
  BudgetPlanItem,
  ImportBatch,
  MonthlyExpense,
  MonthlyIncome,
} from '@/lib/domain/finance';

export interface ImportBatchRow {
  id: number;
  file_hash: string;
  file_name: string;
  file_size_bytes: number;
  file_last_modified: number;
  currency: 'PLN';
  imported_at: string;
}

export interface MonthlyExpenseRow {
  id: number;
  import_batch_id: number;
  period_month: string;
  source_date: string;
  category_key: string;
  category_label: string;
  amount_minor: number;
  source_sheet: string;
  source_row: number;
  source_cell: string | null;
  source_formula: string | null;
  updated_at: string;
}

export interface MonthlyIncomeRow {
  id: number;
  import_batch_id: number;
  period_month: string;
  source_date: string;
  amount_minor: number;
  source_sheet: string;
  source_row: number;
  source_cell: string | null;
  updated_at: string;
}

export interface BudgetPlanRow {
  id: number;
  import_batch_id: number;
  category_key: string;
  category_label: string;
  planned_minor: number;
  source_sheet: string;
  source_row: number;
  source_cell: string | null;
  updated_at: string;
}

export function toImportBatch(row: ImportBatchRow): ImportBatch {
  return {
    id: row.id,
    fileHash: row.file_hash,
    fileName: row.file_name,
    fileSizeBytes: row.file_size_bytes,
    fileLastModified: row.file_last_modified,
    currency: row.currency,
    importedAt: row.imported_at,
  };
}

export function toMonthlyExpense(row: MonthlyExpenseRow): MonthlyExpense {
  return {
    id: row.id,
    importBatchId: row.import_batch_id,
    periodMonth: row.period_month,
    sourceDate: row.source_date,
    categoryKey: row.category_key,
    categoryLabel: row.category_label,
    amountMinor: row.amount_minor,
    sourceSheet: row.source_sheet,
    sourceRow: row.source_row,
    sourceCell: row.source_cell,
    sourceFormula: row.source_formula,
    updatedAt: row.updated_at,
  };
}

export function toMonthlyIncome(row: MonthlyIncomeRow): MonthlyIncome {
  return {
    id: row.id,
    importBatchId: row.import_batch_id,
    periodMonth: row.period_month,
    sourceDate: row.source_date,
    amountMinor: row.amount_minor,
    sourceSheet: row.source_sheet,
    sourceRow: row.source_row,
    sourceCell: row.source_cell,
    updatedAt: row.updated_at,
  };
}

export function toBudgetPlanItem(row: BudgetPlanRow): BudgetPlanItem {
  return {
    id: row.id,
    importBatchId: row.import_batch_id,
    categoryKey: row.category_key,
    categoryLabel: row.category_label,
    plannedMinor: row.planned_minor,
    sourceSheet: row.source_sheet,
    sourceRow: row.source_row,
    sourceCell: row.source_cell,
    updatedAt: row.updated_at,
  };
}
