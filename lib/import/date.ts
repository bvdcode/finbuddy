export type SpreadsheetCellValue = string | number | boolean | Date | undefined;

export interface NormalizedSpreadsheetDate {
  sourceDate: string;
  periodMonth: string;
}

const MILLISECONDS_PER_DAY = 86_400_000;

function fromParts(
  year: number,
  month: number,
  day: number,
): NormalizedSpreadsheetDate | null {
  const candidate = new Date(Date.UTC(year, month - 1, day));
  if (
    candidate.getUTCFullYear() !== year ||
    candidate.getUTCMonth() !== month - 1 ||
    candidate.getUTCDate() !== day
  ) {
    return null;
  }

  const yearText = year.toString().padStart(4, "0");
  const monthText = month.toString().padStart(2, "0");
  const dayText = day.toString().padStart(2, "0");
  return {
    sourceDate: `${yearText}-${monthText}-${dayText}`,
    periodMonth: `${yearText}-${monthText}`,
  };
}

function fromDate(value: Date): NormalizedSpreadsheetDate | null {
  if (!Number.isFinite(value.getTime())) {
    return null;
  }

  return fromParts(
    value.getUTCFullYear(),
    value.getUTCMonth() + 1,
    value.getUTCDate(),
  );
}

function fromString(value: string): NormalizedSpreadsheetDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/.exec(value.trim());
  if (match === null) {
    return null;
  }

  return fromParts(Number(match[1]), Number(match[2]), Number(match[3]));
}

function fromExcelSerial(
  value: number,
  date1904: boolean,
): NormalizedSpreadsheetDate | null {
  if (!Number.isFinite(value)) {
    return null;
  }

  const serialDay = Math.floor(value);
  let epochMilliseconds: number;
  let elapsedDays: number;

  if (date1904) {
    if (serialDay < 0) {
      return null;
    }
    epochMilliseconds = Date.UTC(1904, 0, 1);
    elapsedDays = serialDay;
  } else {
    if (serialDay < 1 || serialDay === 60) {
      return null;
    }
    epochMilliseconds = Date.UTC(1899, 11, 31);
    elapsedDays = serialDay;
    if (serialDay > 60) {
      elapsedDays -= 1;
    }
  }

  return fromDate(
    new Date(epochMilliseconds + elapsedDays * MILLISECONDS_PER_DAY),
  );
}

export function normalizeSpreadsheetDate(
  value: SpreadsheetCellValue,
  date1904: boolean,
): NormalizedSpreadsheetDate | null {
  if (value instanceof Date) {
    return fromDate(value);
  }

  switch (typeof value) {
    case "number":
      return fromExcelSerial(value, date1904);
    case "string":
      return fromString(value);
    case "boolean":
    case "undefined":
      return null;
  }
}
