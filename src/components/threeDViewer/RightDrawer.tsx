"use client";

import {
  Add,
  ArrowLeft,
  ArrowRight,
  Delete,
  Visibility,
  VisibilityOff
} from "@mui/icons-material";
import {
  Button,
  ButtonGroup,
  Grid2,
  IconButton,
  Input,
  Table,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
  useTheme
} from "@mui/material";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import * as Cesium from "cesium";
import { useSnackbar } from "notistack";
import { useState } from "react";
import SplitPane, { Pane } from "react-split-pane";
import CoordinateInput from "./CoordinateInput";
import "./SplitPane.css";
import { useViewerStore } from "./ViewerProvider";

export default function RightDrawer() {
  const theme = useTheme();

  const [rightDrawerVisibility, setRightDrawerVisibility] = useState(true);

  const clippingPolygons = useViewerStore((state) => state.clippingPolygons);
  const updateClippingPolygons = useViewerStore(
    (state) => state.updateClippingPolygons
  );

  const info = useViewerStore((state) => state.objectInfo?.info);

  const object = useViewerStore((state) => state.objectInfo?.object);

  const setProjectObjects = useViewerStore((state) => state.setProjectObjects);
  const projectObjects = useViewerStore((state) => state.projectObjects);

  const createStartingPoint = useViewerStore(
    (state) => state.createStartingPoint
  );
  const startingPoints = useViewerStore((state) => state.startingPoints);

  const pickPoint = useViewerStore((state) => state.tools.pickPoint);
  const createClippingPolygon = useViewerStore(
    (state) => state.createClippingPolygon
  );

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

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
                zIndex: -1,
              }}
            >
              {rightDrawerVisibility ? <ArrowRight /> : <ArrowLeft />}
            </IconButton>
          </Tooltip>
          {/** @ts-expect-error wrong types */}
          <SplitPane
            split="horizontal"
            style={{ height: "100%" }}
            minSize={50}
            defaultSize={"30%"}
          >
            {/** @ts-expect-error wrong types */}
            <Pane style={{ overflow: "hidden", overflowY: "auto" }}>
              <Typography variant="h6">Scene Graph</Typography>
              <SimpleTreeView>
                <TreeItem
                  itemId="grid"
                  contextMenu=""
                  label={
                    <Grid2
                      container
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography>
                        Clipping Polygons [{clippingPolygons.length}]
                      </Typography>
                      <ButtonGroup size="small">
                        <IconButton
                          size="small"
                          onClick={async (event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            await createClippingPolygon();
                          }}
                        >
                          <Add />
                        </IconButton>
                      </ButtonGroup>
                    </Grid2>
                  }
                >
                  {clippingPolygons.map((clippingPolygon) => (
                    <TreeItem
                      key={clippingPolygon.id}
                      itemId={clippingPolygon.id}
                      label={
                        <Grid2
                          container
                          justifyContent="space-between"
                          alignItems="center"
                          wrap="nowrap"
                        >
                          <Input
                            defaultValue={clippingPolygon.name}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                const clippingPolygonIndex =
                                  clippingPolygons.findIndex(
                                    (p) => clippingPolygon.id === p.id
                                  );

                                if (clippingPolygonIndex === -1) return;

                                const newClippingPolygons = [
                                  ...clippingPolygons,
                                ];

                                newClippingPolygons[clippingPolygonIndex] = {
                                  ...clippingPolygon,
                                  name: event.currentTarget.value,
                                };

                                updateClippingPolygons(newClippingPolygons);
                              }
                            }}
                          />
                          <ButtonGroup>
                            <Tooltip title="Toggle clipping polygon visibility">
                              <IconButton
                                onClick={() => {
                                  const clippingPolygonIndex =
                                    clippingPolygons.findIndex(
                                      (p) => clippingPolygon.id === p.id
                                    );

                                  if (clippingPolygonIndex === -1) return;

                                  const newClippingPolygons = [
                                    ...clippingPolygons,
                                  ];

                                  newClippingPolygons[clippingPolygonIndex] = {
                                    ...clippingPolygon,
                                    visible: !clippingPolygon.visible,
                                  };

                                  updateClippingPolygons(newClippingPolygons);
                                }}
                              >
                                {clippingPolygon.visible ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete clipping polygon">
                              <IconButton
                                onClick={() => {
                                  updateClippingPolygons(
                                    clippingPolygons.filter(
                                      (p) => p.id !== clippingPolygon.id
                                    )
                                  );
                                }}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </ButtonGroup>
                        </Grid2>
                      }
                    />
                  ))}
                </TreeItem>
                <TreeItem
                  itemId="project_objects"
                  label={
                    <Grid2
                      container
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography>
                        Project objects [{projectObjects.length}]
                      </Typography>
                      <ButtonGroup size="small">
                        <IconButton
                          size="small"
                          disabled
                          style={{ opacity: 0 }}
                        >
                          <Add />
                        </IconButton>
                      </ButtonGroup>
                    </Grid2>
                  }
                >
                  {projectObjects.map((projectObject, index) => (
                    <TreeItem
                      key={projectObject.id}
                      itemId={projectObject.id}
                      label={
                        <>
                          {projectObject.name}
                          <Button
                            onClick={async () => {
                              const id = crypto.randomUUID();

                              enqueueSnackbar({
                                variant: "info",
                                message:
                                  "Picking a point. To abort press either right click or escape.",
                                key: id,
                                autoHideDuration: null,
                              });

                              document.body.style.cursor = "crosshair";

                              try {
                                const pickedPoint = await pickPoint();
                                const newProjectObjects = [...projectObjects];

                                newProjectObjects[index] = {
                                  ...projectObject,
                                  modelMatrix:
                                    Cesium.Transforms.eastNorthUpToFixedFrame(
                                      new Cesium.Cartesian3(
                                        pickedPoint.x,
                                        pickedPoint.y,
                                        pickedPoint.z
                                      )
                                    ),
                                };

                                setProjectObjects(newProjectObjects);
                              } catch {}

                              document.body.style.cursor = "auto";

                              closeSnackbar(id);
                            }}
                          >
                            Pick
                          </Button>
                        </>
                      }
                    />
                  ))}
                </TreeItem>
                <TreeItem
                  itemId="starting_points"
                  label={
                    <Grid2
                      container
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography>
                        Starting points [{startingPoints.length}]
                      </Typography>
                      <ButtonGroup size="small">
                        <IconButton
                          size="small"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            createStartingPoint();
                          }}
                        >
                          <Add />
                        </IconButton>
                      </ButtonGroup>
                    </Grid2>
                  }
                >
                  {startingPoints.map((startingPoint) => (
                    <TreeItem
                      key={startingPoint.id}
                      itemId={startingPoint.id}
                      label={<>{startingPoint.name}</>}
                    />
                  ))}
                </TreeItem>
                <TreeItem
                  itemId="points_of_interest"
                  label={`Points of interest (0)`}
                ></TreeItem>
              </SimpleTreeView>
            </Pane>
            {/** @ts-expect-error wrong types */}
            <Pane style={{ overflow: "hidden", overflowY: "auto" }}>
              <Typography variant="h6">Object Info</Typography>
              {info ? (
                <Table>
                  {Object.entries(info).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell>{String(value)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>Origin</TableRow>
                  <CoordinateInput
                    value={object?.primitive?.boundingSphere?.center}
                  />
                  <TableRow>
                    {object?.primitive?.boundingSphere?.center?.toString()}
                  </TableRow>
                </Table>
              ) : null}
            </Pane>
          </SplitPane>
        </div>
      </div>
    </>
  );
}
