"use client";

import { FileUploadRounded } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useUiStore } from "@/lib/client/ui-store";

interface ViewHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function ViewHeader({
  eyebrow,
  title,
  description,
  children,
}: ViewHeaderProps) {
  const { t } = useTranslation();
  const openImport = useUiStore((state) => state.openImport);

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      sx={{
        alignItems: { xs: "stretch", sm: "flex-end" },
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="overline" color="primary.main">
          {eyebrow}
        </Typography>
        <Typography variant="h2" component="h1">
          {title}
        </Typography>
        {description ? (
          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            {description}
          </Typography>
        ) : null}
      </Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{ alignItems: "stretch", gap: 1 }}
      >
        {children}
        <Button
          variant="contained"
          startIcon={<FileUploadRounded />}
          onClick={openImport}
          aria-label={t("accessibility.openImport")}
        >
          {t("common.importExcel")}
        </Button>
      </Stack>
    </Stack>
  );
}
