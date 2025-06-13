import { Grid, TextField } from "@mui/material";
import { SelectedObjectResolved } from "./ViewerProvider";

export default function ObjectInfo({
  selectedObject,
}: {
  selectedObject: SelectedObjectResolved;
}) {
  if (selectedObject.type === "TILE_3D") return null;

  return (
    <Grid container flexDirection="column" width="100%" height="100%">
      <TextField label="Name" fullWidth value={selectedObject.name} />
    </Grid>
  );
}
