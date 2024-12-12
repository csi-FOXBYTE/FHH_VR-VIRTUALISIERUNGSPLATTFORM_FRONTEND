"use client";

import { trpc } from "@/trpc/client";
import { Box, Button } from "@mui/material";
import { useTranslations } from "next-intl";

export default function Home() {
  const { mutate: helloWorldMutation } =
    trpc.testRouter.halloWelt.useMutation();
  const { mutate: errorWorldMutation } =
    trpc.testRouter.errorWorld.useMutation();

  const t = useTranslations();

  return (
    <Box>
      <h1>{t("LandingPage.title")}</h1>
      <Button onClick={() => helloWorldMutation()}>Hello World</Button>
      <Button onClick={() => errorWorldMutation({ a: "Hallöle", b: false })}>
        Error World
      </Button>
    </Box>
  );
}
