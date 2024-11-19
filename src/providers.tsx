"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { TRPCProvider } from "./trpc/client";

export default function Providers({
  session,
  children,
}: {
  session: any;
  children: ReactNode;
}) {
  return (
    <SessionProvider session={session}>
      <TRPCProvider>{children}</TRPCProvider>
    </SessionProvider>
  );
}
