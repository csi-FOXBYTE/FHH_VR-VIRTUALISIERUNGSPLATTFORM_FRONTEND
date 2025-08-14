import { styled } from "@mui/material";
import {
  Cartesian3,
  Matrix3,
  Matrix4,
  Quaternion,
  SceneTransforms,
  Transforms
} from "cesium";
import { useLayoutEffect, useMemo, useRef } from "react";
import { useCesium } from "resium";
import { useViewerStore } from "./ViewerProvider";

export default function CesiumGizmo() {
  const selectedObject = useViewerStore((state) => state.selectedObject);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const objectRefs = useViewerStore((state) => state.objectRefs);

  const modelMatrix =
    objectRefs.projectObject[selectedObject?.id ?? ""]?.modelMatrix;

  const { earthToLocal } = useMemo(() => {
    const origin = Matrix4.getTranslation(
      modelMatrix ?? new Matrix4(),
      new Cartesian3()
    );

    const m = Transforms.eastNorthUpToFixedFrame(
      new Cartesian3(origin.x, origin.y, origin.z)
    );
    const R = Matrix4.getRotation(m, new Matrix3());
    const localToEarth = Quaternion.fromRotationMatrix(R, new Quaternion());
    const earthToLocal = Quaternion.inverse(localToEarth, new Quaternion());
    return { earthToLocal, localToEarth };
  }, [modelMatrix]);

  const { viewer } = useCesium();

  useLayoutEffect(() => {
    if (!viewer) return;

    const handler = () => {
      if (
        !modelMatrix ||
        wrapperRef.current === null ||
        rootRef.current === null
      )
        return;

      const translation = Matrix4.getTranslation(modelMatrix, new Cartesian3());

      // 2) Grab the camera’s viewMatrix (world → camera)
      const viewMat = viewer.camera.viewMatrix.clone();

      // 3) Extract just the 3×3 rotation from that 4×4
      const rot3old = new Matrix3();
      Matrix4.getRotation(viewMat, rot3old); // ✔ gets the upper‐left 3×3 of viewMat :contentReference[oaicite:1]{index=1}

      const q = Quaternion.fromRotationMatrix(rot3old);
      const newQ = Quaternion.multiply(q, earthToLocal, new Quaternion());

      const rot3 = Matrix3.fromQuaternion(newQ);

      // 4) Build a tiny “correction” so that Cesium’s camera‐space (Y up, Z into screen)
      //    becomes CSS’s axis‐space (Y down, Z out of screen). In other words, flip Y and Z:
      //    correction = diag(1, –1, –1)
      const correction = new Matrix3(1, 0, 0, 0, -1, 0, 0, 0, -1);

      // 5) Multiply correction × rot3 → “finalRot”
      const finalRot = new Matrix3();
      Matrix3.multiply(correction, rot3, finalRot); // ✔ multiply two Matrix3’s :contentReference[oaicite:2]{index=2}

      // 6) Now stuff finalRot into a column-major 4×4 for CSS. Cesium’s Matrix3.elements is already column-major:
      //    [ m00, m10, m20,  m01, m11, m21,  m02, m12, m22 ]
      //    We want a 4×4 like:
      //      [ m00  m01  m02  0 ]
      //      [ m10  m11  m12  0 ]
      //      [ m20  m21  m22  0 ]
      //      [  0    0    0   1 ]
      //    In column‐major order that becomes:
      //    [ e[0], e[1], e[2],   0,
      //      e[3], e[4], e[5],   0,
      //      e[6], e[7], e[8],   0,
      //        0,    0,    0,   1 ]
      const e = Array.from(finalRot);
      const cssMatrixArray = [
        e[0],
        e[1],
        e[2],
        0,
        e[3],
        e[4],
        e[5],
        0,
        e[6],
        e[7],
        e[8],
        0,
        0,
        0,
        0,
        1,
      ];

      // 7) Apply that as the CSS “matrix3d” transform on the gizmo’s root
      rootRef.current.style.transform = `matrix3d(${cssMatrixArray.join(",")})`;

      const windowCoords = SceneTransforms.worldToWindowCoordinates(
        viewer.scene,
        translation
      );

      if (!windowCoords) return;

      wrapperRef.current.style.left = windowCoords.x - 100 + "px";
      wrapperRef.current.style.top = windowCoords.y - 100 + "px";
      rootRef.current.style.transform = `matrix3d(${cssMatrixArray.join(
        ", "
      )})`;
    };

    viewer.clock.onTick.addEventListener(handler);

    return () => {
      viewer.clock.onTick.removeEventListener(handler);
    };
  }, [earthToLocal, modelMatrix, viewer]);

  if (!modelMatrix) return null;

  return (
    <GizmoContainer ref={wrapperRef}>
      <GizmoRoot ref={rootRef}>
        {/* X-axis (red) */}
        <Axis axis="x">
          <Line axis="x" />
          <ArrowHead axis="x" />
        </Axis>

        {/* Y-axis (green) */}
        <Axis axis="y">
          <Line axis="y" />
          <ArrowHead axis="y" />
        </Axis>

        {/* Z-axis (blue) */}
        <Axis axis="z">
          <Line axis="z" />
          <ArrowHead axis="z" />
        </Axis>
      </GizmoRoot>
    </GizmoContainer>
  );
}

// ---------------------------------------------------
// Styled components for the gizmo
// ---------------------------------------------------

// Container that sets up the 3D perspective
const GizmoContainer = styled("div")`
  width: 200px;
  height: 200px;
  perspective: 600px;
  position: absolute;
  pointer-events: none;
`;

// The gizmo itself: preserve-3d + an initial rotation so we can see all three axes
const GizmoRoot = styled("div")`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
`;

// Common styling for each axis container
interface AxisProps {
  axis: "x" | "y" | "z";
}
const Axis = styled("div")<AxisProps>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: 0 0;
  transform-style: preserve-3d;
  pointer-events: all;

  /* Per-axis rotation */
  ${({ axis }) =>
    axis === "x"
      ? "" /* no extra rotation for X-axis */
      : axis === "y"
      ? "transform: rotateZ(-90deg);"
      : "transform: rotateY(90deg);"}
`;

// The “shaft” of each arrow
const Line = styled("div")<AxisProps>`
  position: absolute;
  left: 0;
  top: -4px;
  width: 120px;
  height: 8px;
  background-color: ${({ axis }) =>
    axis === "x" ? "red" : axis === "y" ? "green" : "blue"};
`;

// The “arrowhead” is a simple CSS triangle at the shaft’s far end
const ArrowHead = styled("div")<AxisProps>`
  position: absolute;
  left: 120px;
  top: -12px;
  width: 0;
  height: 0;
  border-left: 24px solid
    ${({ axis }) => (axis === "x" ? "red" : axis === "y" ? "green" : "blue")};
  border-top: 12px solid transparent;
  border-bottom: 12px solid transparent;
`;
