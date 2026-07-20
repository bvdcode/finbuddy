"use client";

import { Alert, Box, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { SharedDemoNotice } from "@/components/common/SharedDemoNotice";
import { ProfileIdentity } from "@/components/profile/ProfileIdentity";
import type { Profile } from "@/lib/domain/profile";
import { DesktopRail } from "./DesktopRail";
import { MobileNavigation } from "./MobileNavigation";

interface AppFrameProps {
  children: React.ReactNode;
  profile: Profile;
  signingOut: boolean;
  signOutError: boolean;
  onSignOut: () => void;
}

export function AppFrame({
  children,
  profile,
  signingOut,
  signOutError,
  onSignOut,
}: AppFrameProps) {
  const { t } = useTranslation();

  return (
    <Box sx={{ minHeight: "100%", bgcolor: "background.default" }}>
      <DesktopRail
        profile={profile}
        signingOut={signingOut}
        onSignOut={onSignOut}
      />
      <Box
        component="main"
        sx={{ ml: { xs: 0, md: "236px" }, pb: { xs: 11, md: 4 } }}
      >
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            display: { xs: "flex", md: "none" },
            px: 2,
            py: 2,
            gap: 1,
          }}
        >
          <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                width: 40,
                height: 40,
                borderRadius: 2.25,
                bgcolor: "secondary.main",
                color: "secondary.contrastText",
              }}
            >
              <Typography sx={{ fontWeight: 800 }}>
                {t("brand.monogram")}
              </Typography>
            </Box>
            <Typography sx={{ fontWeight: 750 }}>
              {t("brand.name")}
            </Typography>
          </Stack>
          <ProfileIdentity
            profile={profile}
            mode="mobile"
            signingOut={signingOut}
            onSignOut={onSignOut}
          />
        </Stack>

        <Stack
          sx={{
            width: "100%",
            maxWidth: 1480,
            mx: "auto",
            px: { xs: 2, sm: 3, lg: 5 },
            py: { xs: 1, md: 4 },
            gap: { xs: 2.5, md: 3 },
          }}
        >
          <SharedDemoNotice />
          {signOutError ? (
            <Alert severity="error">{t("profile.signOutError")}</Alert>
          ) : null}
          {children}
        </Stack>
      </Box>
      <MobileNavigation />
    </Box>
  );
}
