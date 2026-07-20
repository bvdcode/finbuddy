"use client";

import { AutoAwesomeRounded } from "@mui/icons-material";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { formatMoney, formatMonth } from "@/lib/client/format";
import type { InsightFact } from "@/lib/client/insights";

interface InsightsCardProps {
  facts: InsightFact[];
}

function insightText(fact: InsightFact, t: TFunction): string {
  switch (fact.kind) {
    case "peak":
      return t("insights.peak", {
        month: formatMonth(fact.month.periodMonth),
        amount: formatMoney(fact.month.expenseMinor),
      });
    case "quiet":
      return t("insights.quiet", {
        month: formatMonth(fact.month.periodMonth),
        amount: formatMoney(fact.month.expenseMinor),
      });
    case "leadingCategory":
      return t("insights.leadingCategory", {
        month: formatMonth(fact.month.periodMonth),
        category: fact.category.categoryLabel,
        amount: formatMoney(fact.category.amountMinor),
      });
    case "rising":
      return t("insights.rising", { value: fact.percentage });
    case "falling":
      return t("insights.falling", { value: fact.percentage });
    case "steady":
      return t("insights.steady");
  }
}

export function InsightsCard({ facts }: InsightsCardProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
          <AutoAwesomeRounded color="primary" />
          <Typography variant="h3">{t("pulse.insightsTitle")}</Typography>
        </Stack>
        <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
          {t("pulse.insightsDescription")}
        </Typography>
        <Stack sx={{ gap: 1.25 }}>
          {facts.map((fact, index) => (
            <Stack
              direction="row"
              key={fact.kind + index}
              sx={{
                gap: 1.25,
                alignItems: "flex-start",
                p: 1.5,
                borderRadius: 2.5,
                bgcolor: "surface.subtle",
              }}
            >
              <Typography color="primary.main" sx={{ fontWeight: 800 }}>
                {index + 1}
              </Typography>
              <Typography variant="body2">{insightText(fact, t)}</Typography>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
