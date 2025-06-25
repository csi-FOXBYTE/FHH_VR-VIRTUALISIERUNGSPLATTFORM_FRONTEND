"use server";

import { HydrateClient, trpc } from "@/server/trpc/server";
import { getTranslations } from "next-intl/server";
import { ReactNode } from "react";

export async function generateMetadata() {
  const t = await getTranslations();

  return { title: t("navigation.collaboration") };
}

export default async function CollaborationLayout({
  children,
}: {
  children: ReactNode;
}) {
  await trpc.eventsRouter.list.prefetch();

  return <HydrateClient>{children}</HydrateClient>;
}
