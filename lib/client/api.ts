import type {
  DashboardData,
  ImportResult,
  MonthlyExpense,
} from "@/lib/domain/finance";
import type { Profile, ProfileSessionResponse } from "@/lib/domain/profile";
import type { ProfileSessionInput } from "@/lib/domain/profile-schema";
import type { FinanceImportPayload } from "@/lib/import";

export const dashboardQueryKey = ["dashboard"] as const;
export const sessionQueryKey = ["session"] as const;

export class ClientApiError extends Error {
  constructor(readonly status: number) {
    super("API request failed with status " + status);
    this.name = "ClientApiError";
  }
}

export function isUnauthorizedApiError(error: Error): boolean {
  return error instanceof ClientApiError && error.status === 401;
}

async function requireSuccess(response: Response): Promise<Response> {
  if (!response.ok) {
    throw new ClientApiError(response.status);
  }
  return response;
}

export async function getDashboard(): Promise<DashboardData> {
  const response = await requireSuccess(await fetch("/api/dashboard"));
  return response.json() as Promise<DashboardData>;
}

export async function getSession(): Promise<Profile | null> {
  const response = await fetch("/api/session");
  if (response.status === 401) {
    return null;
  }
  await requireSuccess(response);
  const result = (await response.json()) as ProfileSessionResponse;
  return result.profile;
}

export async function createSession(input: ProfileSessionInput): Promise<Profile> {
  const response = await requireSuccess(
    await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
      }),
    }),
  );
  const result = (await response.json()) as ProfileSessionResponse;
  return result.profile;
}

export async function deleteSession(): Promise<void> {
  await requireSuccess(
    await fetch("/api/session", {
      method: "DELETE",
    }),
  );
}

export async function createImport(
  payload: FinanceImportPayload,
): Promise<ImportResult> {
  const response = await requireSuccess(
    await fetch("/api/imports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
  return response.json() as Promise<ImportResult>;
}

interface ExpensePatchResponse {
  expense: MonthlyExpense;
}

export async function patchExpense(
  id: number,
  amountMinor: number,
): Promise<MonthlyExpense> {
  const response = await requireSuccess(
    await fetch("/api/monthly-expenses/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amountMinor }),
    }),
  );
  const result = (await response.json()) as ExpensePatchResponse;
  return result.expense;
}
