"use client";

import { trpc } from "@/server/trpc/client";
import {
  Box,
  Button,
  ButtonGroup,
  Grid2,
  styled,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, } from "@mui/x-data-grid";
import { keepPreviousData } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import {
  Add,
  Refresh,
  Delete,
  Edit,
  SettingsOutlined,
} from "@mui/icons-material";
import OptionsButton from "@/components/common/OptionsButton";
import usePaginationAndSorting from "@/components/hooks/usePaginationAndSorting";
import AddParticipantDialog from "@/components/project/Dialog/AddParticipantDialog";
import { DialogFactory, generateInitialValues, generateZodValidationSchema } from "@/components/project/Dialog/DialogFactory";
import { DEPENDENCY_TYPE, PRIORITY, WORK_ITEM_STATUS, } from "@prisma/client";
import { z } from "zod";

type WorkItemFormValues = {
  id?: string;
  name: string;
  status: WORK_ITEM_STATUS;
  priority: PRIORITY;
  startDate: string;
  endDate: string;
  assignedToUserId: string;
  dependencyType: DEPENDENCY_TYPE;
  ressources: string[];
  description: string;
  attachments: string[];
};

//#region Utils (external)

export const workItemFormModel = {
  name: {
    initialValue: "",
    validation: z.string().min(1, "Title is required"),
  },
  status: {
    initialValue: "IN_WORK" as WORK_ITEM_STATUS,
    validation: z.nativeEnum(WORK_ITEM_STATUS).refine(
      (val) => ["IN_WORK", "CLOSED", "OPENED", "FINISHED"].includes(val),
      {
        message: "Status is required",
      }
    ),
  },
  priority: {
    initialValue: "LOW" as PRIORITY,
    validation: z.nativeEnum(PRIORITY).refine(
      (val) => ["LOW", "TECHNICAL", "HIGH", "SUPER_HIGH"].includes(val),
      {
        message: "Priority is required",
      }
    ),
  },
  startDate: {
    initialValue: new Date().toISOString().split("T")[0],
    validation: z.string().min(1, "Start date is required"), //TODO: add proper date validation
  },
  endDate: {
    initialValue: new Date().toISOString().split("T")[0],
    validation: z.string().min(1, "End date is required"), //TODO: add proper date validation
  },
  assignedToUserId: {
    initialValue: "",
    validation: z.string().min(1, "User is required"), //TODO: add t()
  },
  dependencyType: {
    initialValue: "START_END" as DEPENDENCY_TYPE,
    validation: z.nativeEnum(DEPENDENCY_TYPE).refine(
      (val) => ["START_START", "END_START", "END_END", "START_END"].includes(val),
      {
        message: "Dependency is required",
      }
    ),
  },
  ressources: {
    initialValue: [] as string[],
    validation: z.string().array().min(1, "Ressource is required"),
  },
  description: {
    initialValue: "",
    validation: z.string().min(1, "Description is required"),
  },
  attachments: {
    initialValue: [] as string[],
    validation: z.string().array(),
  },
};

const StyledBox = styled(Box)({
  display: "flex",
  alignContent: "center",
  alignItems: "center",
  justifyContent: "flex-start",
  height: '100%',
  overflow: 'hidden',
});

//#endregion
// #region Component Start

export default function ParticipantsPage() {


  //#region Hooks
  const { projectId } = useParams();
  const { paginationModel, sortModel, sortBy, sortOrder, handlePaginationModelChange, handleSortModelChange } = usePaginationAndSorting();
  const t = useTranslations();
  const [addParticipantsModalOpened, setAddParticipantsModalOpened] = useState(false);
  const [addWorkItemModalOpened, setAddWorkItemModalOpened] = useState(false);

  // #endregion

  // #region Fetching/Queries
  const {
    data: { data: participants, count } = { count: 0, data: [] },
    isPending: isProjectsPending,
    refetch,
  } = trpc.participantsRouter.getParticipants.useQuery(
    {
      projectId: projectId as string,
      limit: paginationModel.pageSize,
      skip: Math.max(paginationModel.page - 1) * paginationModel.pageSize,
      sortBy,
      sortOrder: sortOrder ?? undefined
    },
    {
      enabled: !!projectId,
      placeholderData: keepPreviousData,
    }
  );

  const deleteParticipantMutation = trpc.participantsRouter.deleteParticipant.useMutation({
    onSuccess: () => {
      console.info("Participant deleted successfully");
      refetch();
    },
    onError: (error) => {
      console.error("Error deleting participant:", error);
    },
  });

  const createWorkItemMutation = trpc.participantsRouter.addWorkItem.useMutation({
    onSuccess: () => {
      console.info("WorkItem created successfully");
      refetch();
    },
    onError: (error) => {
      console.error("Error creating WorkItem:", error);
    },
  });

  // #endregion

  // #region Handlers

  const handleDeleteParticipantClick = useCallback((participantId: string) => {
    deleteParticipantMutation.mutate({ projectId: projectId as string, participantId });
  }, [deleteParticipantMutation, projectId]);

  const handleAddWorkItemClick = useCallback(() => {
    setAddWorkItemModalOpened(true);
  }, []);

  const handleAddParticipantsButtonClick = useCallback(() => {
    setAddParticipantsModalOpened(true)
  }, []);

  const handleAddWorkItemSubmit = useCallback((workItem: WorkItemFormValues) => {
    createWorkItemMutation.mutate({
      ...workItem,
      startDate: new Date(workItem.startDate),
      endDate: new Date(workItem.endDate),
    });
    setAddWorkItemModalOpened(false);
    refetch();
  }, [createWorkItemMutation, refetch]);

  const handleCloseDialog = useCallback(() => {
    setAddWorkItemModalOpened(false)
  }, []);

  // #endregion

  //#region Dialog Config
  const initialValues = useMemo(() => generateInitialValues(workItemFormModel), []);
  const validationSchema = useMemo(() => generateZodValidationSchema(workItemFormModel), []);

  const formConfig = useMemo(() => ({
    name: {
      type: "text" as const,
      label: t("workItemDialog.name"),
    },
    status: {
      type: "select" as const,
      label: t("workItemDialog.status"),
      options: [
        { value: "IN_WORK", label: t("workItemDialog.statusOption1") },
        { value: "CLOSED", label: t("workItemDialog.statusOption2") },
        { value: "OPENED", label: t("workItemDialog.statusOption3") },
        { value: "FINISHED", label: t("workItemDialog.statusOption4") },
      ],
    },
    priority: {
      type: "select" as const,
      label: t("workItemDialog.priority"),
      options: [
        { value: "LOW", label: t("workItemDialog.priorityOption1") },
        { value: "MEDIUM", label: t("workItemDialog.priorityOption2") },
        { value: "HIGH", label: t("workItemDialog.priorityOption3") },
        { value: "SUPER_HIGH", label: t("workItemDialog.priorityOption4") },
      ],
    },
    startDate: {
      type: "date" as const,
      label: t("workItemDialog.startDate"),
    },
    endDate: {
      type: "date" as const,
      label: t("workItemDialog.endDate"),
    },
    assignedToUserId: {
      type: "participantSelection" as const,
      label: t("workItemDialog.assignedToUser"),
    },
    dependencyType: {
      type: "select" as const,
      label: t("workItemDialog.dependsOnWorkItem"),
      options: [
        { value: "START_END", label: t("workItemDialog.dependencyOption1") },
        { value: "START_START", label: t("workItemDialog.dependencyOption2") },
        { value: "END_END", label: t("workItemDialog.dependencyOption3") },
        { value: "END_START", label: t("workItemDialog.dependencyOption4") },
      ],
    },
    ressources: {
      type: "select" as const,
      label: t("workItemDialog.ressources"),
    },
    description: {
      type: "textArea" as const,
      label: t("workItemDialog.description"),
    },
    attachments: {
      type: "attachment" as const,
      label: t("workItemDialog.attachments"),
    }
  }), [t]);

  //#endregion

  //#region Options
  const options = useCallback((participantId: string) => [
    {
      name: t("routes./project/participants.addWorkItemOption"),
      action: () => handleAddWorkItemClick(),
      icon: <Edit />,
    },
    {
      name: t("routes./project/participants.deleteOption"),
      action: () => handleDeleteParticipantClick(participantId),
      icon: <Delete />,
    },
  ], [handleAddWorkItemClick, handleDeleteParticipantClick, t]);
  //#endregion

  //#region Columns
  const columns = useMemo<GridColDef<(typeof participants)[number]>[]>(() => {
    return [
      {
        field: "name",
        headerName: t("routes./project/participants.column1"),
        flex: 1,
      },
      {
        field: "lastName",
        headerName: t("routes./project/participants.column2"),
        flex: 1,
      },
      {
        field: "email",
        headerName: t("routes./project/participants.column3"),
        flex: 1,
      },
      {
        field: "phoneNumber",
        headerName: t("routes./project/participants.column4"),
        flex: 1,
      },
      {
        field: "Role",
        headerName: t("routes./project/participants.column5"),
        flex: 1,
      },
      {
        field: "Department",
        headerName: t("routes./project/participants.column6"),
        flex: 1,
      },
      {
        field: "Etage",
        headerName: t("routes./project/participants.column7"),
        flex: 1,
      },
      {
        field: "settings",
        renderHeader: () => <SettingsOutlined />,
        renderCell: (params) => (
          <OptionsButton options={options(params.row.id)} />
        ),
      },
    ]
  }, [options, t]);

  //#endregion

  //#region Render
  return (
    <StyledBox>
      <Grid2
        container
        flexDirection="column"
        flexGrow="1"
        flexShrink="1"
        flexWrap="nowrap"
        overflow="hidden"
        paddingTop={2}
        spacing={2}
        // size="grow"
        height="100%"
      >
        <Grid2
          container
          spacing={2}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h1">
            {t("routes./project/participants.title")}
          </Typography>
          <ButtonGroup>
            <Button
              variant="text"
              startIcon={<Refresh />}
              onClick={() => refetch()}
              sx={{
                justifyContent: "center",
                marginRight: "16px",
              }}
            >
              {t("common.refreshButton")}
            </Button>
            <Button
              onClick={handleAddParticipantsButtonClick}
              variant="contained"
              startIcon={<Add />}
              sx={{
                justifyContent: "center",
              }}
            >
              {t("routes./project/participants.addButton")}
            </Button>
          </ButtonGroup>
        </Grid2>
        <Grid2
          container
          flexDirection="column"
          flexGrow="1"
          flexWrap="nowrap"
          overflow="hidden"
          marginTop={2}
          spacing={2}
        >
          <DataGrid
            disableVirtualization
            rows={participants}
            getRowId={(row) => row.id}
            paginationMode="server"
            paginationModel={paginationModel}
            pagination
            filterMode="server"
            sortingMode="server"
            disableColumnFilter
            pageSizeOptions={[25, 50, 100]}
            onPaginationModelChange={handlePaginationModelChange}
            onSortModelChange={handleSortModelChange}
            sortModel={sortModel}
            loading={isProjectsPending}
            rowCount={count}
            columns={columns}
          />
          <DialogFactory<WorkItemFormValues>
            close={handleCloseDialog}
            projectId={projectId as string}
            open={addWorkItemModalOpened}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleAddWorkItemSubmit}
            formConfig={formConfig}
            title={t("workItemDialog.title")}
            submitButtonText={t("requirementDialog.save")}

          />
          <AddParticipantDialog
            open={addParticipantsModalOpened}
            close={() => {
              setAddParticipantsModalOpened(false);
              refetch();
            }}
            projectId={projectId as string}
            refetch={refetch}
          />
        </Grid2>
      </Grid2>
    </StyledBox>
  );
}