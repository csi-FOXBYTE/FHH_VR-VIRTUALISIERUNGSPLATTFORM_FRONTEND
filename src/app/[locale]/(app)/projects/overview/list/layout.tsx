import { HydrateClient, trpc } from "@/server/trpc/server";
import { ReactNode } from "react";

export default async function ProjectsOverviewListLayout({
  children,
}: {
  children: ReactNode;
}) {
  await trpc.projectOverviewRouter.getProjects.prefetch({
    filter: null,
    limit: 25,
    skip: 0,
    search: {},
    sortBy: "",
    sortOrder: undefined,
  });

  return <HydrateClient>{children}</HydrateClient>;
}
