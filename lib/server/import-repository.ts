import type { getD1 } from '@/db';
import type { ImportResult } from '@/lib/domain/finance';
import type { NormalizedImport } from '@/lib/domain/import-schema';
import { bulkImportStatements } from './import-sql';

type DatabaseBinding = ReturnType<typeof getD1>;

interface ImportBatchIdRow {
  id: number;
}

const importBatchUpsert = `INSERT INTO import_batches (
  profile_id, file_hash, file_name, file_size_bytes, file_last_modified, currency
) VALUES (?, ?, ?, ?, ?, ?)
ON CONFLICT (profile_id, file_hash) DO UPDATE SET
  file_name = excluded.file_name,
  file_size_bytes = excluded.file_size_bytes,
  file_last_modified = excluded.file_last_modified,
  currency = excluded.currency,
  imported_at = CURRENT_TIMESTAMP
RETURNING id`;

function serializeRows<Row>(rows: Row[]): string {
  const serialized = JSON.stringify(rows);
  if (serialized === undefined) {
    throw new Error('IMPORT_SERIALIZATION_FAILED');
  }

  return serialized;
}

export class ImportRepository {
  constructor(private readonly database: DatabaseBinding) {}

  async upsert(
    profileId: number,
    payload: NormalizedImport,
  ): Promise<ImportResult> {
    const importBatch = await this.database
      .prepare(importBatchUpsert)
      .bind(
        profileId,
        payload.source.fileHash,
        payload.source.fileName,
        payload.source.fileSizeBytes,
        payload.source.fileLastModified,
        payload.source.currency,
      )
      .first<ImportBatchIdRow>();

    if (importBatch === null) {
      throw new Error('IMPORT_BATCH_NOT_RETURNED');
    }

    const expenseRows = serializeRows(payload.expenses);
    const incomeRows = serializeRows(payload.incomes);
    const budgetRows = serializeRows(payload.budgetPlan);

    await this.database.batch([
      this.database
        .prepare(bulkImportStatements.expenses)
        .bind(profileId, importBatch.id, expenseRows),
      this.database
        .prepare(bulkImportStatements.incomes)
        .bind(profileId, importBatch.id, incomeRows),
      this.database
        .prepare(bulkImportStatements.budgetPlan)
        .bind(profileId, importBatch.id, budgetRows),
    ]);

    return {
      importBatchId: importBatch.id,
      counts: {
        expenses: payload.expenses.length,
        incomes: payload.incomes.length,
        budgetPlan: payload.budgetPlan.length,
      },
    };
  }
}
