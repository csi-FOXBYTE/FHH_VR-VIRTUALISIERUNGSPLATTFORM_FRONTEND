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
import { IProject } from "@/server/services/projectService";
import { IUser } from "@/server/services/userService";
import { DataGrid, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { faker } from "@faker-js/faker";

//TODO: replace with getUsers service
export const availableUsers = new Array(faker.number.int({ min: 13, max: 50 }))
  .fill(0)
  .map(() => ({
    id: crypto.randomUUID(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: faker.helpers.arrayElement(["admin", "user"] as const),
  }));
interface AddParticipantDialogProps extends DialogProps {
  close: () => void;
  project: IProject;
  refetch: () => void;
}

export default function AddParticipantDialog({
  close,
  open,
  project,
  refetch,
}: AddParticipantDialogProps) {
  const t = useTranslations();

  // #region Queries and Mutations

  const addParticipantMutation =
    trpc.participantsRouter.addParticipants.useMutation({
      onSuccess: () => {
        refetch();
        close();
      },
      onError: (error) => {
        console.error("addParticipantMutation failed:" + error);
      },
    });

  // #endregion

  // #region Pagination and Sorting

  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  const paginationModel = useMemo(() => {
    return {
      page,
      pageSize,
    };
  }, [page, pageSize]);

  const handlePaginationModelChange = useCallback(
    ({ page, pageSize }: GridPaginationModel) => {
      setPage(page);
      setPageSize(pageSize);
    },
    []
  );

  const handleSortModelChange = useCallback((model: GridSortModel) => {
    setSortModel(model);
  }, []);

  // #endregion

  // #region User Selection

  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedUsers(availableUsers);
      return;
    }
    setSelectedUsers([]);
  };

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    user: IUser
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
  };

  const handleAddParticipants = () => {
    addParticipantMutation.mutate({
      projectId: project.id,
      participants: selectedUsers.map((user) => ({
        name: user.name,
        email: user.email,
        role: user.role,
      })),
    });
  };

  const handleDeleteChip = (id: string) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.filter((user) => user.id !== id)
    );
  };

  // #endregion

  // #region Renderer
  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="md">
      <DialogTitle>{t("participantDialog.title")}</DialogTitle>
      <DialogContent>
        <Grid2 container size="grow" direction={"column"} spacing={2}>
          <Grid2 container spacing={1}>
            {selectedUsers.map((user) => (
              <Grid2 item key={user.id}>
                <Chip
                  avatar={<Avatar>{user.name.charAt(0)}</Avatar>}
                  label={user.name}
                  onDelete={() => handleDeleteChip(user.id)}
                />
              </Grid2>
            ))}
          </Grid2>
          <Grid2 item xs={12}>
            <DataGrid
              rows={availableUsers ?? []}
              getRowId={(row) => row.id}
              paginationMode="client"
              paginationModel={paginationModel}
              pagination
              sortingMode="client"
              pageSizeOptions={[25, 50, 100]}
              onPaginationModelChange={handlePaginationModelChange}
              onSortModelChange={handleSortModelChange}
              sortModel={sortModel}
              rowCount={availableUsers.length ?? 0}
              columns={[
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
                  renderCell: (params) => (
                    <Checkbox
                      checked={selectedUsers.some(
                        (user) => user.id === params.row.id
                      )}
                      onChange={(event) =>
                        handleCheckboxChange(event, params.row)
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
              ]}
            />
          </Grid2>
        </Grid2>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>{t("participantDialog.cancel")}</Button>
        <Button
          onClick={handleAddParticipants}
          variant="contained"
          color="primary"
        >
          {t("participantDialog.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
