"use client";

import { Box, Card, CardHeader, Grid2 } from "@mui/material";
import { Link } from "@/server/i18n/routing";
import { useTranslations } from "next-intl";
import { styled } from "@mui/material/styles";

const StyledBox = styled(Box)({
  display: "flex",
  alignContent: "center",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
});

const StyledCard = styled(Card)({
  display: "flex",
  width: 354,
  height: 311,
  alignContent: "center",
  justifyContent: "center",
  margin: "1rem",
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
});

const StyledLink = styled(Link)({
  textDecoration: "none",
  color: "inherit",
  "&:hover": {
    textDecoration: "none",
  },
  display: "block",
  width: "100%",
  height: "100%",
});

export default function Home() {
  const t = useTranslations();

  return (
    <StyledBox>
      <Grid2 container spacing={4}>
        <Grid2 xs={12} sm={6}>
          <StyledLink href="/site">
            <StyledCard>
              <CardHeader title={t("routes./.sites")} />
            </StyledCard>
          </StyledLink>
        </Grid2>
        <Grid2 xs={12} sm={6}>
          <StyledLink href="/project">
            <StyledCard>
              <CardHeader title={t("routes./.projects")} />
            </StyledCard>
          </StyledLink>
        </Grid2>
      </Grid2>
    </StyledBox>
  );
}
