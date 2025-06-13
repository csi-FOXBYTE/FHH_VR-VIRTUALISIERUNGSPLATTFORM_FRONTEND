import ClippingPolygon from "./ClippingPolygon";
import { useViewerStore } from "./ViewerProvider";

export default function ClippingPolygons() {
  const clippingPolygons = useViewerStore(
    (state) => state.clippingPolygons.value
  );

  return clippingPolygons
    .filter((p) => p.visible)
    .map((clippingPolygon) => (
      <ClippingPolygon
        key={clippingPolygon.id}
        clippingPolygon={clippingPolygon}
      />
    ));
}
