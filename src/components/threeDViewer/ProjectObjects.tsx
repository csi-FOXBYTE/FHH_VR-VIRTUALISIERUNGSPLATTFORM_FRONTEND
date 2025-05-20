import CustomModel from "./CustomModel";
import { useViewerStore } from "./ViewerProvider";

export default function ProjectObjects() {
  const projectObjects = useViewerStore((state) => state.projectObjects);

  return projectObjects.map((projectObject) => (
    <CustomModel
      modelMatrix={projectObject.modelMatrix}
      id={projectObject.id}
      key={projectObject.id}
      buffer={projectObject.fileContent}
    />
  ));
}
