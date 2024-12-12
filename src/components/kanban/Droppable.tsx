import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

export function Droppable({
  group,
  children,
}: {
  group: string;
  children: ReactNode;
}) {
  const { setNodeRef } = useDroppable({
    id: group,
    data: {},
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        display: "flex",
        flex: "1",
        border: "4px solid green",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {children}
    </div>
  );
}
