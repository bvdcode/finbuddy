"use client";

import { CheckRounded } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useUiStore } from "@/lib/client/ui-store";

interface ImportSuccessProps {
  monthCount: number;
  onClose: () => void;
}

export function ImportSuccess({
  monthCount,
  onClose,
}: ImportSuccessProps) {
  const { t } = useTranslation();
  const setActiveView = useUiStore((state) => state.setActiveView);

  function navigate(view: "pulse" | "imports"): void {
    setActiveView(view);
    onClose();
  }

  return (
    <Stack
      sx={{ alignItems: "center", textAlign: "center", gap: 2.5, py: 5 }}
    >
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          width: 76,
          height: 76,
          borderRadius: "50%",
          bgcolor: "surface.tint",
          color: "primary.main",
        }}
      >
        <CheckRounded sx={{ fontSize: 44 }} />
      </Box>
      <Box>
        <Typography variant="h2">{t("importDialog.successTitle")}</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {t("importDialog.successDescription", { count: monthCount })}
        </Typography>
      </Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{ gap: 1, width: "100%" }}
      >
        <Button
          fullWidth
          variant="contained"
          onClick={() => navigate("pulse")}
        >
          {t("importDialog.goToPulse")}
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => navigate("imports")}
        >
          {t("importDialog.goToImports")}
        </Button>
      </Stack>
    </Stack>
  );
}
