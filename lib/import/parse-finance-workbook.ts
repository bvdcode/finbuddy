import { extractFinanceData } from "./extractor";
import {
  DEFAULT_IMPORT_CURRENCY,
  type FinanceImportPreview,
  type FinanceWorkbookInput,
} from "./types";

async function sha256Hex(data: ArrayBuffer): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", data);
  let hash = "";
  for (const byte of new Uint8Array(digest)) {
    hash += byte.toString(16).padStart(2, "0");
  }
  return hash;
}

export async function parseFinanceWorkbook(
  input: FinanceWorkbookInput,
): Promise<FinanceImportPreview> {
  const [fileHash, xlsx] = await Promise.all([
    sha256Hex(input.data),
    import("xlsx"),
  ]);
  const workbook = xlsx.read(input.data, {
    type: "array",
    raw: true,
    cellDates: false,
    cellFormula: true,
    cellHTML: false,
    cellNF: false,
    cellStyles: false,
    cellText: false,
    bookDeps: false,
    bookFiles: false,
    bookProps: false,
    bookSheets: false,
    bookVBA: false,
  });
  const extracted = extractFinanceData(workbook, xlsx);

  return {
    payload: {
      source: {
        fileName: input.fileName,
        fileHash,
        fileSizeBytes: input.fileSizeBytes,
        fileLastModified: input.fileLastModified,
        currency: DEFAULT_IMPORT_CURRENCY,
      },
      expenses: extracted.expenses,
      incomes: extracted.incomes,
      budgetPlan: extracted.budgetPlan,
    },
    warnings: extracted.warnings,
    counts: extracted.counts,
  };
}
