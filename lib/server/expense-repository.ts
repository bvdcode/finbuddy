import type { getD1 } from '@/db';
import type { MonthlyExpense } from '@/lib/domain/finance';
import {
  type MonthlyExpenseRow,
  toMonthlyExpense,
} from './record-mappers';

type DatabaseBinding = ReturnType<typeof getD1>;

const expenseUpdate = `UPDATE monthly_expenses
  SET amount_minor = ?, updated_at = CURRENT_TIMESTAMP
  WHERE id = ? AND profile_id = ?
  RETURNING id, import_batch_id, period_month, source_date, category_key,
    category_label, amount_minor, source_sheet, source_row, source_cell,
    source_formula, updated_at`;

export class ExpenseRepository {
  constructor(private readonly database: DatabaseBinding) {}

  async updateAmount(
    profileId: number,
    expenseId: number,
    amountMinor: number,
  ): Promise<MonthlyExpense | null> {
    const row = await this.database
      .prepare(expenseUpdate)
      .bind(amountMinor, expenseId, profileId)
      .first<MonthlyExpenseRow>();

    if (row === null) {
      return null;
    }

    return toMonthlyExpense(row);
  }
}
