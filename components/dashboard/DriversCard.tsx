"use client";

import {
  RemoveRounded,
  SouthEastRounded,
  NorthEastRounded,
} from "@mui/icons-material";
import { Box, Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { formatMoney } from "@/lib/client/format";
import type { ChangeDriver, DriverDirection } from "@/lib/client/finance-model";

interface DriversCardProps {
  drivers: ChangeDriver[];
}

function DirectionIcon({ direction }: { direction: DriverDirection }) {
  switch (direction) {
    case "up":
      return <NorthEastRounded color="error" />;
    case "down":
      return <SouthEastRounded color="success" />;
    case "same":
      return <RemoveRounded color="disabled" />;
  }
}

function directionText(driver: ChangeDriver, t: TFunction): string {
  switch (driver.direction) {
    case "up":
      return t("pulse.driverUp", {
        amount: formatMoney(Math.abs(driver.changeMinor)),
      });
    case "down":
      return t("pulse.driverDown", {
        amount: formatMoney(Math.abs(driver.changeMinor)),
      });
    case "same":
      return t("pulse.driverSame");
  }
}

export function DriversCard({ drivers }: DriversCardProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h3">{t("pulse.driversTitle")}</Typography>
        <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
          {t("pulse.driversDescription")}
        </Typography>
        {drivers.length === 0 ? (
          <Typography color="text.secondary">
            {t("pulse.noComparison")}
          </Typography>
        ) : (
          <Stack divider={<Divider flexItem />}>
            {drivers.map((driver) => (
              <Stack
                direction="row"
                key={driver.categoryKey}
                sx={{ alignItems: "center", gap: 1.5, py: 1.5 }}
              >
                <DirectionIcon direction={driver.direction} />
                <Typography sx={{ flex: 1, fontWeight: 600 }}>
                  {driver.categoryLabel}
                </Typography>
                <Box sx={{ textAlign: "right" }}>
                  <Typography sx={{ fontWeight: 750 }}>
                    {directionText(driver, t)}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
