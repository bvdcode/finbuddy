"use client";

import {
  CheckCircleRounded,
  DescriptionRounded,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { ViewHeader } from "@/components/common/ViewHeader";
import {
  formatImportDate,
  formatMonth,
} from "@/lib/client/format";
import type { ImportSummary } from "@/lib/client/finance-model";

interface ImportsViewProps {
  imports: ImportSummary[];
}

function periodText(summary: ImportSummary, t: TFunction): string {
  if (summary.firstPeriod === null || summary.lastPeriod === null) {
    return t("data.notSet");
  }
  if (summary.firstPeriod === summary.lastPeriod) {
    return formatMonth(summary.firstPeriod);
  }
  return t("imports.periodRange", {
    first: formatMonth(summary.firstPeriod, "short"),
    last: formatMonth(summary.lastPeriod, "short"),
  });
}

export function ImportsView({ imports }: ImportsViewProps) {
  const { t } = useTranslation();

  return (
    <>
      <ViewHeader
        eyebrow={t("imports.eyebrow")}
        title={t("imports.title")}
        description={t("imports.description")}
      />
      {imports.length === 0 ? (
        <Card>
          <CardContent sx={{ py: 7, textAlign: "center" }}>
            <DescriptionRounded
              color="disabled"
              sx={{ fontSize: 44, mb: 1 }}
            />
            <Typography color="text.secondary">
              {t("imports.empty")}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack sx={{ gap: 1.5 }}>
          {imports.map((summary) => (
            <Card key={summary.batch.id}>
              <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  sx={{
                    alignItems: { xs: "stretch", sm: "center" },
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      placeItems: "center",
                      width: 48,
                      height: 48,
                      borderRadius: 2.5,
                      bgcolor: "surface.tint",
                      color: "primary.main",
                    }}
                  >
                    <DescriptionRounded />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography noWrap sx={{ fontWeight: 700 }}>
                      {summary.batch.fileName}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      {t("imports.importedAt")}:{" "}
                      {formatImportDate(summary.batch.importedAt)}
                    </Typography>
                  </Box>
                  <Stack
                    direction="row"
                    sx={{ flexWrap: "wrap", alignItems: "center", gap: 1 }}
                  >
                    <Chip
                      size="small"
                      label={t("imports.months", {
                        count: summary.monthCount,
                      })}
                    />
                    <Chip
                      size="small"
                      label={t("imports.aggregates", {
                        count: summary.aggregateCount,
                      })}
                    />
                    <Chip
                      size="small"
                      color="success"
                      icon={<CheckCircleRounded />}
                      label={t("imports.success")}
                    />
                  </Stack>
                  <Box
                    sx={{ minWidth: { sm: 180 }, textAlign: { sm: "right" } }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {t("imports.period")}
                    </Typography>
                    <Typography sx={{ fontWeight: 650 }}>
                      {periodText(summary, t)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </>
  );
}
