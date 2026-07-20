export const runtimeSchemaStatements = [
  `CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL CHECK (length(first_name) BETWEEN 1 AND 80),
    last_name TEXT NOT NULL CHECK (length(last_name) BETWEEN 1 AND 80),
    normalized_name TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS profiles_normalized_name_unique
    ON profiles (normalized_name)`,
  `CREATE TABLE IF NOT EXISTS profile_sessions (
    token_hash TEXT PRIMARY KEY,
    profile_id INTEGER NOT NULL REFERENCES profiles(id)
      ON DELETE RESTRICT ON UPDATE RESTRICT,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL CHECK (expires_at > created_at)
  )`,
  `CREATE INDEX IF NOT EXISTS profile_sessions_profile_index
    ON profile_sessions (profile_id)`,
  `CREATE INDEX IF NOT EXISTS profile_sessions_expiry_index
    ON profile_sessions (expires_at)`,
  `CREATE TABLE IF NOT EXISTS import_batches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id INTEGER NOT NULL REFERENCES profiles(id)
      ON DELETE RESTRICT ON UPDATE RESTRICT,
    file_hash TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size_bytes INTEGER NOT NULL CHECK (file_size_bytes >= 0),
    file_last_modified INTEGER NOT NULL CHECK (file_last_modified >= 0),
    currency TEXT NOT NULL CHECK (currency = 'PLN'),
    imported_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS import_batches_profile_file_hash_unique
    ON import_batches (profile_id, file_hash)`,
  `CREATE INDEX IF NOT EXISTS import_batches_profile_imported_at_index
    ON import_batches (profile_id, imported_at)`,
  `CREATE TABLE IF NOT EXISTS monthly_expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id INTEGER NOT NULL REFERENCES profiles(id)
      ON DELETE RESTRICT ON UPDATE RESTRICT,
    import_batch_id INTEGER NOT NULL REFERENCES import_batches(id)
      ON DELETE RESTRICT ON UPDATE RESTRICT,
    period_month TEXT NOT NULL,
    source_date TEXT NOT NULL,
    category_key TEXT NOT NULL,
    category_label TEXT NOT NULL,
    amount_minor INTEGER NOT NULL CHECK (amount_minor >= 0),
    source_sheet TEXT NOT NULL,
    source_row INTEGER NOT NULL CHECK (source_row > 0),
    source_cell TEXT,
    source_formula TEXT,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS monthly_expenses_profile_period_category_unique
    ON monthly_expenses (profile_id, period_month, category_key)`,
  `CREATE INDEX IF NOT EXISTS monthly_expenses_import_batch_index
    ON monthly_expenses (import_batch_id)`,
  `CREATE TABLE IF NOT EXISTS monthly_incomes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id INTEGER NOT NULL REFERENCES profiles(id)
      ON DELETE RESTRICT ON UPDATE RESTRICT,
    import_batch_id INTEGER NOT NULL REFERENCES import_batches(id)
      ON DELETE RESTRICT ON UPDATE RESTRICT,
    period_month TEXT NOT NULL,
    source_date TEXT NOT NULL,
    amount_minor INTEGER NOT NULL CHECK (amount_minor >= 0),
    source_sheet TEXT NOT NULL,
    source_row INTEGER NOT NULL CHECK (source_row > 0),
    source_cell TEXT,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS monthly_incomes_profile_period_unique
    ON monthly_incomes (profile_id, period_month)`,
  `CREATE INDEX IF NOT EXISTS monthly_incomes_import_batch_index
    ON monthly_incomes (import_batch_id)`,
  `CREATE TABLE IF NOT EXISTS budget_plan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id INTEGER NOT NULL REFERENCES profiles(id)
      ON DELETE RESTRICT ON UPDATE RESTRICT,
    import_batch_id INTEGER NOT NULL REFERENCES import_batches(id)
      ON DELETE RESTRICT ON UPDATE RESTRICT,
    category_key TEXT NOT NULL,
    category_label TEXT NOT NULL,
    planned_minor INTEGER NOT NULL CHECK (planned_minor >= 0),
    source_sheet TEXT NOT NULL,
    source_row INTEGER NOT NULL CHECK (source_row > 0),
    source_cell TEXT,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS budget_plan_profile_category_unique
    ON budget_plan (profile_id, category_key)`,
  `CREATE INDEX IF NOT EXISTS budget_plan_import_batch_index
    ON budget_plan (import_batch_id)`,
] as const;
