import type { getD1 } from '@/db';
import type { Profile } from '@/lib/domain/profile';
import type { ProfileSessionInput } from '@/lib/domain/profile-schema';

type DatabaseBinding = ReturnType<typeof getD1>;

interface ProfileRow {
  id: number;
  first_name: string;
  last_name: string;
  created_at: string;
}

interface NewSession {
  tokenHash: string;
  createdAt: string;
  expiresAt: string;
}

const profileUpsert = `INSERT INTO profiles (
  first_name, last_name, normalized_name
) VALUES (?, ?, ?)
ON CONFLICT (normalized_name) DO UPDATE SET
  first_name = excluded.first_name,
  last_name = excluded.last_name
RETURNING id, first_name, last_name, created_at`;

const sessionInsert = `INSERT INTO profile_sessions (
  token_hash, profile_id, created_at, expires_at
) VALUES (?, ?, ?, ?)`;

const activeProfileQuery = `SELECT
  profiles.id,
  profiles.first_name,
  profiles.last_name,
  profiles.created_at
FROM profile_sessions
INNER JOIN profiles ON profiles.id = profile_sessions.profile_id
WHERE profile_sessions.token_hash = ?
  AND profile_sessions.expires_at > ?
LIMIT 1`;

const sessionDelete = `DELETE FROM profile_sessions WHERE token_hash = ?`;

function toProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    createdAt: row.created_at,
  };
}

export class SessionRepository {
  constructor(private readonly database: DatabaseBinding) {}

  async createSession(
    input: ProfileSessionInput,
    normalizedName: string,
    session: NewSession,
  ): Promise<Profile> {
    const profile = await this.database
      .prepare(profileUpsert)
      .bind(input.firstName, input.lastName, normalizedName)
      .first<ProfileRow>();

    if (profile === null) {
      throw new Error('PROFILE_NOT_RETURNED');
    }

    await this.database
      .prepare(sessionInsert)
      .bind(
        session.tokenHash,
        profile.id,
        session.createdAt,
        session.expiresAt,
      )
      .run();

    return toProfile(profile);
  }

  async getActiveProfile(
    tokenHash: string,
    currentTime: string,
  ): Promise<Profile | null> {
    const profile = await this.database
      .prepare(activeProfileQuery)
      .bind(tokenHash, currentTime)
      .first<ProfileRow>();

    if (profile === null) {
      return null;
    }

    return toProfile(profile);
  }

  async deleteSession(tokenHash: string): Promise<void> {
    await this.database.prepare(sessionDelete).bind(tokenHash).run();
  }
}
