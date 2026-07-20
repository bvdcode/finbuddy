export type CurrencyCode = 'PLN';

export interface ImportBatch {
  id: number;
  fileHash: string;
  fileName: string;
  fileSizeBytes: number;
  fileLastModified: number;
  currency: CurrencyCode;
  importedAt: string;
}

export interface MonthlyExpense {
  id: number;
  importBatchId: number;
  periodMonth: string;
  sourceDate: string;
  categoryKey: string;
  categoryLabel: string;
  amountMinor: number;
  sourceSheet: string;
  sourceRow: number;
  sourceCell: string | null;
  sourceFormula: string | null;
  updatedAt: string;
}

export interface MonthlyIncome {
  id: number;
  importBatchId: number;
  periodMonth: string;
  sourceDate: string;
  amountMinor: number;
  sourceSheet: string;
  sourceRow: number;
  sourceCell: string | null;
  updatedAt: string;
}

export interface BudgetPlanItem {
  id: number;
  importBatchId: number;
  categoryKey: string;
  categoryLabel: string;
  plannedMinor: number;
  sourceSheet: string;
  sourceRow: number;
  sourceCell: string | null;
  updatedAt: string;
}

export interface DashboardData {
  imports: ImportBatch[];
  expenses: MonthlyExpense[];
  incomes: MonthlyIncome[];
  budgetPlan: BudgetPlanItem[];
}

export interface ImportCounts {
  expenses: number;
  incomes: number;
  budgetPlan: number;
}

export interface ImportResult {
  importBatchId: number;
  counts: ImportCounts;
}

export interface ExpenseUpdateResult {
  expense: MonthlyExpense;
}
