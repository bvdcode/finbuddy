"use client";

import {
  ChevronLeftRounded,
  ChevronRightRounded,
} from "@mui/icons-material";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { formatMonth } from "@/lib/client/format";

interface MonthSelectorProps {
  periods: string[];
  value: string;
  onChange: (period: string) => void;
}

export function MonthSelector({
  periods,
  value,
  onChange,
}: MonthSelectorProps) {
  const { t } = useTranslation();
  const index = periods.indexOf(value);

  return (
    <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
      <IconButton
        aria-label={t("accessibility.previousMonth")}
        disabled={index <= 0}
        onClick={() => {
          const previous = periods[index - 1];
          if (previous) {
            onChange(previous);
          }
        }}
      >
        <ChevronLeftRounded />
      </IconButton>
      <FormControl size="small" sx={{ minWidth: 164 }}>
        <InputLabel id="month-selector-label">
          {t("header.monthLabel")}
        </InputLabel>
        <Select
          labelId="month-selector-label"
          value={value}
          label={t("header.monthLabel")}
          onChange={(event) => onChange(event.target.value)}
        >
          {periods.map((period) => (
            <MenuItem value={period} key={period}>
              {formatMonth(period)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <IconButton
        aria-label={t("accessibility.nextMonth")}
        disabled={index < 0 || index >= periods.length - 1}
        onClick={() => {
          const next = periods[index + 1];
          if (next) {
            onChange(next);
          }
        }}
      >
        <ChevronRightRounded />
      </IconButton>
    </Stack>
  );
}
