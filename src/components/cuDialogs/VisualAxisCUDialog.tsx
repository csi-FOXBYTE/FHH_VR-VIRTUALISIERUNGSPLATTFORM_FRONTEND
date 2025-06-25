import { trpc } from "@/server/trpc/client";
import {
  Grid,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import { skipToken } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { Controller } from "react-hook-form";
import CUDialog from "../common/CUDialog";
import TranslationInput from "../threeDViewer/TransformInputs/TranslationInput";

export default function VisualAxisCUDialog({
  open,
  close,
  mode,
  id,
}: {
  open: boolean;
  close: () => void;
  mode: "CREATE" | "UPDATE";
  id?: string;
}) {
  const { data: initialVisualAxis = null } =
    trpc.dataManagementRouter.getVisualAxis.useQuery(
      open && mode === "UPDATE" && id !== undefined ? { id } : skipToken
    );

  const { enqueueSnackbar } = useSnackbar();

  const { mutate: createMutation, isPending: isCreateMutationPending } =
    trpc.dataManagementRouter.createVisualAxis.useMutation({
      onSuccess: () =>
        enqueueSnackbar({
          variant: "success",
          message: "Successfully created event!",
        }),
      onError: (err) => {
        enqueueSnackbar({
          variant: "error",
          message: "Failed to create event!",
        });
        console.error(err);
      },
    });
  const { mutate: updateMutation, isPending: isUpdateMutationPending } =
    trpc.dataManagementRouter.updateVisualAxis.useMutation({
      onSuccess: () =>
        enqueueSnackbar({
          variant: "success",
          message: "Successfully updated event!",
        }),
      onError: () =>
        enqueueSnackbar({
          variant: "error",
          message: "Failed to update event!",
        }),
    });

  return (
    <CUDialog
      close={close}
      open={open}
      entity="Visual Axis"
      mode={mode}
      defaultData={{
        startPoint: { x: 0, y: 0, z: 0 },
        endPoint: { x: 0, y: 0, z: 0 },
        name: "",
        description: "",
      }}
      isLoading={isUpdateMutationPending || isCreateMutationPending}
      onUpdate={(data) => {
        if (!id) throw new Error("Id no supplied!");
        updateMutation({
          endPointX: data.endPoint.x,
          endPointY: data.endPoint.y,
          endPointZ: data.endPoint.z,
          id,
          name: data.name,
          startPointX: data.startPoint.x,
          startPointY: data.startPoint.y,
          startPointZ: data.startPoint.z,
        });
      }}
      onCreate={(data) => {
        createMutation({
          endPointX: data.endPoint.x,
          endPointY: data.endPoint.y,
          endPointZ: data.endPoint.z,
          name: data.name,
          startPointX: data.startPoint.x,
          startPointY: data.startPoint.y,
          startPointZ: data.startPoint.z,
        });
      }}
      fetchedData={initialVisualAxis}
    >
      {({ register, control }) => (
        <Grid container flexDirection="column" spacing={2}>
          <TextField required fullWidth {...register("name")} label="Title" />
          <TextField
            required
            multiline
            {...register("description")}
            label="Description"
          />
          <Grid padding={1} spacing={1} component={Paper} elevation={2}>
            <Typography marginBottom={2} variant="subtitle2">
              Start point
            </Typography>
            <Controller
              name="startPoint"
              control={control}
              render={({ field }) => (
                <TranslationInput
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </Grid>
          <Grid padding={1} spacing={1} component={Paper} elevation={2}>
            <Typography marginBottom={2} variant="subtitle2">
              End point
            </Typography>
            <Controller
              name="endPoint"
              control={control}
              render={({ field }) => (
                <TranslationInput
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </Grid>
        </Grid>
      )}
    </CUDialog>
  );
}
