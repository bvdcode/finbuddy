import type { FinanceImportPreview } from "@/lib/import";

export async function parseImportFile(
  file: File,
): Promise<FinanceImportPreview> {
  const { parseFinanceWorkbook } = await import("@/lib/import");
  return parseFinanceWorkbook({
    data: await file.arrayBuffer(),
    fileName: file.name.trim(),
    fileSizeBytes: file.size,
    fileLastModified: file.lastModified,
  });
}
