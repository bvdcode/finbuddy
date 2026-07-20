export const DEFAULT_IMPORT_CURRENCY = "PLN" as const;

export type ImportCurrency = typeof DEFAULT_IMPORT_CURRENCY;

export interface FinanceWorkbookInput {
  data: ArrayBuffer;
  fileName: string;
  fileSizeBytes: number;
  fileLastModified: number;
}

export interface FinanceImportSource {
  fileName: string;
  fileHash: string;
  fileSizeBytes: number;
  fileLastModified: number;
  currency: ImportCurrency;
}

export interface ExpenseImportFact {
  periodMonth: string;
  sourceDate: string;
  categoryKey: string;
  categoryLabel: string;
  amountMinor: number;
  sourceSheet: string;
  sourceRow: number;
  sourceCell?: string;
  sourceFormula?: string;
}

export interface IncomeImportFact {
  periodMonth: string;
  sourceDate: string;
  amountMinor: number;
  sourceSheet: string;
  sourceRow: number;
  sourceCell?: string;
}

export interface BudgetPlanImportFact {
  categoryKey: string;
  categoryLabel: string;
  plannedMinor: number;
  sourceSheet: string;
  sourceRow: number;
  sourceCell?: string;
}

export interface FinanceImportPayload {
  source: FinanceImportSource;
  expenses: ExpenseImportFact[];
  incomes: IncomeImportFact[];
  budgetPlan: BudgetPlanImportFact[];
}

export type FinanceImportWarningCode =
  | "expense_table_missing"
  | "budget_table_missing"
  | "income_columns_missing"
  | "expense_date_invalid"
  | "expense_amount_invalid"
  | "income_date_missing"
  | "income_date_invalid"
  | "income_amount_missing"
  | "income_amount_invalid"
  | "budget_category_missing"
  | "budget_category_invalid"
  | "budget_amount_missing"
  | "budget_amount_invalid";

export type FinanceImportSection =
  | "workbook"
  | "expenses"
  | "incomes"
  | "budgetPlan";

export interface FinanceImportWarning {
  code: FinanceImportWarningCode;
  section: FinanceImportSection;
  sourceSheet?: string;
  sourceRow?: number;
  sourceCell?: string;
}

export interface FinanceImportCounts {
  sheetsScanned: number;
  expenseSheets: number;
  expenseRows: number;
  expenses: number;
  incomeRows: number;
  incomes: number;
  budgetRows: number;
  budgetPlan: number;
  skippedRows: number;
  warnings: number;
}

export interface FinanceImportPreview {
  payload: FinanceImportPayload;
  warnings: FinanceImportWarning[];
  counts: FinanceImportCounts;
}
