import BreadCrumbs from "@/components/navbar/BreadCrumbs";
import { Paper } from "@mui/material";
import { ReactNode } from "react";

export default function WithStaticLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        overflow: "hidden",
        overflowY: "auto",
        padding: "32px 64px",
        boxSizing: "border-box",
        height: "100%",
        width: "100%",
      }}
    >
      <BreadCrumbs />
      {children}
    </Paper>
  );
}
