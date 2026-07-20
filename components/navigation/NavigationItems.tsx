import type { ReactNode } from "react";
import {
  DataUsageRounded,
  GridViewRounded,
  HistoryRounded,
} from "@mui/icons-material";
import type { TFunction } from "i18next";
import type { AppView } from "@/lib/client/ui-store";

export const navigationViews: readonly AppView[] = [
  "pulse",
  "data",
  "imports",
];

export function navigationLabel(view: AppView, t: TFunction): string {
  switch (view) {
    case "pulse":
      return t("navigation.pulse");
    case "data":
      return t("navigation.data");
    case "imports":
      return t("navigation.imports");
  }
}

export function navigationIcon(view: AppView): ReactNode {
  switch (view) {
    case "pulse":
      return <DataUsageRounded />;
    case "data":
      return <GridViewRounded />;
    case "imports":
      return <HistoryRounded />;
  }
}
