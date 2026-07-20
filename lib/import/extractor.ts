import type { WorkBook } from "xlsx";
import { importBudgetPlan } from "./budget-extractor";
import {
  FinanceExtractionContext,
  type ExtractedFinanceData,
} from "./extraction-context";
import { importExpenseSheet } from "./expense-extractor";
import { WorksheetGrid } from "./worksheet-grid";

type XlsxModule = typeof import("xlsx");

export function extractFinanceData(
  workbook: WorkBook,
  xlsx: XlsxModule,
): ExtractedFinanceData {
  const date1904 = workbook.Workbook?.WBProps?.date1904 === true;
  const context = new FinanceExtractionContext(
    workbook.SheetNames.length,
    date1904,
  );
  const grids: WorksheetGrid[] = [];

  for (const sheetName of workbook.SheetNames) {
    const grid = new WorksheetGrid(
      sheetName,
      workbook.Sheets[sheetName],
      xlsx.utils.encode_cell,
      xlsx.utils.decode_range,
    );
    grids.push(grid);
    importExpenseSheet(context, grid);
  }

  const budgetFound = importBudgetPlan(context, grids);
  if (context.counts.expenseSheets === 0) {
    context.warn("expense_table_missing", "workbook");
  }
  if (!budgetFound) {
    context.warn("budget_table_missing", "workbook");
  }

  return context.complete();
}
