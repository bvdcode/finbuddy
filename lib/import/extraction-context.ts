import type { SpreadsheetCellValue } from "./date";
import type {
  BudgetPlanImportFact,
  ExpenseImportFact,
  FinanceImportCounts,
  FinanceImportWarning,
  FinanceImportWarningCode,
  FinanceImportSection,
  IncomeImportFact,
} from "./types";
import type { WorksheetGrid } from "./worksheet-grid";

export interface ExtractedFinanceData {
  expenses: ExpenseImportFact[];
  incomes: IncomeImportFact[];
  budgetPlan: BudgetPlanImportFact[];
  warnings: FinanceImportWarning[];
  counts: FinanceImportCounts;
}

export function isEmptyCellValue(value: SpreadsheetCellValue): boolean {
  if (value === undefined) {
    return true;
  }
  return typeof value === "string" && value.trim().length === 0;
}

export function toMinorUnits(value: SpreadsheetCellValue): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  const minorUnits = Math.round(value * 100);
  if (!Number.isSafeInteger(minorUnits) || minorUnits < 0) {
    return null;
  }
  return minorUnits;
}

export class FinanceExtractionContext {
  readonly expenses: ExpenseImportFact[] = [];
  readonly incomes: IncomeImportFact[] = [];
  readonly budgetPlan: BudgetPlanImportFact[] = [];
  readonly warnings: FinanceImportWarning[] = [];
  readonly counts: FinanceImportCounts;

  constructor(
    sheetsScanned: number,
    readonly date1904: boolean,
  ) {
    this.counts = {
      sheetsScanned,
      expenseSheets: 0,
      expenseRows: 0,
      expenses: 0,
      incomeRows: 0,
      incomes: 0,
      budgetRows: 0,
      budgetPlan: 0,
      skippedRows: 0,
      warnings: 0,
    };
  }

  warn(
    code: FinanceImportWarningCode,
    section: FinanceImportSection,
    grid?: WorksheetGrid,
    row?: number,
  ): void {
    const warning: FinanceImportWarning = { code, section };
    if (grid !== undefined) {
      warning.sourceSheet = grid.name;
    }
    if (row !== undefined) {
      warning.sourceRow = row + 1;
    }
    this.warnings.push(warning);
  }

  warnCell(
    code: FinanceImportWarningCode,
    section: FinanceImportSection,
    grid: WorksheetGrid,
    row: number,
    column: number,
  ): void {
    this.warnings.push({
      code,
      section,
      sourceSheet: grid.name,
      sourceRow: row + 1,
      sourceCell: grid.address(row, column),
    });
  }

  complete(): ExtractedFinanceData {
    this.counts.expenses = this.expenses.length;
    this.counts.incomes = this.incomes.length;
    this.counts.budgetPlan = this.budgetPlan.length;
    this.counts.warnings = this.warnings.length;
    return {
      expenses: this.expenses,
      incomes: this.incomes,
      budgetPlan: this.budgetPlan,
      warnings: this.warnings,
      counts: this.counts,
    };
  }
}
