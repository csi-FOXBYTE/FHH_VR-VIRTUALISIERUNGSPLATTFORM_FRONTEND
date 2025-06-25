import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { ReactNode, useEffect } from "react";
import {
  Control,
  DefaultValues,
  FieldValues,
  useForm,
  UseFormRegister,
} from "react-hook-form";

export type CUDialogProps<Data extends FieldValues> = {
  mode: "CREATE" | "UPDATE";
  open: boolean;
  entity: string;
  close: () => void;
  onCreate: (data: Data) => void;
  onUpdate: (data: Data) => void;
  defaultData: Data;
  fetchedData: Data | null;
  isLoading: boolean;
  children: ({
    control,
    register,
  }: {
    control: Control<Data>;
    register: UseFormRegister<Data>;
  }) => ReactNode;
};

export default function CUDialog<Data extends FieldValues>({
  mode,
  open,
  entity,
  close,
  onCreate,
  defaultData,
  fetchedData,
  isLoading,
  onUpdate,
  children,
}: CUDialogProps<Data>) {
  const { control, register, handleSubmit, reset } = useForm({
    defaultValues: defaultData as DefaultValues<Data>,
  });

  useEffect(() => {
    if (fetchedData !== null) {
      reset(fetchedData);
    }
  }, [fetchedData, reset]);

  useEffect(() => {
    if (!open) {
      reset(defaultData);
    }
  }, [open, reset]);

  return (
    <Dialog fullWidth open={open} onClose={close}>
      <form
        onSubmit={handleSubmit((values) => {
          switch (mode) {
            case "CREATE":
              return onCreate(values);
            case "UPDATE":
              return onUpdate(values);
          }
        })}
      >
        <DialogTitle>
          {mode} {entity}
        </DialogTitle>
        <DialogContent>{children({ control, register })}</DialogContent>
        <DialogActions>
          <Button onClick={close} variant="outlined">
            Cancel
          </Button>
          <Button variant="contained" loading={isLoading} type="submit">
            {mode}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
