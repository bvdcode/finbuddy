import { sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

export const profiles = sqliteTable(
  'profiles',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    normalizedName: text('normalized_name').notNull(),
    createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex('profiles_normalized_name_unique').on(table.normalizedName),
    check(
      'profiles_first_name_check',
      sql`length(${table.firstName}) BETWEEN 1 AND 80`,
    ),
    check(
      'profiles_last_name_check',
      sql`length(${table.lastName}) BETWEEN 1 AND 80`,
    ),
  ],
);

export const profileSessions = sqliteTable(
  'profile_sessions',
  {
    tokenHash: text('token_hash').primaryKey(),
    profileId: integer('profile_id')
      .notNull()
      .references(() => profiles.id, {
        onDelete: 'restrict',
        onUpdate: 'restrict',
      }),
    createdAt: text('created_at').notNull(),
    expiresAt: text('expires_at').notNull(),
  },
  (table) => [
    index('profile_sessions_profile_index').on(table.profileId),
    index('profile_sessions_expiry_index').on(table.expiresAt),
    check(
      'profile_sessions_expiry_check',
      sql`${table.expiresAt} > ${table.createdAt}`,
    ),
  ],
);

export const importBatches = sqliteTable(
  'import_batches',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    profileId: integer('profile_id')
      .notNull()
      .references(() => profiles.id, {
        onDelete: 'restrict',
        onUpdate: 'restrict',
      }),
    fileHash: text('file_hash').notNull(),
    fileName: text('file_name').notNull(),
    fileSizeBytes: integer('file_size_bytes').notNull(),
    fileLastModified: integer('file_last_modified').notNull(),
    currency: text('currency', { enum: ['PLN'] }).notNull(),
    importedAt: text('imported_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex('import_batches_profile_file_hash_unique').on(
      table.profileId,
      table.fileHash,
    ),
    index('import_batches_profile_imported_at_index').on(
      table.profileId,
      table.importedAt,
    ),
    check('import_batches_file_size_check', sql`${table.fileSizeBytes} >= 0`),
    check(
      'import_batches_last_modified_check',
      sql`${table.fileLastModified} >= 0`,
    ),
    check('import_batches_currency_check', sql`${table.currency} = 'PLN'`),
  ],
);

export const monthlyExpenses = sqliteTable(
  'monthly_expenses',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    profileId: integer('profile_id')
      .notNull()
      .references(() => profiles.id, {
        onDelete: 'restrict',
        onUpdate: 'restrict',
      }),
    importBatchId: integer('import_batch_id')
      .notNull()
      .references(() => importBatches.id, {
        onDelete: 'restrict',
        onUpdate: 'restrict',
      }),
    periodMonth: text('period_month').notNull(),
    sourceDate: text('source_date').notNull(),
    categoryKey: text('category_key').notNull(),
    categoryLabel: text('category_label').notNull(),
    amountMinor: integer('amount_minor').notNull(),
    sourceSheet: text('source_sheet').notNull(),
    sourceRow: integer('source_row').notNull(),
    sourceCell: text('source_cell'),
    sourceFormula: text('source_formula'),
    updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex('monthly_expenses_profile_period_category_unique').on(
      table.profileId,
      table.periodMonth,
      table.categoryKey,
    ),
    index('monthly_expenses_import_batch_index').on(table.importBatchId),
    check('monthly_expenses_amount_check', sql`${table.amountMinor} >= 0`),
    check('monthly_expenses_source_row_check', sql`${table.sourceRow} > 0`),
  ],
);

export const monthlyIncomes = sqliteTable(
  'monthly_incomes',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    profileId: integer('profile_id')
      .notNull()
      .references(() => profiles.id, {
        onDelete: 'restrict',
        onUpdate: 'restrict',
      }),
    importBatchId: integer('import_batch_id')
      .notNull()
      .references(() => importBatches.id, {
        onDelete: 'restrict',
        onUpdate: 'restrict',
      }),
    periodMonth: text('period_month').notNull(),
    sourceDate: text('source_date').notNull(),
    amountMinor: integer('amount_minor').notNull(),
    sourceSheet: text('source_sheet').notNull(),
    sourceRow: integer('source_row').notNull(),
    sourceCell: text('source_cell'),
    updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex('monthly_incomes_profile_period_unique').on(
      table.profileId,
      table.periodMonth,
    ),
    index('monthly_incomes_import_batch_index').on(table.importBatchId),
    check('monthly_incomes_amount_check', sql`${table.amountMinor} >= 0`),
    check('monthly_incomes_source_row_check', sql`${table.sourceRow} > 0`),
  ],
);

export const budgetPlan = sqliteTable(
  'budget_plan',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    profileId: integer('profile_id')
      .notNull()
      .references(() => profiles.id, {
        onDelete: 'restrict',
        onUpdate: 'restrict',
      }),
    importBatchId: integer('import_batch_id')
      .notNull()
      .references(() => importBatches.id, {
        onDelete: 'restrict',
        onUpdate: 'restrict',
      }),
    categoryKey: text('category_key').notNull(),
    categoryLabel: text('category_label').notNull(),
    plannedMinor: integer('planned_minor').notNull(),
    sourceSheet: text('source_sheet').notNull(),
    sourceRow: integer('source_row').notNull(),
    sourceCell: text('source_cell'),
    updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex('budget_plan_profile_category_unique').on(
      table.profileId,
      table.categoryKey,
    ),
    index('budget_plan_import_batch_index').on(table.importBatchId),
    check('budget_plan_amount_check', sql`${table.plannedMinor} >= 0`),
    check('budget_plan_source_row_check', sql`${table.sourceRow} > 0`),
  ],
);
