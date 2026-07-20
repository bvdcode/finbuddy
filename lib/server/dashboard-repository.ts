import type { getD1 } from '@/db';
import type { DashboardData } from '@/lib/domain/finance';
import {
  type BudgetPlanRow,
  type ImportBatchRow,
  type MonthlyExpenseRow,
  type MonthlyIncomeRow,
  toBudgetPlanItem,
  toImportBatch,
  toMonthlyExpense,
  toMonthlyIncome,
} from './record-mappers';

type DatabaseBinding = ReturnType<typeof getD1>;

const importQuery = `SELECT id, file_hash, file_name, file_size_bytes,
  file_last_modified, currency, imported_at
  FROM import_batches
  WHERE profile_id = ?
  ORDER BY imported_at DESC, id DESC`;

const expenseQuery = `SELECT id, import_batch_id, period_month, source_date,
  category_key, category_label, amount_minor, source_sheet, source_row,
  source_cell, source_formula, updated_at
  FROM monthly_expenses
  WHERE profile_id = ?
  ORDER BY period_month, category_label, id`;

const incomeQuery = `SELECT id, import_batch_id, period_month, source_date,
  amount_minor, source_sheet, source_row, source_cell, updated_at
  FROM monthly_incomes
  WHERE profile_id = ?
  ORDER BY period_month, id`;

const budgetQuery = `SELECT id, import_batch_id, category_key, category_label,
  planned_minor, source_sheet, source_row, source_cell, updated_at
  FROM budget_plan
  WHERE profile_id = ?
  ORDER BY category_label, id`;

export class DashboardRepository {
  constructor(private readonly database: DatabaseBinding) {}

  async getDashboard(profileId: number): Promise<DashboardData> {
    const [imports, expenses, incomes, budgetPlan] = await Promise.all([
      this.database.prepare(importQuery).bind(profileId).all<ImportBatchRow>(),
      this.database.prepare(expenseQuery).bind(profileId).all<MonthlyExpenseRow>(),
      this.database.prepare(incomeQuery).bind(profileId).all<MonthlyIncomeRow>(),
      this.database.prepare(budgetQuery).bind(profileId).all<BudgetPlanRow>(),
    ]);

    return {
      imports: imports.results.map(toImportBatch),
      expenses: expenses.results.map(toMonthlyExpense),
      incomes: incomes.results.map(toMonthlyIncome),
      budgetPlan: budgetPlan.results.map(toBudgetPlanItem),
    };
  }
}
