"use client";

import { Card, CardContent, Stack, ToggleButton, ToggleButtonGroup, Typography, useTheme } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useTranslation } from "react-i18next";
import {
  formatCompactMoney,
  formatMoney,
  formatMonth,
} from "@/lib/client/format";
import type { MonthSummary } from "@/lib/client/finance-model";
import { useUiStore, type TrendRange } from "@/lib/client/ui-store";

interface TrendCardProps {
  months: MonthSummary[];
}

function rangeLength(range: TrendRange): number | null {
  switch (range) {
    case "six":
      return 6;
    case "twelve":
      return 12;
    case "all":
      return null;
  }
}

export function TrendCard({ months }: TrendCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const range = useUiStore((state) => state.trendRange);
  const setRange = useUiStore((state) => state.setTrendRange);
  const limit = rangeLength(range);
  const visible = limit === null ? months : months.slice(-limit);

  return (
    <Card>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
            mb: 2,
          }}
        >
          <div>
            <Typography variant="h3">{t("pulse.trendTitle")}</Typography>
            <Typography color="text.secondary" variant="body2">
              {t("pulse.trendDescription")}
            </Typography>
          </div>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={range}
            aria-label={t("pulse.rangeLabel")}
            onChange={(_, value: TrendRange | null) => {
              if (value !== null) {
                setRange(value);
              }
            }}
          >
            <ToggleButton value="six">{t("pulse.rangeSix")}</ToggleButton>
            <ToggleButton value="twelve">{t("pulse.rangeTwelve")}</ToggleButton>
            <ToggleButton value="all">{t("pulse.rangeAll")}</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
        <Stack role="img" aria-label={t("accessibility.trendChart")}>
          <LineChart
            height={280}
            xAxis={[
              {
                scaleType: "point",
                data: visible.map((month) =>
                  formatMonth(month.periodMonth, "short"),
                ),
              },
            ]}
            yAxis={[
              {
                valueFormatter: (value: number) => formatCompactMoney(value),
              },
            ]}
            series={[
              {
                data: visible.map((month) => month.expenseMinor),
                color: theme.palette.chart.mint,
                area: true,
                showMark: false,
                valueFormatter: (value: number | null) =>
                  value === null ? t("common.noData") : formatMoney(value),
              },
            ]}
            grid={{ horizontal: true }}
            margin={{ left: 10, right: 12, top: 16, bottom: 8 }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
