import { getD1 } from '@/db';
import { ensureSchema } from '@/db/initialize';
import type { Profile } from '@/lib/domain/profile';
import { readSessionToken } from './session-cookie';
import { SessionRepository } from './session-repository';
import { hashSessionToken } from './session-token';

export async function requireProfile(request: Request): Promise<Profile | null> {
  const token = readSessionToken(request);
  if (token === null) {
    return null;
  }

  await ensureSchema();
  const tokenHash = await hashSessionToken(token);
  const repository = new SessionRepository(getD1());
  return repository.getActiveProfile(tokenHash, new Date().toISOString());
}
