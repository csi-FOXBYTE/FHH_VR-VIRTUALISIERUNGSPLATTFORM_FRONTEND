import { Billboard, BillboardCollection } from "resium";
import { useViewerStore } from "./ViewerProvider";
import * as Cesium from "cesium";

export default function StartingPoints() {
  const startingPoints = useViewerStore((state) => state.startingPoints);

  return (
    <BillboardCollection>
      {startingPoints.map((startingPoint) => (
        <Billboard
          key={startingPoint.id}
          id={startingPoint.id}
          image="/location.png"
          width={64}
          height={64}
          onClick={() => console.log(startingPoint)}
          disableDepthTestDistance={Number.POSITIVE_INFINITY}
          position={
            new Cesium.Cartesian3(
              startingPoint.position.x,
              startingPoint.position.y,
              startingPoint.position.z
            )
          }
        />
      ))}
    </BillboardCollection>
  );
}
