import assert from 'node:assert/strict';
import test from 'node:test';
import {
  normalizeProfileName,
  profileSessionInputSchema,
} from '../../lib/domain/profile-schema.ts';
import {
  buildExpiredSessionCookie,
  buildSessionCookie,
  getSessionToken,
  isSecureRequest,
  sessionMaxAgeSeconds,
} from '../../lib/server/session-cookie.ts';
import {
  generateSessionToken,
  hashSessionToken,
} from '../../lib/server/session-token.ts';

test('trims Unicode profile names and rejects controls', () => {
  const result = profileSessionInputSchema.safeParse({
    firstName: '  Ирина  ',
    lastName: '  Примерова  ',
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.firstName, 'Ирина');
    assert.equal(result.data.lastName, 'Примерова');
  }

  assert.equal(
    profileSessionInputSchema.safeParse({
      firstName: 'Va\ndim',
      lastName: 'Example',
    }).success,
    false,
  );
  assert.equal(
    profileSessionInputSchema.safeParse({
      firstName: 'X'.repeat(81),
      lastName: 'Example',
    }).success,
    false,
  );
});

test('normalizes profile identity with NFKC, case, and collapsed spaces', () => {
  assert.equal(
    normalizeProfileName('ＡＮＮＡ', '  Doe   Test  '),
    JSON.stringify(['anna', 'doe test']),
  );
  assert.notEqual(
    normalizeProfileName('Ann Marie', 'Smith'),
    normalizeProfileName('Ann', 'Marie Smith'),
  );
});

test('serializes and parses strict session cookies', () => {
  const token = 'a'.repeat(64);
  const cookie = buildSessionCookie(token, false);
  const secureCookie = buildSessionCookie(token, true);
  const expiredCookie = buildExpiredSessionCookie(true);

  assert.equal(
    getSessionToken('theme=dark; finbuddy_session=' + token + '; mode=demo'),
    token,
  );
  assert.equal(getSessionToken('finbuddy_session=invalid'), null);
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /SameSite=Lax/);
  assert.match(cookie, /Path=\//);
  assert.match(cookie, new RegExp('Max-Age=' + sessionMaxAgeSeconds));
  assert.equal(cookie.includes('Secure'), false);
  assert.match(secureCookie, /Secure/);
  assert.match(expiredCookie, /Max-Age=0/);
  assert.match(expiredCookie, /Expires=Thu, 01 Jan 1970/);
  assert.equal(isSecureRequest(new Request('https://example.test')), true);
  assert.equal(isSecureRequest(new Request('http://example.test')), false);
});

test('generates opaque tokens and hashes them deterministically', async () => {
  const firstToken = generateSessionToken();
  const secondToken = generateSessionToken();
  const firstHash = await hashSessionToken(firstToken);

  assert.match(firstToken, /^[a-f0-9]{64}$/);
  assert.notEqual(firstToken, secondToken);
  assert.match(firstHash, /^[a-f0-9]{64}$/);
  assert.notEqual(firstHash, firstToken);
  assert.equal(await hashSessionToken(firstToken), firstHash);
});
