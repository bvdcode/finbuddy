"use client";

import { InsertChartOutlinedRounded } from "@mui/icons-material";
import { Box, Button, Card, CardContent, CircularProgress, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useUiStore } from "@/lib/client/ui-store";

interface CenteredStateProps {
  kind: "loading" | "empty" | "error";
  message: string;
  onRetry?: () => void;
}

export function CenteredState({
  kind,
  message,
  onRetry,
}: CenteredStateProps) {
  const { t } = useTranslation();
  const openImport = useUiStore((state) => state.openImport);

  let visual: React.ReactNode = <InsertChartOutlinedRounded />;
  switch (kind) {
    case "loading":
      visual = <CircularProgress />;
      break;
    case "empty":
    case "error":
      visual = <InsertChartOutlinedRounded sx={{ fontSize: 48 }} />;
      break;
  }

  return (
    <Card>
      <CardContent>
        <Stack sx={{ alignItems: "center", textAlign: "center", gap: 2, py: 6 }}>
          <Box color="primary.main">{visual}</Box>
          <Typography color="text.secondary" sx={{ maxWidth: 520 }}>
            {message}
          </Typography>
          {kind === "empty" ? (
            <Button variant="contained" onClick={openImport}>
              {t("common.importExcel")}
            </Button>
          ) : null}
          {kind === "error" && onRetry ? (
            <Button variant="outlined" onClick={onRetry}>
              {t("common.retry")}
            </Button>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
