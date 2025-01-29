"use client"

import { WORK_ITEM_STATUS, PRIORITY, DEPENDENCY_TYPE } from '@prisma/client';
import { useFormatter, useTranslations } from 'next-intl';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import usePaginationAndSorting from '@/components/hooks/usePaginationAndSorting';
import { trpc } from '@/server/trpc/client';
import { keepPreviousData } from '@tanstack/react-query';
import { Box, Button, ButtonGroup, Grid2, styled, Typography } from '@mui/material';
import { Add, Delete, Edit, Refresh, SettingsOutlined } from '@mui/icons-material';
import { DialogFactory, generateInitialValues, generateZodValidationSchema } from '@/components/project/Dialog/DialogFactory';
import OptionsButton from '@/components/common/OptionsButton';
import { z } from "zod";

//#region external

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

const StyledBox = styled(Box)({
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "flex-start",
    height: '100%',
    overflow: 'hidden',
});

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
        validation: z.string().array().optional(),
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

// #region Component Start

export default function WorkItemsPage() {


    //#region Hooks
    const formatter = useFormatter();
    const { projectId } = useParams();
    const [createModalOpened, setCreateModalOpened] = useState(false);
    const { paginationModel, sortModel, sortBy, sortOrder, handlePaginationModelChange, handleSortModelChange } = usePaginationAndSorting();
    const t = useTranslations();

    // #region Fetching/Queries
    const {
        data: { data: workItems, count } = { count: 0, data: [] },
        isPending: isProjectsPending,
        refetch,
    } = trpc.workItemsRouter.getWorkItems.useQuery(
        {
            skip: Math.max((paginationModel.page - 1) * paginationModel.pageSize, 0),
            projectId: projectId as string,
            limit: paginationModel.pageSize,
            sortBy,
            sortOrder: sortOrder ?? undefined
        },
        {
            enabled: !!projectId,
            placeholderData: keepPreviousData,
        }
    );
    console.log(Math.max((paginationModel.page - 1) * paginationModel.pageSize, 0), projectId as string, paginationModel.pageSize, sortBy, sortOrder)
    const createWorkItemMutation = trpc.workItemsRouter.addWorkItem.useMutation({
        onSuccess: () => {
            console.info("WorkItem created successfully");
            refetch();
        },
        onError: (error) => {
            console.error("Error creating WorkItem:", error);
        },
    });

    const deleteWorkItemMutation = trpc.workItemsRouter.deleteWorkItem.useMutation({
        onSuccess: () => {
            refetch();
        },
        onError: (error) => {
            console.error("Error deleting workItem:", error);
        },
    });
    const editWorkItemMutation = trpc.workItemsRouter.deleteWorkItem.useMutation({ //TODO:
        onSuccess: () => {
            refetch();
        },
        onError: (error) => {
            console.error("Error editing workItem:", error);
        },
    });

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
            type: "searchSelect" as const,
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

    // #region Handlers

    const handleEditWorkItemClick = useCallback((workItemId: string) => {
        editWorkItemMutation.mutate({ projectId: projectId as string, workItemId });
    }, [editWorkItemMutation, projectId]);

    const handleDeleteWorkItemClick = useCallback((workItemId: string) => {
        deleteWorkItemMutation.mutate({ projectId: projectId as string, workItemId });
    }, [deleteWorkItemMutation, projectId]);

    const handleAddWorkItemButtonClick = useCallback(() => {
        setCreateModalOpened(true);
    }, []);

    const handleAddWorkItemSubmit = useCallback((workItem: WorkItemFormValues) => {
        createWorkItemMutation.mutate({
            ...workItem,
            startDate: new Date(workItem.startDate),
            endDate: new Date(workItem.endDate),
            projectId: projectId as string,
        });
        setCreateModalOpened(false);
        refetch();
    }, [createWorkItemMutation, projectId, refetch]);

    const handleCloseDialog = useCallback(() => {
        setCreateModalOpened(false);
    }, []);

    // #endregion
    //#region Options
    const options = useCallback((workItemId: string) => [
        {
            name: t("routes./project/workitems.editOption"),
            action: () => handleEditWorkItemClick(workItemId),
            icon: <Edit />,
        },
        {
            name: t("routes./project/workitems.deleteOption"),
            action: () => handleDeleteWorkItemClick(workItemId),
            icon: <Delete />,
        },
    ], [handleDeleteWorkItemClick, handleEditWorkItemClick, t]);
    //#endregion
    //#region Columns
    const columns = useMemo<GridColDef<(typeof workItems)[number]>[]>(() => {
        return [
            {
                field: "name",
                headerName: t("routes./project/workitems.column1"),
                flex: 1,
            },
            {
                field: "priority",
                headerName: t("routes./project/workitems.column2"),
                flex: 1,
                renderCell: (params) => {
                    switch (params.row.priority) {
                        case "LOW":
                            return t("workItemDialog.priorityOption1");
                        case "MEDIUM":
                            return t("workItemDialog.priorityOption2");
                        case "HIGH":
                            return t("workItemDialog.priorityOption3");
                        case "SUPER_HIGH":
                            return t("workItemDialog.priorityOption4");
                        default:
                            return "";
                    }
                },
            },
            {
                field: "status",
                headerName: t("routes./project/workitems.column3"),
                flex: 1,
                renderCell: (params) => {
                    switch (params.row.status) {
                        case "IN_WORK":
                            return t("workItemDialog.statusOption1");
                        case "CLOSED":
                            return t("workItemDialog.statusOption2");
                        case "OPENED":
                            return t("workItemDialog.statusOption3");
                        case "FINISHED":
                            return t("workItemDialog.statusOption4");
                        default:
                            return "";
                    }
                },
            },
            {
                field: "assignedToUser",
                headerName: t("routes./project/workitems.column4"),
                flex: 1,
                renderCell: (params) => (
                    params.row.assignedToUser?.name
                ),
            },
            {
                field: "startDate",
                headerName: t("routes./project/workitems.column5"),
                flex: 1,
                renderCell: ({ row: { startDate } }) => (
                    <>{formatter.dateTime(startDate)}</>
                ),
            },
            {
                field: "endDate",
                headerName: t("routes./project/workitems.column6"),
                flex: 1,
                renderCell: ({ row: { endDate } }) => (
                    <>{formatter.dateTime(endDate)}</>
                ),
            },
            {
                field: "settings",
                renderHeader: () => <SettingsOutlined />,
                renderCell: (params) => (
                    <OptionsButton options={options(params.row.id)} />
                ),
            },
        ]
    }, [formatter, options, t]);

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
                        {t("routes./project/workitems.title")}
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
                            onClick={handleAddWorkItemButtonClick}
                            variant="contained"
                            startIcon={<Add />}
                            sx={{
                                justifyContent: "center",
                            }}
                        >
                            {t("routes./project/workitems.addButton")}
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
                        rows={workItems}
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
                        open={createModalOpened}
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleAddWorkItemSubmit}
                        formConfig={formConfig}
                        title={t("workItemDialog.title")}
                        submitButtonText={t("requirementDialog.save")}

                    />
                </Grid2>
            </Grid2>
        </StyledBox>
    );
}