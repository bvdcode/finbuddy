import { getD1 } from '@/db';
import { ApiErrorCode } from '@/lib/domain/api-errors';
import { DashboardRepository } from '@/lib/server/dashboard-repository';
import { errorResponse } from '@/lib/server/http';
import { requireProfile } from '@/lib/server/require-profile';

export async function GET(request: Request): Promise<Response> {
  try {
    const profile = await requireProfile(request);
    if (profile === null) {
      return errorResponse(ApiErrorCode.SessionRequired, 401);
    }

    const repository = new DashboardRepository(getD1());
    const dashboard = await repository.getDashboard(profile.id);
    return Response.json(dashboard);
  } catch {
    return errorResponse(ApiErrorCode.DashboardReadFailed, 500);
  }
}
