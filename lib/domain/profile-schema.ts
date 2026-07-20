import { z } from 'zod';

const controlCharacter = /\p{Cc}/u;

const profileNamePart = z
  .string()
  .refine((value) => !controlCharacter.test(value))
  .transform((value) => value.trim())
  .pipe(z.string().min(1).max(80));

export const profileSessionInputSchema = z
  .object({
    firstName: profileNamePart,
    lastName: profileNamePart,
  })
  .strict();

export type ProfileSessionInput = z.infer<typeof profileSessionInputSchema>;

function normalizeNamePart(value: string): string {
  return value.normalize('NFKC').replace(/\s+/gu, ' ').trim().toLowerCase();
}

export function normalizeProfileName(
  firstName: string,
  lastName: string,
): string {
  return JSON.stringify([
    normalizeNamePart(firstName),
    normalizeNamePart(lastName),
  ]);
}
