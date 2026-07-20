import { normalizeCategory } from "./category";
import { normalizeSpreadsheetDate } from "./date";
import {
  FinanceExtractionContext,
  isEmptyCellValue,
  toMinorUnits,
} from "./extraction-context";
import {
  detectExpenseHeader,
  isSummaryLabel,
  type ExpenseHeaderLayout,
} from "./layout";
import type { ExpenseImportFact } from "./types";
import type { WorksheetGrid } from "./worksheet-grid";

function importIncomeRow(
  context: FinanceExtractionContext,
  grid: WorksheetGrid,
  row: number,
  layout: ExpenseHeaderLayout,
): void {
  const dateColumn = layout.incomeDateColumn;
  const amountColumn = layout.incomeAmountColumn;
  if (dateColumn === undefined || amountColumn === undefined) {
    return;
  }

  const dateValue = grid.value(row, dateColumn);
  const amountValue = grid.value(row, amountColumn);
  if (
    isSummaryLabel(dateValue) ||
    (isEmptyCellValue(dateValue) && isEmptyCellValue(amountValue))
  ) {
    return;
  }

  context.counts.incomeRows += 1;
  let valid = true;
  if (isEmptyCellValue(dateValue)) {
    context.warnCell("income_date_missing", "incomes", grid, row, dateColumn);
    valid = false;
  }
  const date = normalizeSpreadsheetDate(dateValue, context.date1904);
  if (!isEmptyCellValue(dateValue) && date === null) {
    context.warnCell("income_date_invalid", "incomes", grid, row, dateColumn);
    valid = false;
  }

  if (isEmptyCellValue(amountValue)) {
    context.warnCell(
      "income_amount_missing",
      "incomes",
      grid,
      row,
      amountColumn,
    );
    valid = false;
  }
  const amountMinor = toMinorUnits(amountValue);
  if (!isEmptyCellValue(amountValue) && amountMinor === null) {
    context.warnCell(
      "income_amount_invalid",
      "incomes",
      grid,
      row,
      amountColumn,
    );
    valid = false;
  }

  if (!valid || date === null || amountMinor === null) {
    context.counts.skippedRows += 1;
    return;
  }
  context.incomes.push({
    periodMonth: date.periodMonth,
    sourceDate: date.sourceDate,
    amountMinor,
    sourceSheet: grid.name,
    sourceRow: row + 1,
    sourceCell: grid.address(row, amountColumn),
  });
}

function importExpenseRows(
  context: FinanceExtractionContext,
  grid: WorksheetGrid,
  startRow: number,
  layout: ExpenseHeaderLayout,
): void {
  for (let row = startRow; row <= grid.maxRow; row += 1) {
    const dateValue = grid.value(row, layout.dateColumn);
    if (isSummaryLabel(dateValue)) {
      context.counts.skippedRows += 1;
      break;
    }

    importIncomeRow(context, grid, row, layout);
    if (isEmptyCellValue(dateValue)) {
      continue;
    }

    context.counts.expenseRows += 1;
    const date = normalizeSpreadsheetDate(dateValue, context.date1904);
    if (date === null) {
      context.warnCell(
        "expense_date_invalid",
        "expenses",
        grid,
        row,
        layout.dateColumn,
      );
      context.counts.skippedRows += 1;
      continue;
    }

    for (const categoryColumn of layout.categories) {
      const amountCell = grid.cell(row, categoryColumn.column);
      if (amountCell === undefined || isEmptyCellValue(amountCell.v)) {
        continue;
      }
      const amountMinor = toMinorUnits(amountCell.v);
      if (amountMinor === null) {
        context.warnCell(
          "expense_amount_invalid",
          "expenses",
          grid,
          row,
          categoryColumn.column,
        );
        continue;
      }

      const category = normalizeCategory(categoryColumn.label);
      if (category === null) {
        continue;
      }
      const fact: ExpenseImportFact = {
        periodMonth: date.periodMonth,
        sourceDate: date.sourceDate,
        categoryKey: category.key,
        categoryLabel: category.label,
        amountMinor,
        sourceSheet: grid.name,
        sourceRow: row + 1,
        sourceCell: grid.address(row, categoryColumn.column),
      };
      if (amountCell.f !== undefined) {
        fact.sourceFormula = amountCell.f;
      }
      context.expenses.push(fact);
    }
  }
}

export function importExpenseSheet(
  context: FinanceExtractionContext,
  grid: WorksheetGrid,
): boolean {
  for (let row = 0; row <= grid.maxRow; row += 1) {
    const layout = detectExpenseHeader(grid.row(row));
    if (layout === null) {
      continue;
    }

    context.counts.expenseSheets += 1;
    if (
      layout.incomeDateColumn === undefined ||
      layout.incomeAmountColumn === undefined
    ) {
      context.warn("income_columns_missing", "incomes", grid, row);
    }
    importExpenseRows(context, grid, row + 1, layout);
    return true;
  }
  return false;
}
