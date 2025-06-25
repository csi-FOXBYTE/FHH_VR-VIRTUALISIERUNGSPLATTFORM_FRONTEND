import { Grid, GridProps } from "@mui/material";
import { ReactNode } from "react";

export default function PageContainer({
  children,
  ...props
}: {
  children: ReactNode;
} & GridProps) {
  return (
    <Grid container spacing={4} flex="1" flexDirection="column" {...props}>
      {children}
    </Grid>
  );
}
