"use client";

import { useState } from "react";
import { CloseRounded } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { FinanceImportPreview } from "@/lib/import";
import {
  createImport,
  dashboardQueryKey,
} from "@/lib/client/api";
import { parseImportFile } from "@/lib/client/import-adapter";
import { useUiStore } from "@/lib/client/ui-store";
import { ImportDropzone } from "./ImportDropzone";
import { ImportPreview } from "./ImportPreview";
import { ImportSuccess } from "./ImportSuccess";

type ImportStage =
  | "file"
  | "parsing"
  | "parseError"
  | "preview"
  | "submitting"
  | "submitError"
  | "success";

const maxFileSizeBytes = 10 * 1024 * 1024;

function stepNumber(stage: ImportStage): number {
  switch (stage) {
    case "file":
    case "parsing":
    case "parseError":
      return 0;
    case "preview":
    case "submitting":
    case "submitError":
      return 1;
    case "success":
      return 2;
  }
}

function countMonths(preview: FinanceImportPreview): number {
  const periods = new Set(
    preview.payload.expenses.map((expense) => expense.periodMonth),
  );
  preview.payload.incomes.forEach((income) => periods.add(income.periodMonth));
  return periods.size;
}

export function ImportDialog() {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const queryClient = useQueryClient();
  const open = useUiStore((state) => state.importOpen);
  const closeImport = useUiStore((state) => state.closeImport);
  const [stage, setStage] = useState<ImportStage>("file");
  const [preview, setPreview] = useState<FinanceImportPreview | null>(null);
  const [fileError, setFileError] = useState("");
  const [importedMonths, setImportedMonths] = useState(0);
  const mutation = useMutation({
    mutationFn: createImport,
    onSuccess: () => {
      if (preview) {
        setImportedMonths(countMonths(preview));
      }
      void queryClient.invalidateQueries({ queryKey: dashboardQueryKey });
      setStage("success");
    },
    onError: () => setStage("submitError"),
  });

  function reset(): void {
    setStage("file");
    setPreview(null);
    setFileError("");
    setImportedMonths(0);
    mutation.reset();
  }

  function close(): void {
    if (stage === "submitting") {
      return;
    }
    closeImport();
    reset();
  }

  async function selectFile(file: File): Promise<void> {
    const name = file.name.trim().toLowerCase();
    if (!name.endsWith(".xlsx") && !name.endsWith(".xls")) {
      setFileError(t("importDialog.invalidType"));
      setStage("file");
      return;
    }
    if (file.size > maxFileSizeBytes) {
      setFileError(t("importDialog.tooLarge"));
      setStage("file");
      return;
    }

    setFileError("");
    setStage("parsing");
    try {
      const parsed = await parseImportFile(file);
      setPreview(parsed);
      setStage("preview");
    } catch {
      setStage("parseError");
    }
  }

  let content: React.ReactNode;
  switch (stage) {
    case "file":
      content = <ImportDropzone onFile={selectFile} error={fileError} />;
      break;
    case "parsing":
      content = (
        <Stack
          sx={{ alignItems: "center", justifyContent: "center", gap: 2, py: 8 }}
        >
          <CircularProgress />
          <Typography>{t("importDialog.parsing")}</Typography>
        </Stack>
      );
      break;
    case "parseError":
      content = (
        <Stack sx={{ gap: 2 }}>
          <Alert severity="error">
            <Typography sx={{ fontWeight: 700 }}>
              {t("importDialog.parseErrorTitle")}
            </Typography>
            {t("importDialog.parseErrorDescription")}
          </Alert>
          <ImportDropzone onFile={selectFile} error="" />
        </Stack>
      );
      break;
    case "preview":
    case "submitting":
      content = preview ? <ImportPreview preview={preview} /> : null;
      break;
    case "submitError":
      content = (
        <Stack sx={{ gap: 2 }}>
          <Alert severity="error">{t("importDialog.importError")}</Alert>
          {preview ? <ImportPreview preview={preview} /> : null}
        </Stack>
      );
      break;
    case "success":
      content = (
        <ImportSuccess monthCount={importedMonths} onClose={close} />
      );
      break;
  }

  const canSubmit =
    stage === "preview" || stage === "submitError";
  const showPreviewActions = canSubmit || stage === "submitting";
  let submitIcon: React.ReactNode = null;
  let submitLabel = t("importDialog.confirm");
  switch (stage) {
    case "submitting":
      submitIcon = <CircularProgress color="inherit" size={18} />;
      submitLabel = t("importDialog.importing");
      break;
    case "file":
    case "parsing":
    case "parseError":
    case "preview":
    case "submitError":
    case "success":
      break;
  }

  return (
    <Dialog
      open={open}
      onClose={close}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Typography variant="h3" component="span">
            {t("importDialog.title")}
          </Typography>
          <IconButton
            aria-label={t("common.close")}
            onClick={close}
            disabled={stage === "submitting"}
          >
            <CloseRounded />
          </IconButton>
        </Stack>
      </DialogTitle>
      <Box sx={{ px: { xs: 2, sm: 3 } }}>
        <Stepper activeStep={stepNumber(stage)}>
          <Step><StepLabel>{t("importDialog.stepFile")}</StepLabel></Step>
          <Step><StepLabel>{t("importDialog.stepPreview")}</StepLabel></Step>
          <Step><StepLabel>{t("importDialog.stepDone")}</StepLabel></Step>
        </Stepper>
      </Box>
      <DialogContent sx={{ pt: 3, minHeight: 300 }}>{content}</DialogContent>
      {showPreviewActions ? (
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={reset}
            disabled={stage === "submitting"}
          >
            {t("common.back")}
          </Button>
          <Button
            variant="contained"
            disabled={stage === "submitting" || preview === null}
            startIcon={submitIcon}
            onClick={() => {
              if (preview) {
                setStage("submitting");
                mutation.mutate(preview.payload);
              }
            }}
          >
            {submitLabel}
          </Button>
        </DialogActions>
      ) : null}
    </Dialog>
  );
}
