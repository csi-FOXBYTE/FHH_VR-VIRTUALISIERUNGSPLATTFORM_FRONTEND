import { Backdrop, Grid, LinearProgress, Typography } from "@mui/material";
import { useViewerStore } from "./ViewerProvider";
import { useTranslations } from "next-intl";

export default function SavingBlocker() {
  const t = useTranslations();

  const savingBlockerOpen = useViewerStore((state) => state.savingBlockerOpen);

  return (
    <Backdrop sx={{ zIndex: 20 }} open={savingBlockerOpen}>
      <Grid container flexDirection="column" spacing={2} alignItems="center">
        <LinearProgress
          variant="indeterminate"
          sx={{ height: 10, width: 200 }}
        />
        <Typography variant="body1" sx={{ color: "white" }}>
          {t('editor.saving-project-please-do-not-close-this-window')}
        </Typography>
      </Grid>
    </Backdrop>
  );
}
