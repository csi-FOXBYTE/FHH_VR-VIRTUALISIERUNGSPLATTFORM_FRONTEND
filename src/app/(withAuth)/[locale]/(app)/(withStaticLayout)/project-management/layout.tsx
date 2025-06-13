"use server";

import { trpc } from "@/server/trpc/server";
import { HydrateClient } from "@/server/trpc/server";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ReactNode } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return { title: t("navigation.project-management"),  };
}

export default async function ProjectManagementLayout({
  children,
}: {
  children: ReactNode;
}) {
  await trpc.projectManagementRouter.list.prefetch({ page: 0, rowsPerPage: 10 });

  return <HydrateClient>{children}</HydrateClient>;
}
