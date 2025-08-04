"use client";

import { getApis } from "@/server/gatewayApi/client";
import { ProjectApi } from "@/server/gatewayApi/generated";
import { Cartesian3, Cesium3DTileset, Entity, Model } from "cesium";
import { createContext, ReactNode, useContext, useState } from "react";
import { ResiumContext } from "resium";
import { create, StoreApi, UseBoundStore } from "zustand";

export type ClippingPolygon = {
  type: "CLIPPING_POLYGON";
  positions: { x: number; y: number; z: number }[];
  visible: boolean;
  affectsTerrain: boolean;
  name: string;
  id: string;
};

export type ProjectObject = {
  type: "PROJECT_OBJECT";
  href: string;
  name: string;
  translation: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
  scale: { x: number; y: number; z: number };
  attributes: Record<string, string>;
  id: string;
  visible: boolean;
};

export type StartingPoint = {
  type: "STARTING_POINT";
  id: string;
  name: string;
  description: string;
  img: string;
  position: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
  visible: boolean;
};

export type Tile3D = {
  type: "TILE_3D";
  id: string;
  name: string;
  attributes: Record<string, string>;
};

export type Layer = {
  name: string;
  id: string;
  type: "LAYER";
  projectObjects: ProjectObject[];
  clippingPolygons: ClippingPolygon[];
};

export type BaseLayer = {
  name: string;
  id: string;
  type: string;
  href: string;
};

export type SelectedObject =
  | {
      type: (ClippingPolygon | ProjectObject | StartingPoint)["type"];
      id: string;
    }
  | Tile3D;
export type SelectedObjectResolved =
  | ClippingPolygon
  | ProjectObject
  | StartingPoint
  | Tile3D;

export type ViewerStoreType = {
  ctx: ResiumContext | null;
  setCtx: (ctx: ResiumContext) => void;

  lastCameraPosition: {
    lon: number;
    lat: number;
    height: number;
    heading: number;
    pitch: number;
    roll: number;
  };

  project: Project;
  updateProject: (
    project: Partial<{ title: string; description: string }>
  ) => Promise<void>;
  saveProject: () => Promise<void>;
  savingBlockerOpen: boolean;

  layers: {
    selectedLayer: string;
    value: Layer[];
    changeToLayer: (id: string) => Promise<void>;
    save: () => void;
    add: () => Layer;
    update: (layer: Partial<Layer> & { id: string }) => void;
    remove: (id: string) => void;
  };

  baseLayers: {
    value: BaseLayer[];
    selectedBaseLayers: string[];
    add: (id: string) => void;
    remove: (id: string) => void;
  };

  tools: {
    screenshotDialogOpen: boolean;
    screenshotButtonPressedResolve: () => void;
    screenshotButtonPressedReject: () => void;
    takeScreenshot: (startingPoint: {
      position: { x: number; y: number; z: number };
      target: { x: number; y: number; z: number };
    }) => Promise<string | null>;
    safeCameraZoneVisible: boolean;
    toggleSafeCameraZoneVisibility: () => void;
    pickPoint: () => Promise<{ x: number; y: number; z: number }>;
    pickPolygon: () => Promise<{ x: number; y: number; z: number }[]>;
    shadowVisible: boolean;
    toggleShadowVisibility: () => void;
  };
  updateTools: (tools: Partial<ViewerStoreType["tools"]>) => void;

  clippingPolygons: {
    value: ClippingPolygon[];
    set: (clippingPolgons: ClippingPolygon[]) => void;
    update: (
      clippingPolygon: Partial<ClippingPolygon> & { id: string }
    ) => void;
    delete: (id: string) => void;
    create: () => Promise<void>;
  };

  projectObjects: {
    value: ProjectObject[];
    _importerOpen: boolean;
    toggleImport: () => void;
    toggleVisibility: (id: string) => void;
    set: (projectObjects: ProjectObject[]) => void;
    update: (projectObject: Partial<ProjectObject> & { id: string }) => void;
    delete: (id: string) => void;
    create: () => Promise<void>;
  };

  startingPoints: {
    value: StartingPoint[];
    helpers: {
      flyTo: (startingPoint: StartingPoint) => void;
      takeScreenshot: (startingPoint: StartingPoint) => void;
    };
    set: (startingPoints: StartingPoint[]) => void;
    update: (startingPoint: Partial<StartingPoint> & { id: string }) => void;
    delete: (id: string) => void;
    create: () => Promise<void>;
  };

  selectedObject: SelectedObject | null; // this is dangerous -> need to get it here
  setSelectedObject: (selectedObject: SelectedObject | null) => void;

  history: {
    undo: () => void;
    initialize: () => void;
    redo: () => void;
    takeSnapshot: () => void;
    value: {
      clippingPolygons: ViewerStoreType["clippingPolygons"]["value"];
      startingPoints: ViewerStoreType["startingPoints"]["value"];
      projectObjects: ViewerStoreType["projectObjects"]["value"];
      selectedObject: ViewerStoreType["selectedObject"];
      project: {
        title: string;
        description: string;
      };
    }[];
    index: number;
  };

  objectRefs: {
    clippingPolygons: Record<string, Entity>;
    startingPoints: Record<string, Entity>;
    visualAxes: Record<string, Entity>;
    projectObject: Record<string, Model>;
    tile3Ds: Record<string, Cesium3DTileset>;
  };
  registerObjectRef: (
    args:
      | { type: ClippingPolygon["type"]; id: string; objectRef: Entity }
      | { type: StartingPoint["type"]; id: string; objectRef: Entity }
      | { type: ProjectObject["type"]; id: string; objectRef: Model }
  ) => void;
  unregisterObjectRef: (args: {
    id: string;
    type:
      | ClippingPolygon["type"]
      | StartingPoint["type"]
      | ProjectObject["type"];
  }) => void;
};

export function useSelectedObject() {
  const selectedObject = useViewerStore((state) => state.selectedObject);

  const clippingPolygons = useViewerStore(
    (state) => state.clippingPolygons.value
  );
  const startingPoints = useViewerStore((state) => state.startingPoints.value);
  const projectObjects = useViewerStore((state) => state.projectObjects.value);

  if (!selectedObject) return null;

  switch (selectedObject.type) {
    case "CLIPPING_POLYGON":
      return clippingPolygons.find((c) => selectedObject.id === c.id) ?? null;
    case "STARTING_POINT":
      return startingPoints.find((c) => selectedObject.id === c.id) ?? null;
    case "PROJECT_OBJECT":
      return projectObjects.find((c) => selectedObject.id === c.id) ?? null;
    case "TILE_3D":
      return selectedObject;
  }
}

type Project = Awaited<ReturnType<ProjectApi["projectIdGet"]>>;

const ViewerContext = createContext<UseBoundStore<
  StoreApi<ViewerStoreType>
> | null>(null);

export const ViewerProvider = ({
  children,
  project,
}: {
  children: ReactNode;
  project: Project;
}) => {
  const [viewerContext] = useState(() => {
    const store = create<ViewerStoreType>((set, get) => ({
      lastCameraPosition: {
        heading: 0,
        height: 0,
        lat: 0,
        lon: 0,
        pitch: 0,
        roll: 0,
      },
      baseLayers: {
        value: project.allAvailableBaseLayers.map((baseLayer) => ({
          href: baseLayer.href,
          id: baseLayer.id,
          name: baseLayer.name,
          type: baseLayer.type,
        })),
        selectedBaseLayers: project.includedBaseLayers,
        add(id) {
          set((state) => ({
            baseLayers: {
              ...state.baseLayers,
              selectedBaseLayers: Array.from(
                new Set([...state.baseLayers.selectedBaseLayers, id])
              ),
            },
          }));
        },
        remove(id) {
          set((state) => {
            const newSet = new Set(state.baseLayers.selectedBaseLayers);

            newSet.delete(id);

            return {
              baseLayers: {
                ...state.baseLayers,
                selectedBaseLayers: Array.from(newSet),
              },
            };
          });
        },
      },
      project,
      savingBlockerOpen: false,
      async updateProject(project) {
        set((state) => ({
          project: {
            ...state.project,
            ...(project.title ? { title: project.title } : {}),
            ...(project.description ? { description: project.description } : {}),
          },
        }));

        get().history.takeSnapshot();
      },
      async saveProject() {
        const { projectApi } = await getApis();

        set(() => ({
          savingBlockerOpen: true,
        }));

        try {
          get().layers.save();

          const img =
            get().ctx?.viewer?.canvas.toDataURL("image/jpeg", 90) ?? null;

          const project = get().project;

          console.log({ project, title: project.title });

          await projectApi.projectIdPost({
            id: project.id,
            projectIdGet200Response: {
              includedBaseLayers: get().baseLayers.selectedBaseLayers,
              allAvailableBaseLayers: [],
              description: project.description,
              id: project.id,
              img,
              layers: get().layers.value.map((l) => ({
                id: l.id,
                name: l.name,
                projectModels: l.projectObjects.map<
                  Project["layers"][number]["projectModels"][number]
                >((p) => ({
                  attributes: p.attributes,
                  href: p.href,
                  id: p.id,
                  name: p.name,
                  rotation: p.rotation,
                  scale: p.scale,
                  translation: p.translation,
                })),
                clippingPolygons: l.clippingPolygons.map<
                  Project["layers"][number]["clippingPolygons"][number]
                >((c) => ({
                  affectsTerrain: c.affectsTerrain,
                  id: c.id,
                  name: c.name,
                  points: c.positions,
                })),
              })),
              sasQueryParameters: "",
              title: project.title,
              visualAxes: [],
              startingPoints: get().startingPoints.value.map((s) => ({
                description: s.description,
                endPoint: s.target,
                startPoint: s.position,
                id: s.id,
                img: s.img,
                name: s.name,
              })),
            },
          });

          set((state) => ({
            history: {
              ...state.history,
              value: [
                {
                  clippingPolygons: [],
                  projectObjects: [],
                  selectedObject: null,
                  startingPoints: [],
                  visualAxes: [],
                  project: {
                    description: state.project.description,
                    title: state.project.title,
                  },
                },
              ],
              index: 0,
            },
          }));
        } catch (e) {
          console.error(e);
        }

        set({ savingBlockerOpen: false });
      },
      layers: {
        save() {
          set((state) => {
            const currentClippingPolygons = [...state.clippingPolygons.value];

            const currentProjectObjects = [...state.projectObjects.value];

            const foundLayerIndex = state.layers.value.findIndex(
              (layer) => layer.id === state.layers.selectedLayer
            );

            if (foundLayerIndex === -1) throw new Error("No layer found!");

            const newLayer: Layer = {
              ...state.layers.value[foundLayerIndex],
              clippingPolygons: currentClippingPolygons,
              projectObjects: currentProjectObjects,
            };

            const newLayers = [...state.layers.value];

            newLayers[foundLayerIndex] = newLayer;

            return {
              layers: {
                ...state.layers,
                value: newLayers,
              },
            };
          });
        },
        selectedLayer: project.layers[0].id,
        value: project.layers.map((layer) => ({
          clippingPolygons: layer.clippingPolygons.map<ClippingPolygon>(
            (c) => ({
              affectsTerrain: c.affectsTerrain,
              id: c.id,
              name: c.name,
              positions: c.points,
              type: "CLIPPING_POLYGON",
              visible: true,
            })
          ),
          id: layer.id,
          name: layer.name,
          projectObjects: layer.projectModels.map<ProjectObject>((p) => ({
            attributes: p.attributes,
            href: p.href,
            id: p.id,
            name: p.name,
            type: "PROJECT_OBJECT",
            rotation: p.rotation,
            scale: p.scale,
            translation: p.translation,
            visible: true,
          })),
          type: "LAYER",
        })),
        update(layer) {
          set((state) => {
            const newLayers = [...state.layers.value];

            const newLayerIndex = state.layers.value.findIndex(
              (l) => l.id === layer.id
            );

            if (newLayerIndex === -1) throw new Error("No layer found!");

            newLayers[newLayerIndex] = {
              ...state.layers.value[newLayerIndex],
              ...layer,
            };

            return {
              layers: {
                ...state.layers,
                value: newLayers,
              },
            };
          });
        },
        remove(id) {
          set((state) => {
            const newLayers = state.layers.value.filter(
              (layer) => layer.id !== id
            );

            const selectedLayer = newLayers[0];

            return {
              layers: {
                ...state.layers,
                selectedLayer: selectedLayer.id,
                value: newLayers,
              },
              clippingPolygons: {
                ...state.clippingPolygons,
                value: selectedLayer.clippingPolygons,
              },
              projectObjects: {
                ...state.projectObjects,
                value: selectedLayer.projectObjects,
              },
              selectedObject: null,
              objectRefs: {
                ...state.objectRefs,
                clippingPolygons: {},
                projectObject: {},
              },
            };
          });
        },
        add() {
          const layerNames = new Set(
            get().layers.value.map((layer) => layer.name)
          );

          let layerName = crypto.randomUUID();

          for (let i = 0; i < 4096; i++) {
            const possibleLayerName = `New layer ${i + 1}`;
            if (!layerNames.has(possibleLayerName)) {
              layerName = possibleLayerName;
              break;
            }
          }

          const layer: Layer = {
            clippingPolygons: [],
            id: crypto.randomUUID(),
            name: layerName,
            projectObjects: [],
            type: "LAYER",
          };

          set((state) => {
            return {
              layers: {
                ...state.layers,
                value: [...state.layers.value, layer],
              },
            };
          });

          return layer;
        },
        async changeToLayer(id) {
          set((state) => {
            const currentClippingPolygons = [...state.clippingPolygons.value];

            const currentProjectObjects = [...state.projectObjects.value];

            const foundLayerIndex = state.layers.value.findIndex(
              (layer) => layer.id === state.layers.selectedLayer
            );

            if (foundLayerIndex === -1) throw new Error("No layer found!");

            const newLayer: Layer = {
              ...state.layers.value[foundLayerIndex],
              clippingPolygons: currentClippingPolygons,
              projectObjects: currentProjectObjects,
            };

            const newLayers = [...state.layers.value];

            newLayers[foundLayerIndex] = newLayer;

            const selectedLayer = state.layers.value.find(
              (layer) => layer.id === id
            );

            if (!selectedLayer) throw new Error("No layer to change to found!");

            return {
              layers: {
                ...state.layers,
                selectedLayer: id,
                value: newLayers,
              },
              clippingPolygons: {
                ...state.clippingPolygons,
                value: selectedLayer.clippingPolygons,
              },
              projectObjects: {
                ...state.projectObjects,
                value: selectedLayer.projectObjects,
              },
              selectedObject: null,
              objectRefs: {
                ...state.objectRefs,
                clippingPolygons: {},
                projectObject: {},
              },
            };
          });
        },
      },
      ctx: null,
      setCtx: (ctx) => {
        set({ ctx });
      },
      clippingPolygons: {
        value:
          project.layers[0]?.clippingPolygons.map((c) => ({
            affectsTerrain: c.affectsTerrain,
            id: c.id,
            name: c.name,
            positions: c.points,
            type: "CLIPPING_POLYGON",
            visible: true,
          })) ?? [],
        delete(id) {
          set((state) => {
            const index = state.clippingPolygons.value.findIndex(
              (c) => c.id === id
            );

            if (index === -1) return state;

            const newClippingPolygonValue =
              state.clippingPolygons.value.slice();
            newClippingPolygonValue.splice(index, 1);

            return {
              clippingPolygons: {
                ...state.clippingPolygons,
                value: newClippingPolygonValue,
              },
            };
          });

          get().history.takeSnapshot();
        },
        set(clippingPolgons) {
          set((state) => ({
            clippingPolygons: {
              ...state.clippingPolygons,
              value: clippingPolgons,
            },
          }));

          get().history.takeSnapshot();
        },
        update(clippingPolygon) {
          set((state) => {
            const index = state.clippingPolygons.value.findIndex(
              (c) => c.id === clippingPolygon.id
            );

            if (index === -1) return state;

            const newClippingPolygonValue =
              state.clippingPolygons.value.slice();

            newClippingPolygonValue[index] = {
              ...state.clippingPolygons.value[index],
              ...clippingPolygon,
            };

            return {
              clippingPolygons: {
                ...state.clippingPolygons,
                value: newClippingPolygonValue,
              },
            };
          });

          get().history.takeSnapshot();
        },
        async create() {
          const polygon = await get().tools.pickPolygon();

          set((state) => {
            const newPolygon = {
              id: crypto.randomUUID(),
              name: `Clipping polygon ${state.clippingPolygons.value.length}`,
              positions: polygon,
              affectsTerrain: false,
              type: "CLIPPING_POLYGON",
              visible: true,
            } as const;

            return {
              selectedObject: newPolygon,
              clippingPolygons: {
                ...state.clippingPolygons,
                value: [...state.clippingPolygons.value, newPolygon],
              },
            };
          });

          get().history.takeSnapshot();
        },
      },
      startingPoints: {
        helpers: {
          async takeScreenshot(startingPoint) {
            const image = await get().tools.takeScreenshot(startingPoint);

            if (!image) return;

            get().startingPoints.update({ id: startingPoint.id, img: image });
          },
          flyTo: (startingPoint) => {
            const ctx = get().ctx;

            if (!ctx) throw new Error("Context is undefined!");

            const { camera, viewer } = ctx;

            if (!camera) throw new Error("Camera is undefined!");
            if (!viewer) throw new Error("Viewer is undefined!");

            const destination = new Cartesian3(
              startingPoint.position.x,
              startingPoint.position.y,
              startingPoint.position.z
            );

            const up =
              viewer.scene.globe.ellipsoid.geodeticSurfaceNormal(destination);

            const target = new Cartesian3(
              startingPoint.target.x,
              startingPoint.target.y,
              startingPoint.target.z
            );

            const direction = new Cartesian3();

            Cartesian3.subtract(target, destination, direction);
            Cartesian3.normalize(direction, direction);

            camera.cancelFlight();

            camera.setView({
              destination,
              orientation: {
                direction,
                up,
              },
            });
          },
        },
        value: project.startingPoints.map((s) => ({
          id: s.id,
          img: s.img,
          name: s.name,
          position: s.startPoint,
          target: s.endPoint,
          description: s.description,
          type: "STARTING_POINT",
          visible: true,
        })),
        async create() {
          const origin = await get().tools.pickPoint();
          const target = await get().tools.pickPoint();

          const newStartingPoint: StartingPoint = {
            id: crypto.randomUUID(),
            name: "Starting Point " + get().startingPoints.value.length,
            position: {
              ...origin,
              z: origin.z + 1.7,
            },
            img: "",
            description: "",
            type: "STARTING_POINT",
            target: {
              ...target,
              z: target.z + 1.7,
            },
            visible: true,
          };

          newStartingPoint.img =
            (await get().tools.takeScreenshot(newStartingPoint)) ?? "";

          set((state) => {
            if (!state.ctx?.camera || !state.ctx.viewer) return {};

            return {
              selectedObject: {
                type: "STARTING_POINT",
                id: newStartingPoint.id,
              },
              startingPoints: {
                ...state.startingPoints,
                value: [...state.startingPoints.value, newStartingPoint],
              },
            };
          });

          get().history.takeSnapshot();
        },
        delete(id) {
          set((state) => {
            const index = state.startingPoints.value.findIndex(
              (c) => c.id === id
            );

            if (index === -1) return state;

            const newStartingPointsValue = state.startingPoints.value.slice();
            newStartingPointsValue.splice(index, 1);

            return {
              startingPoints: {
                ...state.startingPoints,
                value: newStartingPointsValue,
              },
            };
          });

          get().history.takeSnapshot();
        },
        set(startingPoints) {
          set((state) => ({
            startingPoints: {
              ...state.startingPoints,
              value: startingPoints,
            },
          }));

          get().history.takeSnapshot();
        },
        update(startingPoint) {
          set((state) => {
            const index = state.startingPoints.value.findIndex(
              (c) => c.id === startingPoint.id
            );

            if (index === -1) return state;

            const newStartingPointsValue = state.startingPoints.value.slice();

            newStartingPointsValue[index] = {
              ...state.startingPoints.value[index],
              ...startingPoint,
            };

            return {
              startingPoints: {
                ...state.startingPoints,
                value: newStartingPointsValue,
              },
            };
          });

          get().history.takeSnapshot();
        },
      },
      projectObjects: {
        async create() {},
        set(projectObjects) {
          set((state) => ({
            projectObjects: {
              ...state.projectObjects,
              value: projectObjects,
            },
          }));
        },
        _importerOpen: false,
        toggleVisibility(id) {
          set((state) => {
            const newValue = state.projectObjects.value.slice();

            const foundProjectObjectIndex = newValue.findIndex(
              (p) => p.id === id
            );

            console.log(foundProjectObjectIndex);

            if (foundProjectObjectIndex === -1) return {};

            newValue[foundProjectObjectIndex] = {
              ...newValue[foundProjectObjectIndex],
              visible: !newValue[foundProjectObjectIndex].visible,
            };

            return {
              projectObjects: {
                ...state.projectObjects,
                value: newValue,
              },
            };
          });
        },
        toggleImport() {
          set((state) => ({
            projectObjects: {
              ...state.projectObjects,
              _importerOpen: !state.projectObjects._importerOpen,
            },
          }));
        },
        delete(id) {
          set((state) => {
            const index = state.projectObjects.value.findIndex(
              (c) => c.id === id
            );

            if (index === -1) return state;

            const newProjectObjectsValue = state.projectObjects.value.slice();
            newProjectObjectsValue.splice(index, 1);

            return {
              projectObjects: {
                ...state.projectObjects,
                value: newProjectObjectsValue,
              },
            };
          });

          get().history.takeSnapshot();
        },
        update(projectObject) {
          set((state) => {
            const index = state.projectObjects.value.findIndex(
              (c) => c.id === projectObject.id
            );

            if (index === -1) return state;

            const newProjectObjectsValue = state.projectObjects.value.slice();

            newProjectObjectsValue[index] = {
              ...state.projectObjects.value[index],
              ...projectObject,
            };

            return {
              projectObjects: {
                ...state.projectObjects,
                value: newProjectObjectsValue,
              },
            };
          });

          get().history.takeSnapshot();
        },
        value:
          project.layers[0]?.projectModels.map((p) => ({
            attributes: p.attributes,
            id: p.id,
            name: p.name,
            href: p.href,
            rotation: p.rotation,
            scale: p.scale,
            translation: p.translation,
            type: "PROJECT_OBJECT",
            visible: true,
          })) ?? [],
      },
      tools: {
        screenshotButtonPressedResolve() {},
        screenshotButtonPressedReject() {},
        screenshotDialogOpen: false,
        async takeScreenshot(directedPoint: {
          position: { x: number; y: number; z: number };
          target: { x: number; y: number; z: number };
        }) {
          const viewer = get().ctx?.viewer;

          const resiumContainer = document.getElementsByClassName(
            "cesium-viewer"
          )[0].parentNode as HTMLDivElement;

          if (!viewer) return null;

          resiumContainer.style.aspectRatio = "16/9";
          resiumContainer.style.height = "";

          const destination = new Cartesian3(
            directedPoint.position.x,
            directedPoint.position.y,
            directedPoint.position.z
          );

          const up =
            viewer.scene.globe.ellipsoid.geodeticSurfaceNormal(destination);

          const target = new Cartesian3(
            directedPoint.target.x,
            directedPoint.target.y,
            directedPoint.target.z
          );

          const direction = new Cartesian3();

          Cartesian3.subtract(target, destination, direction);
          Cartesian3.normalize(direction, direction);

          viewer.camera.completeFlight();

          viewer.camera.setView({
            destination,
            orientation: {
              direction,
              up,
            },
          });

          let promise: Promise<void>;

          set((state) => {
            let resolve: () => void;
            let reject: () => void;
            promise = new Promise<void>((res, rej) => {
              resolve = res;
              reject = rej;
            });

            return {
              tools: {
                ...state.tools,
                screenshotDialogOpen: true,
                screenshotButtonPressedResolve: resolve!,
                screenshotButtonPressedReject: reject!,
              },
            };
          });

          await promise!;

          viewer.scene.render();

          const image = viewer.canvas.toDataURL("image/jpeg", 0.9);

          set((state) => ({
            tools: {
              ...state.tools,
              screenshotButtonPressedReject: () => {},
              screenshotButtonPressedResolve: () => {},
              screenshotDialogOpen: false,
            },
          }));

          resiumContainer.style.aspectRatio = "";
          resiumContainer.style.height = "100%";

          return image;
        },
        async pickPolygon() {
          throw new Error("Not initialized!");
        },
        async pickPoint() {
          throw new Error("Not initialized!");
        },
        safeCameraZoneVisible: false,
        toggleSafeCameraZoneVisibility() {
          set((state) => ({
            tools: {
              ...state.tools,
              safeCameraZoneVisible: !state.tools.safeCameraZoneVisible,
            },
          }));
        },
        shadowVisible: false,
        toggleShadowVisibility() {
          set((state) => {
            const ctx = get().ctx;

            if (!ctx) throw new Error("Context is undefined!");

            const viewer = ctx.viewer;

            if (!viewer) throw new Error("Viewer is undefined!");

            if (state.tools.shadowVisible) {
              viewer.shadows = false;
            } else {
              viewer.shadows = true;
              viewer.shadowMap.softShadows = true;
              viewer.shadowMap.size = 8192;

              viewer.scene.fog.enabled = true;
              viewer.scene.fog.density = 0.0015;
              viewer.scene.fog.visualDensityScalar = 0.7;
              viewer.scene.fog.minimumBrightness = 0.1;
              viewer.scene.fog.screenSpaceErrorFactor = 4;
              viewer.scene.fog.heightScalar = 0.0005;
              viewer.scene.fog.heightFalloff = 0.6;
              viewer.scene.fog.maxHeight = 800000;
            }

            viewer.scene.requestRender();

            return {
              tools: {
                ...state.tools,
                shadowVisible: !state.tools.shadowVisible,
              },
            };
          });
        },
      },
      updateTools: (tools = {}) => {
        set((state) => ({
          tools: {
            ...state.tools,
            ...tools,
          },
        }));
      },
      selectedObject: null,
      setSelectedObject(selectedObject) {
        set(() => ({
          selectedObject: selectedObject ? { ...selectedObject } : null,
        }));
      },
      history: {
        value: [
          {
            clippingPolygons: [],
            projectObjects: [],
            selectedObject: null,
            startingPoints: [],
            visualAxes: [],
            project: {
              description: project.description,
              title: project.title,
            },
          },
        ],
        index: 0,
        takeSnapshot() {
          const {
            history,
            clippingPolygons,
            startingPoints,
            projectObjects,
            selectedObject,
          } = get();

          // Trim any redo entries if not at the end
          let newHistory = history.value.slice();
          if (history.index !== history.value.length - 1) {
            newHistory = history.value.slice(0, history.index + 1);
          }

          // Create a shallow snapshot
          const entry = {
            clippingPolygons: clippingPolygons.value.slice(),
            startingPoints: startingPoints.value.slice(),
            projectObjects: projectObjects.value.slice(),
            selectedObject: selectedObject ? { ...selectedObject } : null,
            project: {
              title: project.title,
              description: project.description,
            },
          };

          newHistory = [...newHistory, entry];
          const newIndex = newHistory.length - 1;

          // Update history slice preserving methods
          set((state) => ({
            history: {
              ...state.history,
              value: newHistory,
              index: newIndex,
            },
          }));
        },
        initialize() {
          set((state) => ({
            history: {
              ...state.history,
              value: [
                {
                  clippingPolygons: state.clippingPolygons.value.map((s) => ({
                    ...s,
                  })),
                  project: {
                    description: state.project.description,
                    title: state.project.title,
                  },
                  projectObjects: state.projectObjects.value.map((s) => ({
                    ...s,
                  })),
                  selectedObject: state.selectedObject,
                  startingPoints: state.startingPoints.value.map((s) => ({
                    ...s,
                  })),
                },
              ],
            },
          }));
        },
        undo() {
          const state = get();
          const { history } = state;
          const prevIndex = history.index - 1;
          if (prevIndex < 0) return;

          const entry = history.value[prevIndex];
          if (!entry) return;

          set((state) => ({
            clippingPolygons: {
              ...state.clippingPolygons,
              value: entry.clippingPolygons,
            },
            startingPoints: {
              ...state.startingPoints,
              value: entry.startingPoints,
            },
            projectObjects: {
              ...state.projectObjects,
              value: entry.projectObjects,
            },
            selectedObject: entry.selectedObject,
            history: {
              ...state.history,
              index: prevIndex,
            },
          }));
        },

        redo() {
          const state = get();
          const { history } = state;
          const nextIndex = history.index + 1;
          if (nextIndex >= history.value.length) return;

          const entry = history.value[nextIndex];
          if (!entry) return;

          set((state) => ({
            clippingPolygons: {
              ...state.clippingPolygons,
              value: entry.clippingPolygons,
            },
            startingPoints: {
              ...state.startingPoints,
              value: entry.startingPoints,
            },
            projectObjects: {
              ...state.projectObjects,
              value: entry.projectObjects,
            },
            selectedObject: entry.selectedObject,
            history: {
              ...state.history,
              index: nextIndex,
            },
          }));
        },
      },
      objectRefs: {
        clippingPolygons: {},
        projectObject: {},
        startingPoints: {},
        visualAxes: {},
        tile3Ds: {},
      },
      registerObjectRef(args) {
        set((state) => {
          switch (args.type) {
            case "CLIPPING_POLYGON":
              return {
                objectRefs: {
                  ...state.objectRefs,
                  clippingPolygons: {
                    [args.id]: args.objectRef,
                  },
                },
              };
            case "PROJECT_OBJECT":
              return {
                objectRefs: {
                  ...state.objectRefs,
                  projectObject: {
                    [args.id]: args.objectRef,
                  },
                },
              };
            case "STARTING_POINT":
              return {
                objectRefs: {
                  ...state.objectRefs,
                  startingPoints: {
                    [args.id]: args.objectRef,
                  },
                },
              };
          }
        });
      },
      unregisterObjectRef(args) {
        set((state) => {
          switch (args.type) {
            case "CLIPPING_POLYGON": {
              const newClippingPolygonRefs = {
                ...state.objectRefs.clippingPolygons,
              };

              delete newClippingPolygonRefs[args.id];

              return {
                objectRefs: {
                  ...state.objectRefs,
                  clippingPolygons: newClippingPolygonRefs,
                },
              };
            }
            case "PROJECT_OBJECT": {
              const newProjectObjectRefs = {
                ...state.objectRefs.projectObject,
              };

              delete newProjectObjectRefs[args.id];

              return {
                objectRefs: {
                  ...state.objectRefs,
                  projectObject: newProjectObjectRefs,
                },
              };
            }
            case "STARTING_POINT": {
              const newStartingPointRefs = {
                ...state.objectRefs.startingPoints,
              };

              delete newStartingPointRefs[args.id];

              return {
                objectRefs: {
                  ...state.objectRefs,
                  startingPoints: newStartingPointRefs,
                },
              };
            }
          }
        });
      },
    }));

    store.getState().history.initialize();

    return store;
  });

  return (
    <ViewerContext.Provider value={viewerContext}>
      {children}
    </ViewerContext.Provider>
  );
};

export const useViewerStore = ((selector?: any) => {
  const viewerContext = useContext(ViewerContext);

  if (!viewerContext) throw new Error("No viewercontext provided!");

  if (selector) return viewerContext(selector);

  return viewerContext(selector);
}) as UseBoundStore<StoreApi<ViewerStoreType>>;
