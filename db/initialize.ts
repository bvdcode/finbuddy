import { getD1 } from './index';
import { runtimeSchemaStatements } from './runtime-schema';

let schemaInitialization: Promise<void> | null = null;

async function initializeSchema(): Promise<void> {
  const database = getD1();
  const statements = runtimeSchemaStatements.map((statement) =>
    database.prepare(statement),
  );

  await database.batch(statements);
}

export function ensureSchema(): Promise<void> {
  if (schemaInitialization === null) {
    schemaInitialization = initializeSchema();
  }

  return schemaInitialization;
}
