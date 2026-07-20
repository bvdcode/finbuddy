import type { ApiErrorCode } from '@/lib/domain/api-errors';

export function errorResponse(code: ApiErrorCode, status: number): Response {
  return Response.json({ error: { code } }, { status });
}
