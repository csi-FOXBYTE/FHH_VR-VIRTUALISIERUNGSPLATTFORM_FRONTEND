"use server";

import { getTranslations } from "next-intl/server";
import { unstable_noStore } from "next/cache";
import { ReactNode } from "react";

export async function generateMetadata() {
  const t = await getTranslations();

  return { title: t("navigation.editor") };
}

export default async function ThreeDViewerLayout({
  children,
}: {
  children: ReactNode;
}) {
  unstable_noStore();

  return children;
}
