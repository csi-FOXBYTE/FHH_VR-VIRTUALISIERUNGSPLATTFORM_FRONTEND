import { Button, Grid } from "@mui/material";
import Separate from "./Separate";
import { Camera } from "@mui/icons-material";
import { useViewerStore } from "./ViewerProvider";

export function useIsScreenshotDialogOpen() {
  const screenshotDialogOpen = useViewerStore(
    (state) => state.tools.screenshotDialogOpen
  );

  return screenshotDialogOpen;
}

export default function ScreenshotDialog() {
  const tools = useViewerStore((state) => state.tools);

  if (!tools.screenshotDialogOpen) return null;

  return (
    <>
      <Separate selector=".cesium-viewer">
        <Grid
          container
          justifyContent="center"
          justifyItems="center"
          alignItems="center"
          sx={{ width: "100%", height: "100%", pointerEvents: "all" }}
        >
          <Button
            variant="contained"
            onClick={() => tools.screenshotButtonPressedResolve()}
            startIcon={<Camera />}
          >
            Screenshot aufnehmen
          </Button>
        </Grid>
      </Separate>
    </>
  );
}
