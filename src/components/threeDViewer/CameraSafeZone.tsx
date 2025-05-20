import { useRef } from "react";
import { useViewerStore } from "./ViewerProvider";

export default function CameraSafeZone() {
  const visible = useViewerStore((state) => state.tools.safeCameraZoneVisible);

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease",
        display: "flex",
        flexDirection: "column",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <div
        style={{
          flex: 1,
          background: "rgba(0, 0, 0, 0.25)",
          backdropFilter: "blur(2px)",
        }}
      />
      <div
        style={{
          aspectRatio: 1.77777777778,
          maxWidth: "100%",
          maxHeight: "100%",
          top: 0,
          left: 0,
        }}
      ></div>
      <div
        style={{
          flex: 1,
          background: "rgba(0, 0, 0, 0.25)",
          backdropFilter: "blur(2px)",
        }}
      />
    </div>
  );
}
