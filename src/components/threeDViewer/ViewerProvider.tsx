import { Cesium3DTileFeature, Matrix4 } from "cesium";
import { create } from "zustand";

export type ClippingPolygon = {
  positions: { x: number; y: number; z: number }[];
  visible: boolean;
  name: string;
  id: string;
};

export type ProjectObject = {
  fileContent: Buffer;
  name: string;
  modelMatrix: Matrix4;
  metaData: Record<string, string>;
  id: string;
  visible: boolean;
};

export type StartingPoint = {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
};

export type PointOfInterest = {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
  direction: { x: number; y: number; z: number };
};

type ViewerStoreType = {
  tools: {
    safeCameraZoneVisible: boolean;
    toggleSafeCameraZoneVisibility: () => void;
    pickPoint: () => Promise<{ x: number; y: number; z: number }>;
    pickPolygon: () => Promise<{ x: number; y: number; z: number }[]>;
  };
  updateTools: (tools: Partial<ViewerStoreType["tools"]>) => void;

  clippingPolygons: ClippingPolygon[];
  createClippingPolygon: () => Promise<void>;
  updateClippingPolygons: (clippingPolygons: ClippingPolygon[]) => void;

  projectObjects: ProjectObject[];
  setProjectObjects: (projectObjects: ProjectObject[]) => void;
  createProjectObject: () => Promise<void>;

  startingPoints: StartingPoint[];
  setStartingPoints: (startingPoints: StartingPoint[]) => void;
  createStartingPoint: () => Promise<void>;

  pointOfInterests: PointOfInterest[];
  setPointOfInterests: (pointOfInterests: PointOfInterest[]) => void;
  createPointOfInterest: () => Promise<void>;

  objectInfo: {
    info: Record<string, unknown>;
    object: Cesium3DTileFeature;
  } | null;
  updateObjectInfo: (
    objectInfo: Partial<ViewerStoreType["objectInfo"]>
  ) => void;

  camera: {
    switchToOrthographic: () => void;
    switchToPerspective: () => void;
    isPerspective: boolean;
  };
  updateCamera: (camera: Partial<ViewerStoreType["camera"]>) => void;
};

export const useViewerStore = create<ViewerStoreType>((set, get) => ({
  clippingPolygons: [],
  async createClippingPolygon() {
    const _this = get();

    const polygon = await _this.tools.pickPolygon();

    set(() => ({
      clippingPolygons: [
        ..._this.clippingPolygons,
        {
          id: crypto.randomUUID(),
          name: "New poly!",
          positions: polygon,
          visible: true,
        },
      ],
    }));
  },
  updateClippingPolygons(clippingPolygons) {
    set(() => ({
      clippingPolygons,
    }));
  },
  objectInfo: null,
  updateObjectInfo(objectInfo) {
    /** @ts-expect-error wrong types */
    set((state) => ({
      objectInfo:
        objectInfo !== null
          ? {
              ...state.objectInfo,
              ...objectInfo,
            }
          : null,
    }));
  },
  camera: {
    switchToOrthographic: () => {},
    switchToPerspective() {},
    isPerspective: true,
  },
  updateCamera: (camera = {}) =>
    set((state) => ({
      camera: {
        ...state.camera,
        ...camera,
      },
    })),
  pointOfInterests: [],
  setPointOfInterests(pointOfInterests) {
    set((state) => ({
      ...state,
      pointOfInterests,
    }));
  },
  async createPointOfInterest() {
    throw new Error("Not implemented yet!");
  },
  startingPoints: [],
  setStartingPoints(startingPoints) {
    set((state) => ({
      ...state,
      startingPoints,
    }));
  },
  async createStartingPoint() {
    const _this = get();

    const point = await _this.tools.pickPoint();

    _this.setStartingPoints([
      ..._this.startingPoints,
      {
        id: crypto.randomUUID(),
        name: "Starting Point " + _this.startingPoints.length,
        position: point,
      },
    ]);
  },
  tools: {
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
  },
  updateTools: (tools = {}) => {
    set((state) => ({
      tools: {
        ...state.tools,
        ...tools,
      },
    }));
  },
  projectObjects: [],
  setProjectObjects: (projectObjects) => {
    set((state) => ({
      ...state,
      projectObjects,
    }));
  },
  async createProjectObject() {},
}));
