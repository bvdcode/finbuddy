"use client";

import { useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import {
  dashboardQueryKey,
  isUnauthorizedApiError,
  sessionQueryKey,
} from "@/lib/client/api";
import type { Profile } from "@/lib/domain/profile";
import { i18n } from "@/lib/i18n/instance";
import { appTheme } from "@/theme/theme";

interface ProvidersProps {
  children: React.ReactNode;
}

function createQueryClient(): QueryClient {
  function handleError(error: Error): void {
    if (!isUnauthorizedApiError(error)) {
      return;
    }

    queryClient.removeQueries({ queryKey: dashboardQueryKey });
    queryClient.setQueryData<Profile | null>(sessionQueryKey, null);
  }

  const queryClient = new QueryClient({
    queryCache: new QueryCache({ onError: handleError }),
    mutationCache: new MutationCache({ onError: handleError }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) =>
          !isUnauthorizedApiError(error) && failureCount < 3,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return queryClient;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(createQueryClient);

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={appTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}
