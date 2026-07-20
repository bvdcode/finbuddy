"use client";

import { Box, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { MonthSelector } from "@/components/common/MonthSelector";
import { ViewHeader } from "@/components/common/ViewHeader";
import {
  buildChangeDrivers,
  type MonthSummary,
} from "@/lib/client/finance-model";
import { buildInsights } from "@/lib/client/insights";
import { useUiStore } from "@/lib/client/ui-store";
import { CategoryCard } from "./CategoryCard";
import { DriversCard } from "./DriversCard";
import { InsightsCard } from "./InsightsCard";
import { PulseHero } from "./PulseHero";
import { TrendCard } from "./TrendCard";

interface PulseViewProps {
  months: MonthSummary[];
  selected: MonthSummary;
}

export function PulseView({ months, selected }: PulseViewProps) {
  const { t } = useTranslation();
  const setSelectedPeriod = useUiStore((state) => state.setSelectedPeriod);
  const selectedIndex = months.findIndex(
    (month) => month.periodMonth === selected.periodMonth,
  );
  const previous = selectedIndex > 0 ? months[selectedIndex - 1] : null;
  const drivers = buildChangeDrivers(selected, previous);
  const facts = buildInsights(months, selected);

  return (
    <Stack sx={{ gap: { xs: 2, md: 3 } }}>
      <ViewHeader eyebrow={t("header.eyebrow")} title={t("header.title")}>
        <MonthSelector
          periods={months.map((month) => month.periodMonth)}
          value={selected.periodMonth}
          onChange={setSelectedPeriod}
        />
      </ViewHeader>
      <PulseHero month={selected} previous={previous} />
      <TrendCard months={months} />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(0, 1.15fr) minmax(0, 0.85fr)",
          },
          gap: { xs: 2, md: 3 },
        }}
      >
        <CategoryCard month={selected} />
        <DriversCard drivers={drivers} />
      </Box>
      <InsightsCard facts={facts} />
    </Stack>
  );
}
