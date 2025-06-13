"use client";

import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import { IconButton, Tooltip, useTheme } from "@mui/material";
import { useState } from "react";
import ObjectProperties from "./ObjectProperties";
import SceneGraph from "./SceneGraph";
import SplitPane from "./SplitPane";

export default function RightDrawer() {
  const theme = useTheme();

  const [rightDrawerVisibility, setRightDrawerVisibility] = useState(true);

  return (
    <>
      <div
        style={{
          width: rightDrawerVisibility ? 400 : 0,
          height: "100%",
          transition: "width 0.3s ease",
        }}
      />
      <div
        style={{
          height: "100%",
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 100,
          background: theme.palette.background.paper,
          boxShadow: theme.shadows[2],
          width: 400,
          borderTop: "1px solid #ddd",
          transition: "transform 0.3s ease",
          transform: rightDrawerVisibility
            ? "translateX(0)"
            : "translateX(400px)",
        }}
      >
        <div style={{ height: "100%", width: "100%", position: "relative" }}>
          <Tooltip
            title={rightDrawerVisibility ? "Hide drawer" : "Show drawer"}
            arrow
          >
            <IconButton
              onClick={() => setRightDrawerVisibility(!rightDrawerVisibility)}
              style={{
                position: "absolute",
                left: -12,
                top: "50%",
                transform: "translateX(-50%)",
                boxShadow: theme.shadows[2],
                background: "white",
                borderRadius: 8,
              }}
            >
              {rightDrawerVisibility ? <ArrowRight /> : <ArrowLeft />}
            </IconButton>
          </Tooltip>
          <SplitPane top={<SceneGraph />} bottom={<ObjectProperties />} />
        </div>
      </div>
    </>
  );
}
