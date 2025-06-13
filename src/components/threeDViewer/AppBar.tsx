import { Redo, Undo } from "@mui/icons-material";
import {
  Button,
  ButtonGroup,
  Divider,
  Grid,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Typography,
} from "@mui/material";
import { useState } from "react";
import BreadCrumbs from "../navbar/BreadCrumbs";
import { useViewerStore } from "./ViewerProvider";

export default function AppBar() {
  const [fileAnchorEl, setFileAnchorEl] = useState<HTMLElement | null>();

  const [fileMenuOpen, setFileMenuOpen] = useState(false);

  const history = useViewerStore((state) => state.history);

  const toggleImport = useViewerStore(
    (state) => state.projectObjects.toggleImport
  );

  return (
    <Grid
      width="100%"
      boxShadow={2}
      container
      justifyContent="space-between"
      alignItems="center"
      padding="0 32px"
    >
      <Grid container alignItems="center" alignContent="center">
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
            <MenuItem
              onClick={() => {
                toggleImport();
                setFileMenuOpen(false);
              }}
            >
              <ListItemText>Import</ListItemText>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                ⌘I
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={history.undo}>
              <ListItemText>Undo</ListItemText>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                ⌘Z
              </Typography>
            </MenuItem>
            <MenuItem onClick={history.redo}>
              <ListItemText>Redo</ListItemText>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                ⌘Y
              </Typography>
            </MenuItem>
            <Divider />
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
      </Grid>
      <div />
      <ButtonGroup>
        <Button disabled={history.index === 0} onClick={history.undo}>
          <Undo />
        </Button>
        <Button
          disabled={history.value.length === history.index + 1}
          onClick={history.redo}
        >
          <Redo />
        </Button>
      </ButtonGroup>
    </Grid>
  );
}
