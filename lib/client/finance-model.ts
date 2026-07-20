import type {
  DashboardData,
  ImportBatch,
  MonthlyExpense,
} from "@/lib/domain/finance";

export interface CategorySummary {
  categoryKey: string;
  categoryLabel: string;
  amountMinor: number;
  expense: MonthlyExpense;
}

export interface MonthSummary {
  periodMonth: string;
  expenseMinor: number;
  incomeMinor: number;
  categories: CategorySummary[];
}

export type DriverDirection = "up" | "down" | "same";

export interface ChangeDriver {
  categoryKey: string;
  categoryLabel: string;
  changeMinor: number;
  direction: DriverDirection;
}

export interface ImportSummary {
  batch: ImportBatch;
  aggregateCount: number;
  monthCount: number;
  firstPeriod: string | null;
  lastPeriod: string | null;
}

export function buildMonthSummaries(data: DashboardData): MonthSummary[] {
  const periods = new Set<string>();
  data.expenses.forEach((expense) => periods.add(expense.periodMonth));
  data.incomes.forEach((income) => periods.add(income.periodMonth));

  return [...periods].sort().map((periodMonth) => {
    const expenses = data.expenses.filter(
      (expense) => expense.periodMonth === periodMonth,
    );
    const categories = expenses
      .map((expense) => ({
        categoryKey: expense.categoryKey,
        categoryLabel: expense.categoryLabel,
        amountMinor: expense.amountMinor,
        expense,
      }))
      .sort((left, right) => right.amountMinor - left.amountMinor);

    return {
      periodMonth,
      expenseMinor: expenses.reduce(
        (total, expense) => total + expense.amountMinor,
        0,
      ),
      incomeMinor: data.incomes
        .filter((income) => income.periodMonth === periodMonth)
        .reduce((total, income) => total + income.amountMinor, 0),
      categories,
    };
  });
}

export function resolveSelectedMonth(
  months: MonthSummary[],
  selectedPeriod: string | null,
): MonthSummary | null {
  const selected = months.find(
    (month) => month.periodMonth === selectedPeriod,
  );
  if (selected) {
    return selected;
  }
  return months.at(-1) ?? null;
}

export function buildChangeDrivers(
  current: MonthSummary,
  previous: MonthSummary | null,
): ChangeDriver[] {
  if (previous === null) {
    return [];
  }

  const keys = new Set<string>();
  current.categories.forEach((category) => keys.add(category.categoryKey));
  previous.categories.forEach((category) => keys.add(category.categoryKey));

  return [...keys]
    .map((categoryKey) => {
      const currentCategory = current.categories.find(
        (category) => category.categoryKey === categoryKey,
      );
      const previousCategory = previous.categories.find(
        (category) => category.categoryKey === categoryKey,
      );
      const changeMinor =
        (currentCategory?.amountMinor ?? 0) -
        (previousCategory?.amountMinor ?? 0);
      let direction: DriverDirection = "same";
      if (changeMinor > 0) {
        direction = "up";
      } else if (changeMinor < 0) {
        direction = "down";
      }

      return {
        categoryKey,
        categoryLabel:
          currentCategory?.categoryLabel ??
          previousCategory?.categoryLabel ??
          categoryKey,
        changeMinor,
        direction,
      };
    })
    .sort(
      (left, right) =>
        Math.abs(right.changeMinor) - Math.abs(left.changeMinor),
    )
    .slice(0, 4);
}

export function buildImportSummaries(data: DashboardData): ImportSummary[] {
  return data.imports.map((batch) => {
    const expenses = data.expenses.filter(
      (expense) => expense.importBatchId === batch.id,
    );
    const incomes = data.incomes.filter(
      (income) => income.importBatchId === batch.id,
    );
    const budget = data.budgetPlan.filter(
      (item) => item.importBatchId === batch.id,
    );
    const periods = new Set<string>();
    expenses.forEach((expense) => periods.add(expense.periodMonth));
    incomes.forEach((income) => periods.add(income.periodMonth));
    const sortedPeriods = [...periods].sort();

    return {
      batch,
      aggregateCount: expenses.length + incomes.length + budget.length,
      monthCount: sortedPeriods.length,
      firstPeriod: sortedPeriods[0] ?? null,
      lastPeriod: sortedPeriods.at(-1) ?? null,
    };
  });
}
