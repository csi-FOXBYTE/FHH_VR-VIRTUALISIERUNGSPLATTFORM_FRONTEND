import { HydrateClient, trpc } from "@/server/trpc/server";
import { ReactNode } from "react";

export default async function ProjectsOverviewTileLayout({
  children,
}: {
  children: ReactNode;
}) {
  await trpc.projectOverviewRouter.getProjects.prefetch({ limit: 18, skip: 0, filter: {}, search: {} });

  return <HydrateClient>{children}</HydrateClient>;
}
