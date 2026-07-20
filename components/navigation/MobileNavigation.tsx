"use client";

import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useUiStore } from "@/lib/client/ui-store";
import {
  navigationIcon,
  navigationLabel,
  navigationViews,
} from "./NavigationItems";

export function MobileNavigation() {
  const { t } = useTranslation();
  const activeView = useUiStore((state) => state.activeView);
  const setActiveView = useUiStore((state) => state.setActiveView);

  return (
    <Paper
      component="nav"
      aria-label={t("navigation.label")}
      elevation={8}
      sx={{
        display: { xs: "block", md: "none" },
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: "appBar",
        borderRadius: 0,
      }}
    >
      <BottomNavigation
        value={activeView}
        onChange={(_, view: string) => {
          if (view === "pulse" || view === "data" || view === "imports") {
            setActiveView(view);
          }
        }}
        showLabels
      >
        {navigationViews.map((view) => (
          <BottomNavigationAction
            key={view}
            value={view}
            label={navigationLabel(view, t)}
            icon={navigationIcon(view)}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
