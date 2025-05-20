import {
  Grid2,
  ButtonGroup,
  Button,
  Menu,
  MenuList,
  MenuItem,
  ListItemText,
  Typography,
} from "@mui/material";
import BreadCrumbs from "../navbar/BreadCrumbs";
import { useState } from "react";
import { useViewerStore } from "./ViewerProvider";
import * as Cesium from "cesium";

export default function AppBar() {
  const [fileAnchorEl, setFileAnchorEl] = useState<HTMLElement | null>();

  const [fileMenuOpen, setFileMenuOpen] = useState(false);

  const projectObjects = useViewerStore((state) => state.projectObjects);
  const setProjectObjects = useViewerStore((state) => state.setProjectObjects);

  return (
    <Grid2
      width="100%"
      boxShadow={2}
      container
      justifyContent="space-between"
      alignItems="center"
      padding="0 32px"
    >
      <ButtonGroup color="secondary" variant="text">
        <Button onClick={() => setFileMenuOpen(true)} ref={setFileAnchorEl}>
          File
        </Button>
      </ButtonGroup>
      <Menu
        disablePortal
        open={fileMenuOpen}
        hideBackdrop={false}
        onClose={() => setFileMenuOpen(false)}
        slotProps={{
          paper: {
            style: {
              borderRadius: 0,
              pointerEvents: "all",
              width: 240,
              maxWidth: "100%",
            },
          },
        }}
        anchorEl={fileAnchorEl}
      >
        <MenuList dense>
          <MenuItem>
            <ListItemText>Save</ListItemText>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              ⌘S
            </Typography>
          </MenuItem>
          <MenuItem component="label">
            <ListItemText>Import</ListItemText>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              ⌘I
            </Typography>
            <input
              type="file"
              style={{ display: "none" }}
              onChange={async (event) => {
                const file = event.target.files?.[0];

                if (!file) return;

                const buffer = await file.arrayBuffer();

                setProjectObjects([
                  ...projectObjects,
                  {
                    fileContent: Buffer.from(buffer),
                    id: crypto.randomUUID(),
                    metaData: {},
                    modelMatrix: new Cesium.Matrix4(),
                    name: file.name,
                    visible: true,
                  },
                ]);
              }}
            />
          </MenuItem>
          <MenuItem>
            <ListItemText>Close</ListItemText>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary" }}
            ></Typography>
          </MenuItem>
        </MenuList>
      </Menu>
      <BreadCrumbs style={{ marginBottom: 0 }} />
      <div />
    </Grid2>
  );
}
