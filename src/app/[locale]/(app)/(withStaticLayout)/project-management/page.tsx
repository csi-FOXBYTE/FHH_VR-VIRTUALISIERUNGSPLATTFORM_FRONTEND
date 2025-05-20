import { Grid2, Tab, Tabs, Typography } from "@mui/material";

export default function ProjectManagementPage() {
  return (
    <Grid2 container flexDirection="column">
      <Typography variant="h4" marginBottom={4}>Projektverwaltung</Typography>
      <Tabs>
        <Tab label="Meine Projekte" />
        <Tab label="Mit mir geteilte" />
      </Tabs>
    </Grid2>
  );
}
