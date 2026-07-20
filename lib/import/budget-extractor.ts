import { normalizeCategory, type NormalizedCategory } from "./category";
import type { SpreadsheetCellValue } from "./date";
import {
  FinanceExtractionContext,
  isEmptyCellValue,
  toMinorUnits,
} from "./extraction-context";
import {
  detectBudgetHeader,
  isSummaryLabel,
  type BudgetHeaderLayout,
} from "./layout";
import type { WorksheetGrid } from "./worksheet-grid";

function readCategory(
  context: FinanceExtractionContext,
  value: SpreadsheetCellValue,
  grid: WorksheetGrid,
  row: number,
  column: number,
): NormalizedCategory | null {
  if (isEmptyCellValue(value)) {
    context.warnCell("budget_category_missing", "budgetPlan", grid, row, column);
    return null;
  }
  if (typeof value !== "string") {
    context.warnCell("budget_category_invalid", "budgetPlan", grid, row, column);
    return null;
  }
  const category = normalizeCategory(value);
  if (category === null) {
    context.warnCell("budget_category_invalid", "budgetPlan", grid, row, column);
  }
  return category;
}

function readAmount(
  context: FinanceExtractionContext,
  value: SpreadsheetCellValue,
  grid: WorksheetGrid,
  row: number,
  column: number,
): number | null {
  if (isEmptyCellValue(value)) {
    context.warnCell("budget_amount_missing", "budgetPlan", grid, row, column);
    return null;
  }
  const amountMinor = toMinorUnits(value);
  if (amountMinor === null) {
    context.warnCell("budget_amount_invalid", "budgetPlan", grid, row, column);
  }
  return amountMinor;
}

function importRows(
  context: FinanceExtractionContext,
  grid: WorksheetGrid,
  startRow: number,
  layout: BudgetHeaderLayout,
): void {
  for (let row = startRow; row <= grid.maxRow; row += 1) {
    const categoryValue = grid.value(row, layout.categoryColumn);
    const amountValue = grid.value(row, layout.amountColumn);
    if (isSummaryLabel(categoryValue)) {
      context.counts.skippedRows += 1;
      break;
    }
    if (isEmptyCellValue(categoryValue) && isEmptyCellValue(amountValue)) {
      continue;
    }

    context.counts.budgetRows += 1;
    const category = readCategory(
      context,
      categoryValue,
      grid,
      row,
      layout.categoryColumn,
    );
    const amountMinor = readAmount(
      context,
      amountValue,
      grid,
      row,
      layout.amountColumn,
    );
    if (category === null || amountMinor === null) {
      context.counts.skippedRows += 1;
      continue;
    }
    context.budgetPlan.push({
      categoryKey: category.key,
      categoryLabel: category.label,
      plannedMinor: amountMinor,
      sourceSheet: grid.name,
      sourceRow: row + 1,
      sourceCell: grid.address(row, layout.amountColumn),
    });
  }
}

export function importBudgetPlan(
  context: FinanceExtractionContext,
  grids: readonly WorksheetGrid[],
): boolean {
  for (const grid of grids) {
    if (grid.name.trim().toLocaleLowerCase("en-US") !== "finances") {
      continue;
    }
    for (let row = 0; row <= grid.maxRow; row += 1) {
      const layout = detectBudgetHeader(grid.row(row));
      if (layout !== null) {
        importRows(context, grid, row + 1, layout);
        return true;
      }
    }
  }
  return false;
}
