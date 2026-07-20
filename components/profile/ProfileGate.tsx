"use client";

import { useState } from "react";
import {
  AccountCircleRounded,
  LockOpenRounded,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { Profile } from "@/lib/domain/profile";
import { createSession } from "@/lib/client/api";

interface ProfileGateProps {
  onAuthenticated: (profile: Profile) => void;
}

export function ProfileGate({ onAuthenticated }: ProfileGateProps) {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [validationError, setValidationError] = useState("");
  const mutation = useMutation({
    mutationFn: createSession,
    onSuccess: onAuthenticated,
  });

  let buttonLabel = t("profile.submit");
  let buttonIcon: React.ReactNode = <AccountCircleRounded />;
  if (mutation.isPending) {
    buttonLabel = t("profile.submitting");
    buttonIcon = <CircularProgress color="inherit" size={18} />;
  }

  function submit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    if (trimmedFirstName.length === 0 || trimmedLastName.length === 0) {
      setValidationError(t("profile.required"));
      return;
    }

    setValidationError("");
    mutation.mutate({
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
    });
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100%",
        display: "grid",
        placeItems: "center",
        bgcolor: "background.default",
        px: { xs: 2, sm: 3 },
        py: 4,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 980, overflow: "hidden" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "0.9fr 1.1fr" },
          }}
        >
          <Stack
            sx={{
              bgcolor: "secondary.main",
              color: "secondary.contrastText",
              p: { xs: 3, sm: 5 },
              gap: 4,
              justifyContent: "space-between",
            }}
          >
            <Stack direction="row" sx={{ alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 2.5,
                  bgcolor: "primary.light",
                  color: "secondary.main",
                }}
              >
                <Typography sx={{ fontWeight: 800 }}>
                  {t("brand.monogram")}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 750 }}>
                  {t("brand.name")}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.68 }}>
                  {t("brand.product")}
                </Typography>
              </Box>
            </Stack>
            <Box>
              <Typography variant="overline" sx={{ opacity: 0.65 }}>
                {t("profile.eyebrow")}
              </Typography>
              <Typography variant="h2" component="h1" sx={{ mt: 0.75 }}>
                {t("profile.title")}
              </Typography>
              <Typography sx={{ mt: 1.5, opacity: 0.7 }}>
                {t("profile.description")}
              </Typography>
            </Box>
          </Stack>

          <CardContent
            component="form"
            onSubmit={submit}
            sx={{
              p: { xs: 3, sm: 5 },
              "&:last-child": { pb: { xs: 3, sm: 5 } },
            }}
          >
            <Stack sx={{ gap: 2.5 }}>
              <Alert icon={<LockOpenRounded />} severity="info">
                <Typography sx={{ fontWeight: 700 }}>
                  {t("profile.noPasswordTitle")}
                </Typography>
                {t("profile.noPasswordDescription")}
              </Alert>
              <TextField
                autoFocus
                required
                fullWidth
                label={t("profile.firstName")}
                autoComplete="given-name"
                value={firstName}
                disabled={mutation.isPending}
                onChange={(event) => {
                  setFirstName(event.target.value);
                  setValidationError("");
                }}
              />
              <TextField
                required
                fullWidth
                label={t("profile.lastName")}
                autoComplete="family-name"
                value={lastName}
                disabled={mutation.isPending}
                onChange={(event) => {
                  setLastName(event.target.value);
                  setValidationError("");
                }}
              />
              {validationError ? (
                <Alert severity="warning">{validationError}</Alert>
              ) : null}
              {mutation.isError ? (
                <Alert severity="error">{t("profile.createError")}</Alert>
              ) : null}
              <Button
                type="submit"
                size="large"
                variant="contained"
                disabled={mutation.isPending}
                startIcon={buttonIcon}
              >
                {buttonLabel}
              </Button>
            </Stack>
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
}
