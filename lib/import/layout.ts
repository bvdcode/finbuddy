import type { SpreadsheetCellValue } from "./date";

export interface ExpenseCategoryColumn {
  column: number;
  label: string;
}

export interface ExpenseHeaderLayout {
  dateColumn: number;
  sumColumn: number;
  categories: ExpenseCategoryColumn[];
  incomeDateColumn?: number;
  incomeAmountColumn?: number;
}

export interface BudgetHeaderLayout {
  categoryColumn: number;
  amountColumn: number;
}

function normalizedHeader(value: SpreadsheetCellValue): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const header = value.trim().toLocaleLowerCase("en-US");
  if (header.length === 0) {
    return null;
  }

  return header;
}

function findHeader(
  row: readonly SpreadsheetCellValue[],
  header: string,
  startColumn: number,
): number | null {
  for (let column = startColumn; column < row.length; column += 1) {
    if (normalizedHeader(row[column]) === header) {
      return column;
    }
  }

  return null;
}

export function detectExpenseHeader(
  row: readonly SpreadsheetCellValue[],
): ExpenseHeaderLayout | null {
  let dateColumn = findHeader(row, "date", 0);
  while (dateColumn !== null) {
    const sumColumn = findHeader(row, "sum", dateColumn + 2);
    if (sumColumn !== null) {
      const categories: ExpenseCategoryColumn[] = [];
      for (let column = dateColumn + 1; column < sumColumn; column += 1) {
        const value = row[column];
        if (typeof value === "string" && value.trim().length > 0) {
          categories.push({ column, label: value.trim() });
        }
      }

      if (categories.length > 0) {
        const layout: ExpenseHeaderLayout = {
          dateColumn,
          sumColumn,
          categories,
        };
        const incomeDateColumn = findHeader(row, "date", sumColumn + 1);
        if (
          incomeDateColumn !== null &&
          normalizedHeader(row[incomeDateColumn + 1]) === "amount"
        ) {
          layout.incomeDateColumn = incomeDateColumn;
          layout.incomeAmountColumn = incomeDateColumn + 1;
        }

        return layout;
      }
    }

    dateColumn = findHeader(row, "date", dateColumn + 1);
  }

  return null;
}

export function detectBudgetHeader(
  row: readonly SpreadsheetCellValue[],
): BudgetHeaderLayout | null {
  const categoryColumn = findHeader(row, "name", 0);
  if (
    categoryColumn === null ||
    normalizedHeader(row[categoryColumn + 1]) !== "amount"
  ) {
    return null;
  }

  return { categoryColumn, amountColumn: categoryColumn + 1 };
}

export function isSummaryLabel(value: SpreadsheetCellValue): boolean {
  const label = normalizedHeader(value);
  return label === "avg" || label === "sum";
}
