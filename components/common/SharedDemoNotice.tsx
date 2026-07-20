"use client";

import { PublicRounded } from "@mui/icons-material";
import { Alert, AlertTitle } from "@mui/material";
import { useTranslation } from "react-i18next";

export function SharedDemoNotice() {
  const { t } = useTranslation();

  return (
    <Alert
      icon={<PublicRounded />}
      severity="info"
      sx={{
        bgcolor: "surface.tint",
        color: "text.primary",
        border: 1,
        borderColor: "divider",
        alignItems: "center",
        "& .MuiAlert-icon": { color: "primary.main" },
      }}
    >
      <AlertTitle sx={{ mb: 0.25, fontWeight: 700 }}>
        {t("sharedDemo.title")}
      </AlertTitle>
      {t("sharedDemo.description")}
    </Alert>
  );
}
