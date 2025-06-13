"use server";

import { HydrateClient, trpc } from "@/server/trpc/server";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ReactNode } from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectId: string }>;
}): Promise<Metadata> {
  const { projectId } = await params;

  const t = await getTranslations();

  if (projectId === "new") {
    return { title: t("navigation.new-project") };
  }

  const { title } = await trpc.projectRouter.getTitle({
    id: projectId,
  });

  return { title: t("navigation.project", { title }) };
}

export default async function ProjectLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  await trpc.projectRouter.getFull.prefetch({ id: projectId });

  return <HydrateClient>{children}</HydrateClient>;
}
