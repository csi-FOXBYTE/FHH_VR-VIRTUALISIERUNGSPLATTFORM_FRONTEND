"use client";

import { Box, Card, CardHeader, Grid2 } from "@mui/material";
import { Link } from "@/server/i18n/routing";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations();

  return (
    <Box>
      <Grid2 container spacing={8}>
        <Grid2 size={6}>
          <Card>
            <CardHeader
              component={Link}
              href="/site"
              title={t("routes./.sites")}
            />
          </Card>
        </Grid2>
        <Grid2 size={6}>
          <Card>
            <CardHeader
              component={Link}
              href="/project"
              title={t("routes./.projects")}
            />
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
}
