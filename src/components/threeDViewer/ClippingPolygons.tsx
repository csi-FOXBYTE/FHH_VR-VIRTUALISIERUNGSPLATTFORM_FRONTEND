import { useEffect } from "react";
import ClippingPolygon from "./ClippingPolygon";
import { useViewerStore } from "./ViewerProvider";
import { useCesium } from "resium";
import * as Cesium from "cesium";

export default function ClippingPolygons() {
  const { viewer } = useCesium();

  const clippingPolygons = useViewerStore(
    (state) => state.clippingPolygons.value
  );

  useEffect(() => {
    if (!viewer) return;

    if (!viewer.scene.globe.clippingPolygons) viewer.scene.globe.clippingPolygons = new Cesium.ClippingPolygonCollection();

    viewer.scene.globe.clippingPolygons.removeAll();

    clippingPolygons.forEach((clippingPolygon) =>
      viewer.scene.globe.clippingPolygons.add(
        new Cesium.ClippingPolygon({
          positions: clippingPolygon.positions.map(
            (p) => new Cesium.Cartesian3(p.x, p.y, p.z)
          ),
        })
      )
    );
  }, [clippingPolygons, viewer]);

  return clippingPolygons
    .filter((p) => p.visible)
    .map((clippingPolygon) => (
      <ClippingPolygon
        key={clippingPolygon.id}
        clippingPolygon={clippingPolygon}
      />
    ));
}
