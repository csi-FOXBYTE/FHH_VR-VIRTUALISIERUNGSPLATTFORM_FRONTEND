import React, { useCallback, useMemo, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogProps,
    Grid2,
    Checkbox,
    Button,
    DialogActions,
    Chip,
    Avatar,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { trpc } from "@/server/trpc/client";
import { DataGrid, GridColDef, } from "@mui/x-data-grid";
import usePaginationAndSorting from "@/components/hooks/usePaginationAndSorting";
import { keepPreviousData } from "@tanstack/react-query";

type UserSelection = {
    id: string;
    name: string;
};

interface AddParticipantDialogProps extends DialogProps {
    close: () => void;
    projectId: string;
    refetch: () => void;
}

//#region Component Start

export default function AddParticipantDialog({
    close,
    open,
    projectId,
    refetch,
}: AddParticipantDialogProps) {
    const t = useTranslations();
    const { paginationModel, sortModel, sortBy, sortOrder, handlePaginationModelChange, handleSortModelChange } = usePaginationAndSorting();

    // #region Fetching/Queries

    const {
        data: { data: availableUsers, count } = { count: 0, data: [] },
        isPending: getUsersIssPending,
    } = trpc.participantsRouter.getUsers.useQuery({
        limit: paginationModel.pageSize,
        skip: Math.max(paginationModel.page - 1) * paginationModel.pageSize,
        sortBy,
        sortOrder: sortOrder ?? undefined
    },
        {
            placeholderData: keepPreviousData,
        }
    );

    const addParticipantMutation =
        trpc.participantsRouter.addParticipants.useMutation({
            onSuccess: () => {
                refetch();
                close();
            },
            onError: (error) => {
                console.error("addParticipantsMutation failed:" + error);
            },
        });

    // #endregion

    // #region Handlers

    const [selectedUsers, setSelectedUsers] = useState<UserSelection[]>([]);

    const handleSelectAllClick = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedUsers(availableUsers?.map(user => ({ id: user.id, name: user.name ?? '' })) ?? []);
            return;
        }
        setSelectedUsers([]);
    }, [availableUsers]);

    const handleCheckboxChange = useCallback((
        event: React.ChangeEvent<HTMLInputElement>,
        user: UserSelection
    ) => {
        setSelectedUsers((prevSelected) => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(user)) {
                newSelected.delete(user);
            } else {
                newSelected.add(user);
            }
            return Array.from(newSelected);
        });
    }, []);

    const handleAddParticipantsClick = useCallback(() => {
        addParticipantMutation.mutate({
            projectId,
            userIds: selectedUsers.map((user) => user.id),
        });
    }, [addParticipantMutation, projectId, selectedUsers]);

    const handleDeleteChip = useCallback((id: string) => {
        setSelectedUsers((prevSelected) =>
            prevSelected.filter((user) => user.id !== id)
        );
    }, []);

    // #endregion

    //#region Columns

    const columns = useMemo<GridColDef[]>(() => {
        return [
            {
                field: "selection",
                renderHeader: () => (
                    <Checkbox
                        indeterminate={
                            selectedUsers.length > 0 &&
                            selectedUsers.length < availableUsers.length
                        }
                        checked={
                            availableUsers.length > 0 &&
                            selectedUsers.length === availableUsers.length
                        }
                        onChange={handleSelectAllClick}
                    />
                ),
                renderCell: (params: { row: { id: string; name: string; }; }) => (
                    <Checkbox
                        checked={selectedUsers.some(
                            (user) => user.id === params.row.id
                        )}
                        onChange={(event) =>
                            handleCheckboxChange(event, { id: params.row.id, name: params.row.name ?? '' })
                        }
                    />
                ),
            },
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
                field: "role",
                headerName: t("routes./project/participants.column5"),
                flex: 1,
            },
            {
                field: "department",
                headerName: t("routes./project/participants.column6"),
                flex: 1,
            },
            {
                field: "position",
                headerName: t("routes./project/participants.column7"),
                flex: 1,
            },
        ];
    }, [availableUsers.length, handleCheckboxChange, handleSelectAllClick, selectedUsers, t]);

    //#endregion

    // #region Renderer
    return (
        <Dialog open={open} onClose={close} fullWidth maxWidth="md">
            <DialogTitle>{t("participantDialog.title")}</DialogTitle>
            <DialogContent>
                <Grid2 container size="grow" direction={"column"} spacing={2}>
                    <Grid2 container spacing={1}>
                        {selectedUsers.map((user) => (
                            <Grid2 key={user.id}>
                                <Chip
                                    avatar={<Avatar>{user.name.charAt(0)}</Avatar>}
                                    label={user.name}
                                    onDelete={() => handleDeleteChip(user.id)}
                                />
                            </Grid2>
                        ))}
                    </Grid2>
                    <Grid2 >
                        <DataGrid
                            disableVirtualization
                            rows={availableUsers ?? []}
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
                            rowCount={count ?? 0}
                            columns={columns}
                            loading={getUsersIssPending}
                        />
                    </Grid2>
                </Grid2>
            </DialogContent>
            <DialogActions>
                <Button onClick={close}>{t("participantDialog.cancel")}</Button>
                <Button
                    onClick={handleAddParticipantsClick}
                    variant="contained"
                    color="primary"
                >
                    {t("participantDialog.save")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
