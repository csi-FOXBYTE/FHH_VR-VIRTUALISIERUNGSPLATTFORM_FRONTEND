import * as Cesium from "cesium";
import { useCallback, useEffect, useState } from "react";
import { useCesium } from "resium";

export default function CustomModel({
  buffer,
  modelMatrix,
  id,
}: {
  buffer: Buffer;
  modelMatrix: Cesium.Matrix4;
  id: string;
}) {
  const { viewer } = useCesium();

  const [modelRef, setModelRef] = useState<{ ref: Cesium.Model | null }>({
    ref: null,
  });

  const loadModel = useCallback(
    async ({ signal }: { signal: AbortSignal }) => {
      if (!viewer) return;

      signal.addEventListener("abort", () => {
        if (modelRef.ref == null) return;
        viewer.scene.primitives.remove(modelRef.ref);
        setModelRef({ ref: null });
      });

      if (signal.aborted) return;

      const objectUrl = URL.createObjectURL(new Blob([buffer]));

      let model: Cesium.Model | null = null;

      try {
        model = await Cesium.Model.fromGltfAsync({
          url: objectUrl,
          id,
        });
      } catch {}

      URL.revokeObjectURL(objectUrl);

      if (signal.aborted) return;

      viewer.scene.primitives.add(model);

      setModelRef({ ref: model });
    },
    [viewer, buffer, modelRef.ref, id]
  );

  useEffect(() => {
    if (modelRef.ref === null) return;

    modelRef.ref.modelMatrix = modelMatrix.clone();
  }, [modelMatrix, modelRef]);

  useEffect(() => {
    const abortController = new AbortController();

    loadModel({ signal: abortController.signal });

    return () => abortController.abort();
  }, [loadModel]);

  return null;
}
