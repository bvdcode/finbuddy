"use client";

import { Box, Card, CardContent, LinearProgress, Stack, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { formatMoney } from "@/lib/client/format";
import type { MonthSummary } from "@/lib/client/finance-model";

interface CategoryCardProps {
  month: MonthSummary;
}

export function CategoryCard({ month }: CategoryCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const colors = [
    theme.palette.chart.mint,
    theme.palette.chart.blue,
    theme.palette.chart.amber,
    theme.palette.chart.coral,
    theme.palette.chart.violet,
    theme.palette.chart.slate,
  ];

  return (
    <Card>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h3">{t("pulse.categoriesTitle")}</Typography>
        <Typography color="text.secondary" variant="body2" sx={{ mb: 2.5 }}>
          {t("pulse.categoriesDescription")}
        </Typography>
        <Stack
          role="img"
          aria-label={t("accessibility.categoryChart")}
          sx={{ gap: 2 }}
        >
          {month.categories.slice(0, 6).map((category, index) => {
            const share =
              month.expenseMinor > 0
                ? Math.round((category.amountMinor / month.expenseMinor) * 100)
                : 0;
            const color = colors[index % colors.length];
            return (
              <Stack key={category.categoryKey} sx={{ gap: 0.75 }}>
                <Stack
                  direction="row"
                  sx={{ justifyContent: "space-between", gap: 2 }}
                >
                  <Typography variant="body2" noWrap sx={{ fontWeight: 650 }}>
                    {category.categoryLabel}
                  </Typography>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="body2" noWrap sx={{ fontWeight: 700 }}>
                      {formatMoney(category.amountMinor)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t("pulse.categoryShare", { value: share })}
                    </Typography>
                  </Box>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={share}
                  sx={{
                    height: 7,
                    borderRadius: 8,
                    bgcolor: "surface.subtle",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: color,
                      borderRadius: 8,
                    },
                  }}
                />
              </Stack>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}
