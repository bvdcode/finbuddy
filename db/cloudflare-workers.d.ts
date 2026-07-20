type D1Value = null | number | string | boolean | ArrayBuffer;

interface D1Result<Row = Record<string, never>> {
  results: Row[];
  success: boolean;
}

interface D1PreparedStatement {
  bind(...values: D1Value[]): D1PreparedStatement;
  first<Row = Record<string, never>>(): Promise<Row | null>;
  all<Row = Record<string, never>>(): Promise<D1Result<Row>>;
  run<Row = Record<string, never>>(): Promise<D1Result<Row>>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<Row = Record<string, never>>(
    statements: D1PreparedStatement[],
  ): Promise<D1Result<Row>[]>;
}

interface Fetcher {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

interface CloudflareWorkersEnv {
  DB?: D1Database;
}

declare module 'cloudflare:workers' {
  export const env: CloudflareWorkersEnv;
}
