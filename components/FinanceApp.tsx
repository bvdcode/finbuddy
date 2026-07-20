"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { CenteredState } from "@/components/common/CenteredState";
import { ViewHeader } from "@/components/common/ViewHeader";
import { DataView } from "@/components/data/DataView";
import { PulseView } from "@/components/dashboard/PulseView";
import { ImportDialog } from "@/components/imports/ImportDialog";
import { ImportsView } from "@/components/imports/ImportsView";
import { AppFrame } from "@/components/navigation/AppFrame";
import { ProfileGate } from "@/components/profile/ProfileGate";
import { ProfileGateStatus } from "@/components/profile/ProfileGateStatus";
import {
  dashboardQueryKey,
  deleteSession,
  getDashboard,
  getSession,
  sessionQueryKey,
} from "@/lib/client/api";
import {
  buildImportSummaries,
  buildMonthSummaries,
  resolveSelectedMonth,
} from "@/lib/client/finance-model";
import { useUiStore } from "@/lib/client/ui-store";
import type { Profile } from "@/lib/domain/profile";

export function FinanceApp() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const activeView = useUiStore((state) => state.activeView);
  const selectedPeriod = useUiStore((state) => state.selectedPeriod);
  const sessionQuery = useQuery({
    queryKey: sessionQueryKey,
    queryFn: getSession,
  });
  const dashboardQuery = useQuery({
    queryKey: dashboardQueryKey,
    queryFn: getDashboard,
    enabled: sessionQuery.isSuccess && sessionQuery.data !== null,
  });
  const signOutMutation = useMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
      queryClient.getQueryCache().clear();
      queryClient.setQueryData<Profile | null>(sessionQueryKey, null);
    },
  });

  if (sessionQuery.isPending) {
    return <ProfileGateStatus kind="loading" />;
  }

  if (sessionQuery.isError) {
    return (
      <ProfileGateStatus
        kind="error"
        onRetry={() => void sessionQuery.refetch()}
      />
    );
  }

  if (sessionQuery.data === null) {
    return (
      <ProfileGate
        onAuthenticated={(profile) => {
          queryClient.setQueryData<Profile>(sessionQueryKey, profile);
        }}
      />
    );
  }

  const profile = sessionQuery.data;
  const frameProps = {
    profile,
    signingOut: signOutMutation.isPending,
    signOutError: signOutMutation.isError,
    onSignOut: () => signOutMutation.mutate(),
  };

  if (dashboardQuery.isPending) {
    return (
      <AppFrame {...frameProps}>
        <CenteredState
          kind="loading"
          message={t("states.loadingDashboard")}
        />
        <ImportDialog />
      </AppFrame>
    );
  }

  if (dashboardQuery.isError) {
    return (
      <AppFrame {...frameProps}>
        <ViewHeader
          eyebrow={t("header.eyebrow")}
          title={t("states.dashboardErrorTitle")}
          description={t("states.dashboardErrorDescription")}
        />
        <CenteredState
          kind="error"
          message={t("states.dashboardErrorDescription")}
          onRetry={() => void dashboardQuery.refetch()}
        />
        <ImportDialog />
      </AppFrame>
    );
  }

  const months = buildMonthSummaries(dashboardQuery.data);
  const selected = resolveSelectedMonth(months, selectedPeriod);
  const imports = buildImportSummaries(dashboardQuery.data);
  let view: React.ReactNode;

  switch (activeView) {
    case "pulse":
      view = selected ? (
        <PulseView months={months} selected={selected} />
      ) : (
        <>
          <ViewHeader
            eyebrow={t("header.eyebrow")}
            title={t("header.title")}
          />
          <CenteredState kind="empty" message={t("data.empty")} />
        </>
      );
      break;
    case "data":
      view =
        months.length > 0 ? (
          <DataView months={months} />
        ) : (
          <>
            <ViewHeader
              eyebrow={t("data.eyebrow")}
              title={t("data.title")}
              description={t("data.description")}
            />
            <CenteredState kind="empty" message={t("data.empty")} />
          </>
        );
      break;
    case "imports":
      view = <ImportsView imports={imports} />;
      break;
  }

  return (
    <AppFrame {...frameProps}>
      {view}
      <ImportDialog />
    </AppFrame>
  );
}
