"use client";

import {
  CalendarMonthRounded,
  DescriptionRounded,
  PaymentsRounded,
  SavingsRounded,
  TrendingUpRounded,
  WarningAmberRounded,
} from "@mui/icons-material";
import { Alert, AlertTitle, Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { FinanceImportPreview } from "@/lib/import";

interface ImportPreviewProps {
  preview: FinanceImportPreview;
}

export function ImportPreview({ preview }: ImportPreviewProps) {
  const { t } = useTranslation();
  const periods = new Set(
    preview.payload.expenses.map((expense) => expense.periodMonth),
  );
  preview.payload.incomes.forEach((income) => periods.add(income.periodMonth));

  return (
    <Stack sx={{ gap: 2.5 }}>
      <Box>
        <Typography variant="h3">{t("importDialog.previewTitle")}</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          {t("importDialog.previewDescription")}
        </Typography>
      </Box>
      <Card sx={{ bgcolor: "surface.subtle" }}>
        <CardContent>
          <Stack direction="row" sx={{ alignItems: "center", gap: 1.5 }}>
            <DescriptionRounded color="primary" />
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" color="text.secondary">
                {t("importDialog.fileName")}
              </Typography>
              <Typography noWrap sx={{ fontWeight: 700 }}>
                {preview.payload.source.fileName}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
          gap: 1,
        }}
      >
        <PreviewStat
          icon={<PaymentsRounded />}
          label={t("importDialog.expenseCount")}
          value={t("importDialog.records", {
            count: preview.counts.expenses,
          })}
        />
        <PreviewStat
          icon={<TrendingUpRounded />}
          label={t("importDialog.incomeCount")}
          value={t("importDialog.records", {
            count: preview.counts.incomes,
          })}
        />
        <PreviewStat
          icon={<SavingsRounded />}
          label={t("importDialog.budgetCount")}
          value={t("importDialog.records", {
            count: preview.counts.budgetPlan,
          })}
        />
        <PreviewStat
          icon={<CalendarMonthRounded />}
          label={t("importDialog.monthCount")}
          value={t("imports.months", { count: periods.size })}
        />
      </Box>
      {preview.warnings.length > 0 ? (
        <Alert severity="warning" icon={<WarningAmberRounded />}>
          <AlertTitle>{t("importDialog.warningTitle")}</AlertTitle>
          {t("importDialog.warningSummary", {
            count: preview.warnings.length,
          })}
        </Alert>
      ) : null}
      <Alert severity="info">{t("importDialog.sharedReminder")}</Alert>
    </Stack>
  );
}

interface PreviewStatProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function PreviewStat({ icon, label, value }: PreviewStatProps) {
  return (
    <Stack
      sx={{
        gap: 0.75,
        p: 1.5,
        borderRadius: 2.5,
        bgcolor: "surface.subtle",
      }}
    >
      <Box color="primary.main">{icon}</Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 700 }}>{value}</Typography>
    </Stack>
  );
}
