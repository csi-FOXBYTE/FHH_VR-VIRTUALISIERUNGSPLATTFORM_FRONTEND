import { trpc } from "@/server/trpc/client";
import { Autocomplete, Grid, TextField } from "@mui/material";
import { DatePicker, DateTimePicker, TimePicker } from "@mui/x-date-pickers";
import { skipToken } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { Controller } from "react-hook-form";
import CUDialog from "../common/CUDialog";

export default function EventCUDialog({
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
  const [searchAttendees, setSearchAttendees] = useState("");
  const [searchProjects, setSearchProjects] = useState("");

  const { data: possibleAttendees = [] } =
    trpc.eventsRouter.getPossibleAttendees.useQuery(
      open ? { search: searchAttendees } : skipToken
    );

  const { data: possibleProjects = [] } =
    trpc.eventsRouter.getPossibleProjects.useQuery(
      open ? { search: searchAttendees } : skipToken
    );

  const { data: initialEvent = null } =
    trpc.eventsRouter.getEventDetails.useQuery(
      open && mode === "UPDATE" && id !== undefined ? { id } : skipToken
    );

  const { enqueueSnackbar } = useSnackbar();

  const { mutate: createMutation, isPending: isCreateMutationPending } =
    trpc.eventsRouter.create.useMutation({
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
    trpc.eventsRouter.update.useMutation({
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
      defaultData={{
        attendees: [] as typeof possibleAttendees,
        title: "",
        endTime: dayjs().add(30, "minute").toDate(),
        project: null as (typeof possibleProjects)[number] | null,
        startTime: new Date(),
      }}
      onCreate={(values) => {
        createMutation({
          attendees: values.attendees.map((attendee) => attendee.id),
          endTime: values.endTime,
          startTime: values.startTime,
          project: values.project?.id,
          title: values.title,
        });
      }}
      onUpdate={(values) => {
        if (!id) throw new Error("No id supplied!");
        updateMutation({
          attendees: values.attendees.map((attendee) => attendee.id),
          endTime: values.endTime,
          startTime: values.startTime,
          title: values.title,
          project: values.project?.id ?? null,
          id,
        });
      }}
      close={close}
      entity="Project"
      isLoading={isUpdateMutationPending || isCreateMutationPending}
      open={open}
      mode="CREATE"
      fetchedData={initialEvent}
    >
      {({ control, register }) => (
        <Grid container flexDirection="column" spacing={2}>
          <TextField required fullWidth {...register("title")} label="Title" />
          <Controller
            name="project"
            control={control}
            render={({ field }) => (
              <Autocomplete
                filterOptions={(a) => a}
                filterSelectedOptions
                includeInputInList
                autoComplete
                onInputChange={(_, value) => setSearchProjects(value)}
                inputValue={searchProjects}
                value={field.value ?? null}
                onChange={(_, value) => field.onChange(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    ref={field.ref}
                    label="Project"
                    fullWidth
                  />
                )}
                getOptionKey={(opt) => opt.id}
                getOptionLabel={(opt) => opt.title}
                options={possibleProjects}
              />
            )}
          />
          <Controller
            name="attendees"
            control={control}
            render={({ field }) => (
              <Autocomplete
                filterOptions={(a) => a}
                filterSelectedOptions
                includeInputInList
                autoComplete
                onInputChange={(_, value) => setSearchAttendees(value)}
                inputValue={searchAttendees}
                value={field.value}
                onChange={(_, value) => field.onChange(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    ref={field.ref}
                    label="Attendees"
                    fullWidth
                  />
                )}
                getOptionKey={(opt) => opt.id}
                getOptionLabel={(opt) => opt.name ?? opt.email}
                options={possibleAttendees}
                multiple
              />
            )}
          />
          <Grid container>
            <Controller
              name="startTime"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  sx={{ flex: 1 }}
                  ref={field.ref}
                  disabled={field.disabled}
                  value={dayjs(field.value)}
                  onChange={(value) => field.onChange(value?.toDate())}
                  label="Start"
                />
              )}
            />
            <Controller
              name="endTime"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  value={dayjs(field.value)}
                  ref={field.ref}
                  disabled={field.disabled}
                  sx={{ flex: 1 }}
                  onChange={(value) => field.onChange(value?.toDate())}
                  label="End"
                />
              )}
            />
          </Grid>
        </Grid>
      )}
    </CUDialog>
  );
}
