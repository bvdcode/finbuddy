"use client";

import { useState } from "react";
import { CircularProgress, InputAdornment, TextField, Tooltip } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { DashboardData, MonthlyExpense } from "@/lib/domain/finance";
import { dashboardQueryKey, patchExpense } from "@/lib/client/api";
import {
  formatEditableMoney,
  parseEditableMoney,
} from "@/lib/client/format";

interface ExpenseCellProps {
  expense: MonthlyExpense;
  label: string;
}

type CellStatus = "ready" | "invalid" | "error";

export function ExpenseCell({ expense, label }: ExpenseCellProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [value, setValue] = useState(formatEditableMoney(expense.amountMinor));
  const [status, setStatus] = useState<CellStatus>("ready");
  const mutation = useMutation({
    mutationFn: (amountMinor: number) =>
      patchExpense(expense.id, amountMinor),
    onSuccess: (updated) => {
      queryClient.setQueryData<DashboardData>(
        dashboardQueryKey,
        (dashboard) => {
          if (!dashboard) {
            return dashboard;
          }
          return {
            ...dashboard,
            expenses: dashboard.expenses.map((item) => {
              if (item.id === updated.id) {
                return updated;
              }
              return item;
            }),
          };
        },
      );
      setValue(formatEditableMoney(updated.amountMinor));
      setStatus("ready");
    },
    onError: () => setStatus("error"),
  });

  function commit(): void {
    const amountMinor = parseEditableMoney(value);
    if (amountMinor === null) {
      setStatus("invalid");
      return;
    }
    if (amountMinor === expense.amountMinor) {
      setStatus("ready");
      return;
    }
    mutation.mutate(amountMinor);
  }

  let errorText = "";
  switch (status) {
    case "ready":
      break;
    case "invalid":
      errorText = t("data.invalidAmount");
      break;
    case "error":
      errorText = t("data.saveError");
      break;
  }

  return (
    <Tooltip title={errorText}>
      <TextField
        value={value}
        size="small"
        error={status !== "ready"}
        aria-label={label}
        onChange={(event) => {
          setValue(event.target.value);
          setStatus("ready");
        }}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }
        }}
        slotProps={{
          htmlInput: { inputMode: "decimal" },
          input: {
            endAdornment: mutation.isPending ? (
              <InputAdornment position="end">
                <CircularProgress size={16} />
              </InputAdornment>
            ) : null,
          },
        }}
        sx={{ minWidth: 126 }}
      />
    </Tooltip>
  );
}
