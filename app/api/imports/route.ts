import { getD1 } from '@/db';
import { ApiErrorCode } from '@/lib/domain/api-errors';
import {
  type NormalizedImport,
  normalizedImportSchema,
} from '@/lib/domain/import-schema';
import { errorResponse } from '@/lib/server/http';
import { ImportRepository } from '@/lib/server/import-repository';
import { requireProfile } from '@/lib/server/require-profile';

async function parseImport(request: Request): Promise<NormalizedImport | null> {
  try {
    const result = normalizedImportSchema.safeParse(await request.json());
    if (!result.success) {
      return null;
    }

    return result.data;
  } catch {
    return null;
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const profile = await requireProfile(request);
    if (profile === null) {
      return errorResponse(ApiErrorCode.SessionRequired, 401);
    }

    const payload = await parseImport(request);
    if (payload === null) {
      return errorResponse(ApiErrorCode.InvalidImport, 400);
    }

    const repository = new ImportRepository(getD1());
    const result = await repository.upsert(profile.id, payload);
    return Response.json(result);
  } catch {
    return errorResponse(ApiErrorCode.ImportFailed, 500);
  }
}
