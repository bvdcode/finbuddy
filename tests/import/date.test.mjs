import assert from "node:assert/strict";
import test from "node:test";
import { normalizeSpreadsheetDate } from "../../lib/import/date.ts";

test("normalizes a 1900-system Excel serial to a calendar month", () => {
  assert.deepEqual(normalizeSpreadsheetDate(44562, false), {
    sourceDate: "2022-01-01",
    periodMonth: "2022-01",
  });
});

test("normalizes a 1904-system Excel serial to a calendar month", () => {
  assert.deepEqual(normalizeSpreadsheetDate(0, true), {
    sourceDate: "1904-01-01",
    periodMonth: "1904-01",
  });
});
