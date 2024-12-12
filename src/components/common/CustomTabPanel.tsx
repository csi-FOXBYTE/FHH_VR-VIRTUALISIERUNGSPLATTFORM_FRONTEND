import { Box } from "@mui/material";
import { ReactNode } from "react";

export default function CustomTabPanel({
  children,
  index,
  value,
}: {
  children: ReactNode;
  index: number;
  value: number;
}) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      aria-labelledby={`custom-tab-${index}`}
    >
      {value === index ? <Box sx={{ pt: 3, pb: 3 }}>{children}</Box> : null}
    </div>
  );
}
