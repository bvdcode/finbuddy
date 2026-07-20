export const sessionCookieName = 'finbuddy_session';
export const sessionMaxAgeSeconds = 30 * 24 * 60 * 60;
export const sessionDurationMilliseconds = sessionMaxAgeSeconds * 1000;
const sessionTokenPattern = /^[a-f0-9]{64}$/;

function baseCookieAttributes(secure: boolean): string[] {
  const attributes = ['HttpOnly', 'SameSite=Lax', 'Path=/'];
  if (secure) {
    attributes.push('Secure');
  }

  return attributes;
}

export function buildSessionCookie(token: string, secure: boolean): string {
  return [
    sessionCookieName + '=' + token,
    ...baseCookieAttributes(secure),
    'Max-Age=' + sessionMaxAgeSeconds,
  ].join('; ');
}

export function buildExpiredSessionCookie(secure: boolean): string {
  return [
    sessionCookieName + '=',
    ...baseCookieAttributes(secure),
    'Max-Age=0',
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
  ].join('; ');
}

export function getSessionToken(cookieHeader: string | null): string | null {
  if (cookieHeader === null) {
    return null;
  }

  for (const segment of cookieHeader.split(';')) {
    const separatorIndex = segment.indexOf('=');
    if (separatorIndex < 0) {
      continue;
    }

    const name = segment.slice(0, separatorIndex).trim();
    if (name === sessionCookieName) {
      const token = segment.slice(separatorIndex + 1).trim();
      if (!sessionTokenPattern.test(token)) {
        return null;
      }

      return token;
    }
  }

  return null;
}

export function readSessionToken(request: Request): string | null {
  return getSessionToken(request.headers.get('Cookie'));
}

export function isSecureRequest(request: Request): boolean {
  return new URL(request.url).protocol === 'https:';
}
