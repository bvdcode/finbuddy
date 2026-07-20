import assert from "node:assert/strict";
import test from "node:test";
import { normalizeCategory } from "../../lib/import/category.ts";

test("aliases transport categories while preserving workbook labels", () => {
  assert.deepEqual(normalizeCategory("Car"), {
    key: "transport",
    label: "Car",
  });
  assert.deepEqual(normalizeCategory("Transport"), {
    key: "transport",
    label: "Transport",
  });
});

test("aliases goals categories while preserving workbook labels", () => {
  assert.deepEqual(normalizeCategory("Fixed Goals"), {
    key: "goals",
    label: "Fixed Goals",
  });
  assert.deepEqual(normalizeCategory("Goals"), {
    key: "goals",
    label: "Goals",
  });
});
