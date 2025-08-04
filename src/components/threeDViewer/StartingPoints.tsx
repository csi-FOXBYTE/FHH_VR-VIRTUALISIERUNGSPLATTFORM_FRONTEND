import { useIsScreenshotDialogOpen } from "./ScreenshotDialog";
import StartingPoint from "./StartingPoint";
import { useViewerStore } from "./ViewerProvider";

export default function StartingPoints() {
  const startingPoints = useViewerStore((state) => state.startingPoints.value);

  const isScreenshotDialogOpen = useIsScreenshotDialogOpen();

  if (isScreenshotDialogOpen) return null;

  return startingPoints.map((startingPoint) => (
    <StartingPoint key={startingPoint.id} startingPoint={startingPoint} />
  ));
}
