import { getD1 } from '@/db';
import { ApiErrorCode } from '@/lib/domain/api-errors';
import {
  type ExpensePatch,
  expenseIdSchema,
  expensePatchSchema,
} from '@/lib/domain/import-schema';
import { ExpenseRepository } from '@/lib/server/expense-repository';
import { errorResponse } from '@/lib/server/http';
import { requireProfile } from '@/lib/server/require-profile';

interface RouteContext {
  params: Promise<{ id: string }>;
}

async function parsePatch(request: Request): Promise<ExpensePatch | null> {
  try {
    const result = expensePatchSchema.safeParse(await request.json());
    if (!result.success) {
      return null;
    }

    return result.data;
  } catch {
    return null;
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext,
): Promise<Response> {
  try {
    const profile = await requireProfile(request);
    if (profile === null) {
      return errorResponse(ApiErrorCode.SessionRequired, 401);
    }

    const { id } = await context.params;
    const parsedId = expenseIdSchema.safeParse(id);
    if (!parsedId.success) {
      return errorResponse(ApiErrorCode.InvalidExpenseId, 400);
    }

    const patch = await parsePatch(request);
    if (patch === null) {
      return errorResponse(ApiErrorCode.InvalidExpenseUpdate, 400);
    }

    const repository = new ExpenseRepository(getD1());
    const expense = await repository.updateAmount(
      profile.id,
      parsedId.data,
      patch.amountMinor,
    );

    if (expense === null) {
      return errorResponse(ApiErrorCode.ExpenseNotFound, 404);
    }

    return Response.json({ expense });
  } catch {
    return errorResponse(ApiErrorCode.ExpenseUpdateFailed, 500);
  }
}
