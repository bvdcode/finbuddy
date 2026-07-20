"use client";

import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { ProfileIdentity } from "@/components/profile/ProfileIdentity";
import type { Profile } from "@/lib/domain/profile";
import { useUiStore } from "@/lib/client/ui-store";
import {
  navigationIcon,
  navigationLabel,
  navigationViews,
} from "./NavigationItems";

interface DesktopRailProps {
  profile: Profile;
  signingOut: boolean;
  onSignOut: () => void;
}

export function DesktopRail({
  profile,
  signingOut,
  onSignOut,
}: DesktopRailProps) {
  const { t } = useTranslation();
  const activeView = useUiStore((state) => state.activeView);
  const setActiveView = useUiStore((state) => state.setActiveView);

  return (
    <Box
      component="aside"
      sx={{
        position: "fixed",
        inset: 0,
        right: "auto",
        width: 236,
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        bgcolor: "navigation.main",
        color: "navigation.contrastText",
        px: 2,
        py: 3,
        zIndex: "drawer",
      }}
    >
      <Stack
        direction="row"
        sx={{ alignItems: "center", gap: 1.5, px: 1.25, mb: 5 }}
      >
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            width: 44,
            height: 44,
            borderRadius: 2.5,
            bgcolor: "primary.light",
            color: "navigation.main",
          }}
        >
          <Typography sx={{ fontWeight: 800 }}>
            {t("brand.monogram")}
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 750, lineHeight: 1.1 }}>
            {t("brand.name")}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.68 }}>
            {t("brand.product")}
          </Typography>
        </Box>
      </Stack>

      <Box component="nav" aria-label={t("navigation.label")}>
        <List disablePadding>
          {navigationViews.map((view) => (
            <ListItemButton
              key={view}
              selected={view === activeView}
              onClick={() => setActiveView(view)}
              sx={{
                minHeight: 48,
                mb: 0.75,
                borderRadius: 2.5,
                color: "inherit",
                "&.Mui-selected": {
                  bgcolor: "navigation.light",
                },
                "&.Mui-selected:hover": {
                  bgcolor: "navigation.light",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                {navigationIcon(view)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ fontWeight: 650 }}>
                    {navigationLabel(view, t)}
                  </Typography>
                }
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Box sx={{ mt: "auto" }}>
        <ProfileIdentity
          profile={profile}
          mode="rail"
          signingOut={signingOut}
          onSignOut={onSignOut}
        />
      </Box>
    </Box>
  );
}
