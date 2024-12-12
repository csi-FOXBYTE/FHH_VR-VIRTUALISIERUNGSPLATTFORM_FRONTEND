"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { TRPCProvider } from "./trpc/client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Theme, ThemeProvider, createTheme } from "@mui/material";
import theme from "./theme";
import { Session } from "next-auth";
import { routing } from "./i18n/routing";
import { deDE, enUS } from "@mui/material/locale";
import { deDE as xdeDE, enUS as xenUS } from "@mui/x-data-grid/locales";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const supportedLocales: Record<typeof routing.locales[number], Theme> = {
  "de": createTheme(deDE, xdeDE),
  "en": createTheme(enUS, xenUS),
}

export default function AppProviders({
  session,
  children,
  locale,
}: {
  session: Session | null;
  children: ReactNode;
  locale: string;
}) {
  const themeWithLocale = createTheme(theme, supportedLocales[locale as "en"] ?? supportedLocales.en);

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={themeWithLocale}>
        <SessionProvider session={session}>
          <TRPCProvider>{children}</TRPCProvider>
        </SessionProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
