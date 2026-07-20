const sessionTokenBytes = 32;

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(
    '',
  );
}

export function generateSessionToken(): string {
  const bytes = new Uint8Array(sessionTokenBytes);
  crypto.getRandomValues(bytes);
  return toHex(bytes);
}

export async function hashSessionToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(token),
  );
  return toHex(new Uint8Array(digest));
}
