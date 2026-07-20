import assert from "node:assert/strict";
import test from "node:test";
import {
  detectBudgetHeader,
  detectExpenseHeader,
} from "../../lib/import/layout.ts";

test("detects expense categories and the adjacent income pair", () => {
  const layout = detectExpenseHeader([
    "Date",
    "Eating",
    "Car",
    "Sum",
    undefined,
    "Date",
    "Amount",
  ]);

  assert.deepEqual(layout, {
    dateColumn: 0,
    sumColumn: 3,
    categories: [
      { column: 1, label: "Eating" },
      { column: 2, label: "Car" },
    ],
    incomeDateColumn: 5,
    incomeAmountColumn: 6,
  });
});

test("detects the Finances budget header pair at a nonzero column", () => {
  assert.deepEqual(detectBudgetHeader([undefined, "Name", "Amount"]), {
    categoryColumn: 1,
    amountColumn: 2,
  });
});
