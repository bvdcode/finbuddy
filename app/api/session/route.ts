import { getD1 } from '@/db';
import { ensureSchema } from '@/db/initialize';
import { ApiErrorCode } from '@/lib/domain/api-errors';
import type { ProfileSessionInput } from '@/lib/domain/profile-schema';
import {
  normalizeProfileName,
  profileSessionInputSchema,
} from '@/lib/domain/profile-schema';
import { errorResponse } from '@/lib/server/http';
import { requireProfile } from '@/lib/server/require-profile';
import {
  buildExpiredSessionCookie,
  buildSessionCookie,
  isSecureRequest,
  readSessionToken,
  sessionDurationMilliseconds,
} from '@/lib/server/session-cookie';
import { SessionRepository } from '@/lib/server/session-repository';
import {
  generateSessionToken,
  hashSessionToken,
} from '@/lib/server/session-token';

async function parseInput(
  request: Request,
): Promise<ProfileSessionInput | null> {
  try {
    const result = profileSessionInputSchema.safeParse(await request.json());
    if (!result.success) {
      return null;
    }

    return result.data;
  } catch {
    return null;
  }
}

export async function POST(request: Request): Promise<Response> {
  const input = await parseInput(request);
  if (input === null) {
    return errorResponse(ApiErrorCode.InvalidProfile, 400);
  }

  try {
    await ensureSchema();
    const token = generateSessionToken();
    const tokenHash = await hashSessionToken(token);
    const createdAt = new Date();
    const expiresAt = new Date(
      createdAt.getTime() + sessionDurationMilliseconds,
    );
    const repository = new SessionRepository(getD1());
    const profile = await repository.createSession(
      input,
      normalizeProfileName(input.firstName, input.lastName),
      {
        tokenHash,
        createdAt: createdAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
      },
    );
    const cookie = buildSessionCookie(token, isSecureRequest(request));

    return Response.json(
      { profile },
      { headers: { 'Set-Cookie': cookie } },
    );
  } catch {
    return errorResponse(ApiErrorCode.SessionCreateFailed, 500);
  }
}

export async function GET(request: Request): Promise<Response> {
  try {
    const profile = await requireProfile(request);
    if (profile === null) {
      return errorResponse(ApiErrorCode.SessionRequired, 401);
    }

    return Response.json({ profile });
  } catch {
    return errorResponse(ApiErrorCode.SessionReadFailed, 500);
  }
}

export async function DELETE(request: Request): Promise<Response> {
  const expiredCookie = buildExpiredSessionCookie(isSecureRequest(request));
  const token = readSessionToken(request);
  if (token === null) {
    return new Response(null, {
      status: 204,
      headers: { 'Set-Cookie': expiredCookie },
    });
  }

  try {
    await ensureSchema();
    const tokenHash = await hashSessionToken(token);
    const repository = new SessionRepository(getD1());
    await repository.deleteSession(tokenHash);

    return new Response(null, {
      status: 204,
      headers: { 'Set-Cookie': expiredCookie },
    });
  } catch {
    return Response.json(
      { error: { code: ApiErrorCode.SessionDeleteFailed } },
      {
        status: 500,
        headers: { 'Set-Cookie': expiredCookie },
      },
    );
  }
}
