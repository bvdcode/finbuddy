"use client";

import {
  ErrorOutlineRounded,
  PersonSearchRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface ProfileGateStatusProps {
  kind: "loading" | "error";
  onRetry?: () => void;
}

export function ProfileGateStatus({
  kind,
  onRetry,
}: ProfileGateStatusProps) {
  const { t } = useTranslation();
  let visual: React.ReactNode;
  let message: string;

  switch (kind) {
    case "loading":
      visual = <CircularProgress />;
      message = t("profile.loading");
      break;
    case "error":
      visual = <ErrorOutlineRounded sx={{ fontSize: 48 }} />;
      message = t("profile.sessionError");
      break;
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100%",
        display: "grid",
        placeItems: "center",
        bgcolor: "background.default",
        p: 3,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 520 }}>
        <CardContent>
          <Stack
            sx={{
              py: 5,
              alignItems: "center",
              textAlign: "center",
              gap: 2,
            }}
          >
            <Box color="primary.main">{visual}</Box>
            <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
              <PersonSearchRounded color="primary" />
              <Typography variant="h3">{t("brand.name")}</Typography>
            </Stack>
            <Typography color="text.secondary">{message}</Typography>
            {kind === "error" && onRetry ? (
              <Button variant="outlined" onClick={onRetry}>
                {t("common.retry")}
              </Button>
            ) : null}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
