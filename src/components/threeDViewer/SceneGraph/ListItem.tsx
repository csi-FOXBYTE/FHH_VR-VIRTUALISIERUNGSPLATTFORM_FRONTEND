import {
  CameraAlt,
  Delete,
  LocationOn,
  Visibility,
  VisibilityOff,
  WavingHand,
} from "@mui/icons-material";
import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import { ReactNode } from "react";

export default function SceneGraphListItem({
  selected,
  onSelected,
  name,
  onDelete,
  onPlace,
  onToggleVisibility,
  visible,
  onFlyTo,
  extras
}: {
  name: string;
  selected: boolean;
  onSelected: () => void;
  visible?: boolean;
  onToggleVisibility?: () => void;
  onDelete?: () => void;
  onPlace?: () => void;
  onFlyTo?: () => void;
  extras?: ReactNode;
}) {
  return (
    <ListItem
      onClick={onSelected}
      sx={(theme) => ({
        background: selected ? theme.palette.secondary.main : undefined,
        color: selected ? theme.palette.secondary.contrastText : undefined,
      })}
    >
      <ListItemText>{name}</ListItemText>
      {extras ?? null}
      {onToggleVisibility ? (
        <ListItemButton
          sx={{
            flex: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          dense
          onClick={(event) => {
            event.stopPropagation();
            onToggleVisibility();
          }}
        >
          {visible ? <Visibility /> : <VisibilityOff />}
        </ListItemButton>
      ) : null}
      {onPlace ? (
        <ListItemButton
          sx={{
            flex: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          dense
          onClick={(event) => {
            event.stopPropagation();
            onPlace();
          }}
        >
          <LocationOn />
        </ListItemButton>
      ) : null}
      {onFlyTo ? (
        <ListItemButton
          sx={{
            flex: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          dense
          onClick={(event) => {
            event.stopPropagation();
            onFlyTo();
          }}
        >
          <WavingHand />
        </ListItemButton>
      ) : null}
      {onDelete ? (
        <ListItemButton
          sx={{
            flex: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          dense
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
        >
          <Delete />
        </ListItemButton>
      ) : null}
    </ListItem>
  );
}
