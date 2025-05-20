import {
  Crop169,
  ContentCut,
  AddLocationAlt,
  AddAPhoto,
  OpenWith,
  ThreeSixty,
  Expand,
} from "@mui/icons-material";
import { Divider, Grid2, IconButton, Tooltip, useTheme } from "@mui/material";
import { useViewerStore } from "./ViewerProvider";

export default function Toolbar() {
  const theme = useTheme();

  const createClippingPolygon = useViewerStore(
    (state) => state.createClippingPolygon
  );

  const createStartingPoint = useViewerStore(
    (state) => state.createStartingPoint
  );
  const createPointOfInterest = useViewerStore(
    (state) => state.createPointOfInterest
  );

  const { toggleSafeCameraZoneVisibility } = useViewerStore(
    (state) => state.tools
  );

  return (
    <div
      style={{
        top: "50%",
        transform: "translateY(-50%)",
        left: 0,
        position: "absolute",
        zIndex: 100,
        background: theme.palette.background.paper,
        boxShadow: theme.shadows[2],
        borderRadius: "0 8px 8px 0px",
      }}
    >
      <Grid2 container flexDirection="column">
        <Tooltip arrow placement="right" title="Toggle camera safe zone">
          <IconButton onClick={toggleSafeCameraZoneVisibility}>
            <Crop169 />
          </IconButton>
        </Tooltip>
        <Divider />
        <Tooltip arrow placement="right" title="Translate">
          <IconButton>
            <OpenWith />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="right" title="Rotate">
          <IconButton>
            <ThreeSixty />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="right" title="Scale">
          <IconButton>
            <Expand />
          </IconButton>
        </Tooltip>
        <Divider />
        <Tooltip arrow placement="right" title="Create clipping polygon">
          <IconButton onClick={createClippingPolygon}>
            <ContentCut />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="right" title="Create starting point">
          <IconButton onClick={createStartingPoint}>
            <AddLocationAlt />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="right" title="Create point of interest">
          <IconButton onClick={createPointOfInterest}>
            <AddAPhoto />
          </IconButton>
        </Tooltip>
      </Grid2>
    </div>
  );
}
