export const ApiErrorCode = {
  DashboardReadFailed: 'DASHBOARD_READ_FAILED',
  ExpenseNotFound: 'EXPENSE_NOT_FOUND',
  ExpenseUpdateFailed: 'EXPENSE_UPDATE_FAILED',
  ImportFailed: 'IMPORT_FAILED',
  InvalidProfile: 'INVALID_PROFILE',
  InvalidExpenseId: 'INVALID_EXPENSE_ID',
  InvalidExpenseUpdate: 'INVALID_EXPENSE_UPDATE',
  InvalidImport: 'INVALID_IMPORT',
  SessionCreateFailed: 'SESSION_CREATE_FAILED',
  SessionDeleteFailed: 'SESSION_DELETE_FAILED',
  SessionReadFailed: 'SESSION_READ_FAILED',
  SessionRequired: 'SESSION_REQUIRED',
} as const;

export type ApiErrorCode = (typeof ApiErrorCode)[keyof typeof ApiErrorCode];

export interface ApiErrorResponse {
  error: {
    code: ApiErrorCode;
  };
}
