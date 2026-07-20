export const bulkImportStatements = {
  expenses: `INSERT INTO monthly_expenses (
    profile_id, import_batch_id, period_month, source_date, category_key,
    category_label, amount_minor, source_sheet, source_row, source_cell,
    source_formula
  )
  SELECT
    ?,
    ?,
    json_extract(item.value, '$.periodMonth'),
    json_extract(item.value, '$.sourceDate'),
    json_extract(item.value, '$.categoryKey'),
    json_extract(item.value, '$.categoryLabel'),
    CAST(json_extract(item.value, '$.amountMinor') AS INTEGER),
    json_extract(item.value, '$.sourceSheet'),
    CAST(json_extract(item.value, '$.sourceRow') AS INTEGER),
    json_extract(item.value, '$.sourceCell'),
    json_extract(item.value, '$.sourceFormula')
  FROM json_each(?) AS item
  WHERE true
  ON CONFLICT (profile_id, period_month, category_key) DO UPDATE SET
    import_batch_id = excluded.import_batch_id,
    source_date = excluded.source_date,
    category_label = excluded.category_label,
    amount_minor = excluded.amount_minor,
    source_sheet = excluded.source_sheet,
    source_row = excluded.source_row,
    source_cell = excluded.source_cell,
    source_formula = excluded.source_formula,
    updated_at = CURRENT_TIMESTAMP`,
  incomes: `INSERT INTO monthly_incomes (
    profile_id, import_batch_id, period_month, source_date, amount_minor,
    source_sheet, source_row, source_cell
  )
  SELECT
    ?,
    ?,
    json_extract(item.value, '$.periodMonth'),
    json_extract(item.value, '$.sourceDate'),
    CAST(json_extract(item.value, '$.amountMinor') AS INTEGER),
    json_extract(item.value, '$.sourceSheet'),
    CAST(json_extract(item.value, '$.sourceRow') AS INTEGER),
    json_extract(item.value, '$.sourceCell')
  FROM json_each(?) AS item
  WHERE true
  ON CONFLICT (profile_id, period_month) DO UPDATE SET
    import_batch_id = excluded.import_batch_id,
    source_date = excluded.source_date,
    amount_minor = excluded.amount_minor,
    source_sheet = excluded.source_sheet,
    source_row = excluded.source_row,
    source_cell = excluded.source_cell,
    updated_at = CURRENT_TIMESTAMP`,
  budgetPlan: `INSERT INTO budget_plan (
    profile_id, import_batch_id, category_key, category_label, planned_minor,
    source_sheet, source_row, source_cell
  )
  SELECT
    ?,
    ?,
    json_extract(item.value, '$.categoryKey'),
    json_extract(item.value, '$.categoryLabel'),
    CAST(json_extract(item.value, '$.plannedMinor') AS INTEGER),
    json_extract(item.value, '$.sourceSheet'),
    CAST(json_extract(item.value, '$.sourceRow') AS INTEGER),
    json_extract(item.value, '$.sourceCell')
  FROM json_each(?) AS item
  WHERE true
  ON CONFLICT (profile_id, category_key) DO UPDATE SET
    import_batch_id = excluded.import_batch_id,
    category_label = excluded.category_label,
    planned_minor = excluded.planned_minor,
    source_sheet = excluded.source_sheet,
    source_row = excluded.source_row,
    source_cell = excluded.source_cell,
    updated_at = CURRENT_TIMESTAMP`,
} as const;
