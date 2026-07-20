import { resources } from "@/lib/i18n/resources";

export type MonthNameForm = "short" | "full";

function monthNames(form: MonthNameForm): readonly string[] {
  switch (form) {
    case "short":
      return resources.ru.translation.months.short;
    case "full":
      return resources.ru.translation.months.full;
  }
}

function parsePeriod(periodMonth: string): { monthIndex: number; year: string } {
  const [year, month] = periodMonth.split("-");
  return { monthIndex: Number(month) - 1, year };
}

export function formatMonth(
  periodMonth: string,
  form: MonthNameForm = "full",
): string {
  const { monthIndex, year } = parsePeriod(periodMonth);
  return monthNames(form)[monthIndex] + " " + year;
}

export function formatMoney(amountMinor: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountMinor / 100);
}

export function formatCompactMoney(amountMinor: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "PLN",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amountMinor / 100);
}

export function formatEditableMoney(amountMinor: number): string {
  return new Intl.NumberFormat("ru-RU", {
    useGrouping: false,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountMinor / 100);
}

export function parseEditableMoney(value: string): number | null {
  const trimmed = value.trim().replaceAll(" ", "").replace(",", ".");
  if (!/^\d+(\.\d{0,2})?$/.test(trimmed)) {
    return null;
  }
  return Math.round(Number(trimmed) * 100);
}

export function formatImportDate(isoDate: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}
