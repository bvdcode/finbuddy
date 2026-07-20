"use client";

import {
  AccountBalanceWalletRounded,
  PaymentsRounded,
  TrendingDownRounded,
  TrendingFlatRounded,
  TrendingUpRounded,
} from "@mui/icons-material";
import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { formatMoney, formatMonth } from "@/lib/client/format";
import type { MonthSummary } from "@/lib/client/finance-model";

interface PulseHeroProps {
  month: MonthSummary;
  previous: MonthSummary | null;
}

function changeValue(current: number, previous: number): number {
  if (previous === 0) {
    return 0;
  }
  return Math.round(((current - previous) / previous) * 100);
}

export function PulseHero({ month, previous }: PulseHeroProps) {
  const { t } = useTranslation();
  const change = previous
    ? changeValue(month.expenseMinor, previous.expenseMinor)
    : 0;
  const balance = month.incomeMinor - month.expenseMinor;
  const spendShare =
    month.incomeMinor > 0
      ? Math.round((month.expenseMinor / month.incomeMinor) * 100)
      : 0;

  let changeText = t("common.zeroChange");
  let changeIcon = <TrendingFlatRounded />;
  if (change > 0) {
    changeText = t("common.positiveChange", { value: change });
    changeIcon = <TrendingUpRounded />;
  } else if (change < 0) {
    changeText = t("common.negativeChange", { value: change });
    changeIcon = <TrendingDownRounded />;
  }

  return (
    <Card
      sx={{
        bgcolor: "secondary.main",
        color: "secondary.contrastText",
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 4 }, "&:last-child": { pb: 4 } }}>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          sx={{ justifyContent: "space-between", gap: 4 }}
        >
          <Box>
            <Typography sx={{ opacity: 0.68 }}>
              {t("pulse.spendLabel", {
                month: formatMonth(month.periodMonth),
              })}
            </Typography>
            <Typography
              component="p"
              sx={{
                mt: 1,
                fontSize: { xs: "2.7rem", sm: "4.25rem", lg: "5.5rem" },
                fontWeight: 650,
                letterSpacing: "-0.065em",
                lineHeight: 0.98,
              }}
            >
              {formatMoney(month.expenseMinor)}
            </Typography>
            <Stack
              direction="row"
              sx={{ alignItems: "center", gap: 1, mt: 2 }}
            >
              <Chip
                icon={changeIcon}
                label={changeText}
                sx={{
                  bgcolor: "primary.light",
                  color: "secondary.main",
                  "& .MuiChip-icon": { color: "secondary.main" },
                }}
              />
              <Typography variant="body2" sx={{ opacity: 0.66 }}>
                {previous
                  ? t("pulse.versusPrevious")
                  : t("pulse.noComparison")}
              </Typography>
            </Stack>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row", lg: "column" }}
            sx={{ minWidth: { lg: 260 }, gap: 1.5 }}
          >
            <HeroStat
              icon={<PaymentsRounded />}
              label={t("pulse.income")}
              value={formatMoney(month.incomeMinor)}
            />
            <HeroStat
              icon={<AccountBalanceWalletRounded />}
              label={t("pulse.balance")}
              value={formatMoney(balance)}
            />
            <HeroStat
              icon={<TrendingDownRounded />}
              label={t("pulse.spendShare")}
              value={t("pulse.spendShareValue", { value: spendShare })}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

interface HeroStatProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function HeroStat({ icon, label, value }: HeroStatProps) {
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: "center",
        gap: 1.5,
        flex: 1,
        p: 1.5,
        borderRadius: 2.5,
        bgcolor: "navigation.light",
      }}
    >
      {icon}
      <Box>
        <Typography variant="caption" sx={{ opacity: 0.62 }}>
          {label}
        </Typography>
        <Typography sx={{ fontWeight: 700 }}>{value}</Typography>
      </Box>
    </Stack>
  );
}
