"use client";

import { useRef } from "react";
import { CloudUploadRounded } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

interface ImportDropzoneProps {
  onFile: (file: File) => void;
  error: string;
}

export function ImportDropzone({ onFile, error }: ImportDropzoneProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  function openPicker(): void {
    inputRef.current?.click();
  }

  return (
    <Stack sx={{ gap: 2 }}>
      <Box
        role="button"
        tabIndex={0}
        aria-label={t("importDialog.dropLabel")}
        onClick={openPicker}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openPicker();
          }
        }}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const file = event.dataTransfer.files.item(0);
          if (file) {
            onFile(file);
          }
        }}
        sx={{
          border: 1,
          borderStyle: "dashed",
          borderColor: error ? "error.main" : "divider",
          borderRadius: 3,
          bgcolor: "surface.subtle",
          cursor: "pointer",
          px: 3,
          py: { xs: 5, sm: 7 },
          textAlign: "center",
          outline: "none",
          "&:focus-visible": {
            borderColor: "primary.main",
            boxShadow: 3,
          },
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={(event) => {
            const file = event.target.files?.item(0);
            if (file) {
              onFile(file);
            }
            event.target.value = "";
          }}
          hidden
        />
        <CloudUploadRounded color="primary" sx={{ fontSize: 52, mb: 1 }} />
        <Typography variant="h3">{t("importDialog.dropTitle")}</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
          {t("importDialog.dropDescription")}
        </Typography>
        <Button variant="outlined" component="span">
          {t("importDialog.chooseFile")}
        </Button>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 2 }}
        >
          {t("importDialog.fileRequirements")}
        </Typography>
      </Box>
      {error ? (
        <Typography color="error.main" role="alert">
          {error}
        </Typography>
      ) : null}
    </Stack>
  );
}
