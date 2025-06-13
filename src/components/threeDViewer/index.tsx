"use client";

import { CircularProgress, Grid } from "@mui/material";
import "cesium/Build/Cesium/Widgets/widgets.css";
import dynamic from "next/dynamic";
import AppBar from "./AppBar";
import RightDrawer from "./RightDrawer";
import Toolbar from "./Toolbar";
import ImportProjectObjectDialog from "./ImportProjectObjectDialog";

const ResiumViewer = dynamic(async () => (await import("./Viewer")).default, {
  ssr: false,
  loading: () => (
    <Grid
      width="100%"
      height="100%"
      flexDirection="column"
      alignItems="center"
      style={{ background: "white" }}
      justifyContent="center"
      alignContent="center"
      position="absolute"
      top="0"
      left="0"
      justifyItems="center"
    >
      <CircularProgress />
      <div>Loading Viewer component... </div>
    </Grid>
  ),
});

export function ThreeDViewer() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AppBar />
      <ImportProjectObjectDialog />
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          position: "relative",
          background: "rgba(0, 0, 0, 0.75)",
        }}
      >
        <Toolbar />
        <Grid container height="100%">
          <Grid flex={1} position="relative" height="100%">
            <ResiumViewer />
          </Grid>
          <RightDrawer />
        </Grid>
      </div>
    </div>
  );
}
