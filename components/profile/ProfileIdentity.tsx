"use client";

import { LogoutRounded } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import type { Profile } from "@/lib/domain/profile";

type ProfileIdentityMode = "rail" | "mobile";

interface ProfileIdentityProps {
  profile: Profile;
  mode: ProfileIdentityMode;
  signingOut: boolean;
  onSignOut: () => void;
}

function profileInitials(profile: Profile): string {
  const first = Array.from(profile.firstName.trim())[0] ?? "";
  const last = Array.from(profile.lastName.trim())[0] ?? "";
  return (first + last).toLocaleUpperCase("ru-RU");
}

export function ProfileIdentity({
  profile,
  mode,
  signingOut,
  onSignOut,
}: ProfileIdentityProps) {
  const { t } = useTranslation();
  const fullName = profile.firstName + " " + profile.lastName;

  switch (mode) {
    case "rail":
      return (
        <Stack
          sx={{
            p: 1.25,
            gap: 1.25,
            borderRadius: 2.5,
            bgcolor: "navigation.light",
          }}
        >
          <Stack direction="row" sx={{ alignItems: "center", gap: 1.25 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: "primary.light",
                color: "navigation.main",
                fontWeight: 750,
              }}
            >
              {profileInitials(profile)}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" sx={{ opacity: 0.58 }}>
                {t("profile.label")}
              </Typography>
              <Typography noWrap sx={{ fontWeight: 700 }}>
                {fullName}
              </Typography>
            </Box>
          </Stack>
          <Button
            color="inherit"
            onClick={onSignOut}
            disabled={signingOut}
            startIcon={
              signingOut ? (
                <CircularProgress color="inherit" size={16} />
              ) : (
                <LogoutRounded />
              )
            }
          >
            {signingOut ? t("profile.signingOut") : t("profile.signOut")}
          </Button>
        </Stack>
      );
    case "mobile":
      return (
        <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "surface.tint",
              color: "primary.main",
              fontSize: "0.8rem",
              fontWeight: 750,
            }}
          >
            {profileInitials(profile)}
          </Avatar>
          <Typography
            noWrap
            sx={{
              display: { xs: "none", sm: "block" },
              maxWidth: 160,
              fontWeight: 650,
            }}
          >
            {fullName}
          </Typography>
          <IconButton
            aria-label={t("profile.signOut")}
            onClick={onSignOut}
            disabled={signingOut}
          >
            {signingOut ? (
              <CircularProgress size={20} />
            ) : (
              <LogoutRounded />
            )}
          </IconButton>
        </Stack>
      );
  }
}
