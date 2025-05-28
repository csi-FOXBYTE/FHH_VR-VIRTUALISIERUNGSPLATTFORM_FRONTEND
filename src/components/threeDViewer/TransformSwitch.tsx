import { Divider, Grid2 } from "@mui/material";
import {
  Cartesian3,
  ConstantPositionProperty,
  Matrix4,
  Quaternion,
} from "cesium";
import { useCallback, useEffect, useRef } from "react";
import { useCesium } from "resium";
import {
  createModelMatrixFromModelMatrixAndOptionalTranslationOrRotationOrScale,
  createTranslationRotationScaleFromModelMatrixOptional,
} from "./TransformInputs/helpers";
import RotationInput from "./TransformInputs/RotationInput";
import ScaleInput from "./TransformInputs/ScaleInput";
import TranslationInput from "./TransformInputs/TranslationInput";
import { SelectedObjectResolved, useViewerStore } from "./ViewerProvider";

export default function TransformSwitch({
  selectedObject,
}: {
  selectedObject: SelectedObjectResolved;
}) {
  const objectRefs = useViewerStore((state) => state.objectRefs);

  const updateProjectObject = useViewerStore(
    (state) => state.projectObjects.update
  );
  const updateStartingPoint = useViewerStore(
    (state) => state.startingPoints.update
  );
  const updateVisualAxis = useViewerStore((state) => state.visualAxes.update);

  const { viewer } = useCesium();

  const timerRef = useRef({ timer: 0 });

  useEffect(() => {
    const timer = timerRef.current.timer;

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const handleChangeMatrix = useCallback(
    (matrix: Matrix4, id: string) => {
      window.clearTimeout(timerRef.current.timer);

      const newTimer = window.setTimeout(() => {
        updateProjectObject({
          id,
          ...createTranslationRotationScaleFromModelMatrixOptional(matrix),
        });
      }, 500);

      timerRef.current.timer = newTimer;
    },
    [updateProjectObject]
  );

  const handleTranslationChange = useCallback(
    (value: { x: number; y: number; z: number }) => {
      if (selectedObject.type !== "PROJECT_OBJECT") return;
      if (!objectRefs.projectObject[selectedObject.id]) return;

      objectRefs.projectObject[selectedObject.id].modelMatrix =
        createModelMatrixFromModelMatrixAndOptionalTranslationOrRotationOrScale(
          objectRefs.projectObject[selectedObject.id].modelMatrix,
          new Cartesian3(value.x, value.y, value.z),
          undefined,
          undefined
        );

      viewer?.scene.requestRender();

      handleChangeMatrix(
        objectRefs.projectObject[selectedObject.id].modelMatrix,
        selectedObject.id
      );
    },
    [
      handleChangeMatrix,
      objectRefs.projectObject,
      selectedObject.type,
      selectedObject.id,
      viewer?.scene,
    ]
  );

  const handleRotationChange = useCallback(
    (value: { x: number; y: number; z: number; w: number }) => {
      if (selectedObject.type !== "PROJECT_OBJECT") return;
      if (!objectRefs.projectObject[selectedObject.id]) return;

      objectRefs.projectObject[selectedObject.id].modelMatrix =
        createModelMatrixFromModelMatrixAndOptionalTranslationOrRotationOrScale(
          objectRefs.projectObject[selectedObject.id].modelMatrix,
          undefined,
          new Quaternion(value.x, value.y, value.z, value.w),
          undefined
        );

      viewer?.scene.requestRender();

      handleChangeMatrix(
        objectRefs.projectObject[selectedObject.id].modelMatrix,
        selectedObject.id
      );
    },
    [
      handleChangeMatrix,
      objectRefs.projectObject,
      selectedObject.type,
      selectedObject.id,
      viewer?.scene,
    ]
  );

  const handleScaleChange = useCallback(
    (value: { x: number; y: number; z: number }) => {
      if (selectedObject.type !== "PROJECT_OBJECT") return;
      if (!objectRefs.projectObject[selectedObject.id]) return;

      objectRefs.projectObject[selectedObject.id].modelMatrix =
        createModelMatrixFromModelMatrixAndOptionalTranslationOrRotationOrScale(
          objectRefs.projectObject[selectedObject.id].modelMatrix,
          undefined,
          undefined,
          new Cartesian3(value.x, value.y, value.z)
        );

      viewer?.scene.requestRender();

      handleChangeMatrix(
        objectRefs.projectObject[selectedObject.id].modelMatrix,
        selectedObject.id
      );
    },
    [
      handleChangeMatrix,
      objectRefs.projectObject,
      selectedObject.type,
      selectedObject.id,
      viewer?.scene,
    ]
  );

  const handleTranslationChangeVisualAxis = useCallback(
    (value: { x: number; y: number; z: number }) => {
      if (!objectRefs.visualAxes[selectedObject.id]) return;

      objectRefs.visualAxes[selectedObject.id].position =
        new ConstantPositionProperty(
          new Cartesian3(value.x, value.y, value.z),
          objectRefs.visualAxes[selectedObject.id].position?.referenceFrame
        );

      viewer?.scene.requestRender();

      window.clearTimeout(timerRef.current.timer);

      timerRef.current.timer = window.setTimeout(() => {
        updateVisualAxis({
          id: selectedObject.id,
          position: objectRefs.visualAxes[selectedObject.id].position
            ?.getValue()
            ?.clone(),
        });
      }, 500);
    },
    [objectRefs.visualAxes, selectedObject.id, updateVisualAxis, viewer?.scene]
  );

  const handleTranslationChangeStartingPoint = useCallback(
    (value: { x: number; y: number; z: number }) => {
      if (!objectRefs.startingPoints[selectedObject.id]) return;

      objectRefs.startingPoints[selectedObject.id].position =
        new ConstantPositionProperty(
          new Cartesian3(value.x, value.y, value.z),
          objectRefs.startingPoints[selectedObject.id].position?.referenceFrame
        );

      viewer?.scene.requestRender();

      window.clearTimeout(timerRef.current.timer);

      timerRef.current.timer = window.setTimeout(() => {
        updateStartingPoint({
          id: selectedObject.id,
          position: objectRefs.startingPoints[selectedObject.id].position
            ?.getValue()
            ?.clone(),
        });
      }, 500);
    },
    [objectRefs.startingPoints, selectedObject.id, updateStartingPoint, viewer?.scene]
  );

  switch (selectedObject.type) {
    case "CLIPPING_POLYGON":
      return "-";
    case "PROJECT_OBJECT":
      return (
        <Grid2 container flexDirection="column" spacing={2}>
          <TranslationInput
            value={selectedObject.translation}
            onImmediateChange={handleTranslationChange}
          />
          <Divider />
          <RotationInput
            value={selectedObject.rotation}
            origin={selectedObject.translation}
            onImmediateChange={handleRotationChange}
          />
          <Divider />
          <ScaleInput
            value={selectedObject.scale}
            onImmediateChange={handleScaleChange}
          />
        </Grid2>
      );
    case "STARTING_POINT":
      return (
        <TranslationInput
          onImmediateChange={handleTranslationChangeStartingPoint}
          value={selectedObject.position}
        />
      );
    case "TILE_3D":
      return "3D Tile feature";
    case "VISUAL_AXIS":
      return (
        <TranslationInput
          onImmediateChange={handleTranslationChangeVisualAxis}
          value={selectedObject.position}
        />
      );
  }
}
