import StartingPoint from "./StartingPoint";
import {
  useViewerStore
} from "./ViewerProvider";

export default function StartingPoints() {
  const startingPoints = useViewerStore((state) => state.startingPoints.value);

  return startingPoints.map((startingPoint) => (
    <StartingPoint key={startingPoint.id} startingPoint={startingPoint} />
  ));
}

