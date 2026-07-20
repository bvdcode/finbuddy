import type { CategorySummary, MonthSummary } from "./finance-model";

export type InsightFact =
  | { kind: "peak"; month: MonthSummary }
  | { kind: "quiet"; month: MonthSummary }
  | { kind: "leadingCategory"; month: MonthSummary; category: CategorySummary }
  | { kind: "rising"; percentage: number }
  | { kind: "falling"; percentage: number }
  | { kind: "steady" };

export function buildInsights(
  months: MonthSummary[],
  selected: MonthSummary,
): InsightFact[] {
  if (months.length === 0) {
    return [];
  }

  const peak = months.reduce((best, month) => {
    if (month.expenseMinor > best.expenseMinor) {
      return month;
    }
    return best;
  });
  const quiet = months.reduce((best, month) => {
    if (month.expenseMinor < best.expenseMinor) {
      return month;
    }
    return best;
  });
  const facts: InsightFact[] = [
    { kind: "peak", month: peak },
    { kind: "quiet", month: quiet },
  ];

  const leading = selected.categories[0];
  if (leading) {
    facts.push({ kind: "leadingCategory", month: selected, category: leading });
  }

  const recent = months.slice(-3);
  const first = recent[0];
  const last = recent.at(-1);
  if (first && last && first.expenseMinor > 0) {
    const percentage = Math.round(
      ((last.expenseMinor - first.expenseMinor) / first.expenseMinor) * 100,
    );
    if (Math.abs(percentage) <= 3) {
      facts.push({ kind: "steady" });
    } else if (percentage > 0) {
      facts.push({ kind: "rising", percentage });
    } else {
      facts.push({ kind: "falling", percentage: Math.abs(percentage) });
    }
  }

  return facts.slice(0, 4);
}
