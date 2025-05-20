"use client";

import {
  Camera,
  CameraFlyTo,
  Cesium3DTileset,
  Cesium3DTilesetProps,
  Entity,
  ImageryLayer,
  PolygonGraphics,
  Viewer,
} from "resium";
import * as Cesium from "cesium";
import { useEffect, useMemo, useRef } from "react";
import { useViewerStore } from "./ViewerProvider";
import ProjectObjects from "./ProjectObjects";
import ToolsProvider from "./Tools";
import StartingPoints from "./StartingPoints";

const terrain = Cesium.CesiumTerrainProvider.fromUrl(
  "https://fhhvrshare.blob.core.windows.net/hamburg/terrain",
  {
    requestVertexNormals: true,
  }
);

const imageryProvider = new Cesium.OpenStreetMapImageryProvider({
  url: "https://tile.openstreetmap.org/",
  fileExtension: "png",
});

export default function ResiumViewer() {
  const viewerRef = useRef<Cesium.Viewer>(null);

  const cameraRef = useRef<Cesium.Camera>(null);

  const viewerStore = useViewerStore();

  const handleClick: Cesium3DTilesetProps["onClick"] = (_m, target) => {
    const result: Record<string, unknown> = {};

    for (const propertyId of target.getPropertyIds()) {
      result[propertyId] = target.getProperty(propertyId);
    }

    viewerStore.updateObjectInfo({ info: result, object: target });
  };

  const builtClippingPolygons = useMemo(() => {
    return new Array(6).fill(0).map(() => {
      if (viewerStore.clippingPolygons.length === 0) return undefined;
      const collection = new Cesium.ClippingPolygonCollection({
        enabled: true,
        inverse: false,
        polygons: viewerStore.clippingPolygons.map(
          (clippingPolygon) =>
            new Cesium.ClippingPolygon({
              positions: clippingPolygon.positions.map(
                (p) => new Cesium.Cartesian3(p.x, p.y, p.z)
              ),
            })
        ),
      });

      return collection;
    });
  }, [viewerStore.clippingPolygons]);

  const safeCameraZoneVisible = useViewerStore(
    (state) => state.tools.safeCameraZoneVisible
  );

  useEffect(() => {});

  return (
    <Viewer
      ref={(ref) => {
        {/** @ts-expect-error wrong types */}
        viewerRef.current = ref?.cesiumElement ?? null;
        if (viewerRef.current) {
          const viewer = viewerRef.current;
          viewer.shadowMap.softShadows = true;
          viewer.shadowMap.size = 8192;

          viewer.scene.globe.depthTestAgainstTerrain = true;

          viewer.scene.fog.enabled = true;
          viewer.scene.fog.density = 0.0015;
          viewer.scene.fog.visualDensityScalar = 0.7;
          viewer.scene.fog.minimumBrightness = 0.1;
          viewer.scene.fog.screenSpaceErrorFactor = 4;
          viewer.scene.fog.heightScalar = 0.0005;
          viewer.scene.fog.heightFalloff = 0.6;
          viewer.scene.fog.maxHeight = 800000;
        }
      }}
      style={{
        width: "100%",
        height: safeCameraZoneVisible ? undefined : "100%",
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        left: 0,
        aspectRatio: safeCameraZoneVisible ? 1.7777777777777778 : undefined,
        maxWidth: "100%",
        maxHeight: "100%",
        imageRendering: "pixelated",
      }}
      geocoder={false}
      baseLayerPicker={false}
      baseLayer={false}
      shadows={true}
      terrainShadows={Cesium.ShadowMode.ENABLED}
      homeButton={false}
      vrButton={false}
      animation={false}
      navigationHelpButton={false}
      fullscreenButton={false}
      terrainProvider={terrain}
      timeline={false}
      scene3DOnly
      requestRenderMode
      targetFrameRate={30}
      infoBox={false}
    >
      <Camera
        ref={(ref) => {
          {/** @ts-expect-error wrong types */}
          cameraRef.current = ref?.cesiumElement ?? null;
          console.log(cameraRef.current?.position.toString());
        }}
      />
      <ProjectObjects />
      <StartingPoints />
      <ToolsProvider />
      <CameraFlyTo
        once
        duration={0}
        destination={
          new Cesium.Cartesian3(
            3764595.8724393756,
            664200.4499076013,
            5144292.106228131
          )
        }
      />
      {viewerStore.clippingPolygons
        .filter((p) => p.visible)
        .map((clippingPolygon) => (
          <Entity key={clippingPolygon.id}>
            <PolygonGraphics
              extrudedHeight={100}
              hierarchy={{
                holes: [],
                positions: clippingPolygon.positions.map(
                  (p) => new Cesium.Cartesian3(p.x, p.y, p.z)
                ),
                isConstant: false,
              }}
              outline
              outlineColor={new Cesium.Color(1, 1, 0, 0.6)}
              material={new Cesium.Color(1, 1, 0, 0.5)}
              fill
            />
          </Entity>
        ))}
      <ImageryLayer imageryProvider={imageryProvider} />
      <Cesium3DTileset
        clippingPolygons={builtClippingPolygons?.[0]}
        onClick={handleClick}
        url="https://fhhvrshare.blob.core.windows.net/hamburg/3dtiles/area1/tileset.json"
      />
      <Cesium3DTileset
        clippingPolygons={builtClippingPolygons?.[1]}
        onClick={handleClick}
        url="https://fhhvrshare.blob.core.windows.net/hamburg/3dtiles/area2/tileset.json"
      />
      <Cesium3DTileset
        clippingPolygons={builtClippingPolygons?.[2]}
        onClick={handleClick}
        url="https://fhhvrshare.blob.core.windows.net/hamburg/3dtiles/area3/tileset.json"
      />
      <Cesium3DTileset
        clippingPolygons={builtClippingPolygons?.[3]}
        onClick={handleClick}
        url="https://fhhvrshare.blob.core.windows.net/hamburg/3dtiles/area4/tileset.json"
      />
      <Cesium3DTileset
        clippingPolygons={builtClippingPolygons?.[4]}
        onClick={handleClick}
        url="https://fhhvrshare.blob.core.windows.net/hamburg/3dtiles/area5/tileset.json"
      />
      <Cesium3DTileset
        clippingPolygons={builtClippingPolygons?.[5]}
        onClick={handleClick}
        url="https://fhhvrshare.blob.core.windows.net/hamburg/3dtiles/trees/tileset.json"
      />
    </Viewer>
  );
}
