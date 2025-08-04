import { useEffect } from "react";
import { useViewerStore } from "./ViewerProvider";

export function PreventClosing() {
  const history = useViewerStore((state) => state.history);

  useEffect(() => {
    if (window === undefined) return;

    if (document.title.endsWith("*")) document.title = document.title.substring(0, document.title.length - 1);

    if (history.index === 0) return;

    document.title = document.title + "*";

    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handler, true);

    return () => window.removeEventListener("beforeunload", handler, true);
  }, [history.index]);

  return null;
}
