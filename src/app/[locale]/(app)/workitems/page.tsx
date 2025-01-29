"use client"

import { useFormatter, useTranslations } from 'next-intl';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useMemo } from 'react';
import usePaginationAndSorting from '@/components/hooks/usePaginationAndSorting';
import { trpc } from '@/server/trpc/client';
import { keepPreviousData } from '@tanstack/react-query';
import { Box, Button, ButtonGroup, Grid2, styled, Typography } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { useSession } from 'next-auth/react';

//#region external

const StyledBox = styled(Box)({
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "flex-start",
    height: '100%',
    overflow: 'hidden',
});

// #region Component Start

export default function UserWorkItemsPage() {


    //#region Hooks
    const formatter = useFormatter();
    const { data: session } = useSession();

    const { paginationModel, sortModel, sortBy, sortOrder, handlePaginationModelChange, handleSortModelChange } = usePaginationAndSorting();
    const t = useTranslations();

    // #region Fetching/Queries
    const {
        data: { data: workItems, count } = { count: 0, data: [] },
        isPending: isProjectsPending,
        refetch,
    } = trpc.userWorkItemsRouter.getWorkItems.useQuery(
        {
            skip: Math.max((paginationModel.page - 1) * paginationModel.pageSize, 0),
            userId: session?.user.id as string,
            limit: paginationModel.pageSize,
            sortBy,
            sortOrder: sortOrder ?? undefined
        },
        {
            enabled: !!session?.user.id,
            placeholderData: keepPreviousData,
        }
    );
    // #endregion

    //#region Columns
    const columns = useMemo<GridColDef<(typeof workItems)[number]>[]>(() => {
        return [
            {
                field: "name",
                headerName: t("userworkitems.column1"),
                flex: 1,
            },
            {
                field: "priority",
                headerName: t("userworkitems.column2"),
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
                headerName: t("userworkitems.column3"),
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
                field: "project",
                headerName: t("userworkitems.column4"),
                flex: 1,
                renderCell: (params) => (
                    params.row.project.name
                ),
            },
            {
                field: "startDate",
                headerName: t("userworkitems.column5"),
                flex: 1,
                renderCell: ({ row: { startDate } }) => (
                    <>{formatter.dateTime(startDate)}</>
                ),
            },
            {
                field: "endDate",
                headerName: t("userworkitems.column6"),
                flex: 1,
                renderCell: ({ row: { endDate } }) => (
                    <>{formatter.dateTime(endDate)}</>
                ),
            },
        ]
    }, [formatter, t]);

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
                        {t("userworkitems.title")}
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
                </Grid2>
            </Grid2>
        </StyledBox>
    );
}