"use client";

import { trpc } from "@/server/trpc/client";
import { DataGrid } from "@mui/x-data-grid";
import { keepPreviousData } from "@tanstack/react-query";
import useDataGridServerSideHelper from "../dataGridServerSide/useDataGridServerSideOptions";
import { Button, ButtonGroup } from "@mui/material";
import { Add } from "@mui/icons-material";
import VisualAxisCUDialog from "../cuDialogs/VisualAxisCUDialog";
import {
  useQueryState,
  parseAsStringLiteral,
  parseAsString,
  parseAsBoolean,
} from "nuqs";

export default function VisualAxes() {
  const [mode, setMode] = useQueryState(
    "mode",
    parseAsStringLiteral(["CREATE", "UPDATE"]).withDefault("CREATE")
  );
  const [id, setId] = useQueryState("id", parseAsString);
  const [open, setOpen] = useQueryState(
    "open",
    parseAsBoolean.withDefault(false)
  );

  const { props } = useDataGridServerSideHelper("data-management-visual-axes", {
    extraActions: (
      <ButtonGroup variant="contained">
        <Button
          onClick={() => {
            setOpen(true);
            setMode("CREATE");
          }}
          startIcon={<Add />}
        >
          Sichtachse anlegen
        </Button>
      </ButtonGroup>
    ),
  });

  const { data: { data, count } = { data: [], count: 0 } } =
    trpc.dataManagementRouter.listVisualAxes.useQuery(
      {
        filterModel: props.filterModel,
        paginationModel: props.paginationModel,
        sortModel: props.sortModel,
      },
      {
        placeholderData: keepPreviousData,
      }
    );

  return (
    <>
      <VisualAxisCUDialog
        open={open}
        mode={mode}
        id={id ?? undefined}
        close={() => {
          setOpen(false);
          setId(null);
        }}
      />
      <DataGrid
        {...props}
        rows={data}
        rowCount={count}
        columns={[
          {
            field: "name",
          },
          {
            field: "description",
          },
          {
            field: "startPoint",
            renderCell({ row }) {
              return `(${row.startPointX}, ${row.startPointY}, ${row.startPointZ})`;
            },
          },
          {
            field: "endPoint",
            renderCell({ row }) {
              return `(${row.startPointX}, ${row.startPointY}, ${row.startPointZ})`;
            },
          },
        ]}
      />
    </>
  );
}
