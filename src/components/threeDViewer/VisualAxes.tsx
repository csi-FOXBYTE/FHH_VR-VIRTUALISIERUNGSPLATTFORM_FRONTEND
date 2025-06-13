import { useViewerStore } from "./ViewerProvider";
import VisualAxis from "./VisualAxis";

export default function VisualAxes() {
  const visualAxes = useViewerStore((state) => state.visualAxes.value);

  return visualAxes.map((visualAxis) => <VisualAxis visualAxis={visualAxis} key={visualAxis.id} />);
}
