import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  DialogActions,
  DialogProps,
  Button,
  Grid2,
  Select,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useState } from "react";
import CustomTabPanel from "../common/CustomTabPanel";
import { Formik } from "formik";
import { trpc } from "@/server/trpc/client";
import { useSession } from "next-auth/react";
import { PROJECT_STATUS } from "@prisma/client";

export default function CreateProjectDialog({
  close,
  ...props
}: DialogProps & { close: () => void }) {
  const [index, setIndex] = useState(0);
  const { data: session } = useSession();

  const addProjectItemMutation = trpc.projectOverviewRouter.addProject.useMutation({
    onSuccess: () => {
      console.info("Project adding successfully");
      close();
    },
    onError: (error) => {
      console.error("Error adding poject:", error);
    },
  });
  return (
    <Dialog {...props}>
      <DialogActions>
        <Button
          onClick={close}
          variant={"contained"}
          color={"secondary"}
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            margin: 0,
            minWidth: 34,
            padding: 0,
          }}
          disableElevation
        >
          <Close
            sx={{
              margin: ".25em",
            }}
          />
        </Button>
      </DialogActions>
      <DialogTitle>Projekt erstellen</DialogTitle>
      <Formik
        initialValues={{
          projectName: "",
          number: "",
          building: "",
          room: "",
          abc: "",
          category: "",
          leader: "",
          startDate: "",
          endDate: "",
        }}
        onSubmit={(values) => {
          const payload = {
            createdAt: new Date(),
            updatedAt: new Date(),
            creatorId: session?.user?.id as string,
            projectManagerId: session?.user?.id as string,
            projectCategoryId: "",
            status: "IN_WORK" as PROJECT_STATUS,
            name: values.projectName,
            contactPersonId: session?.user?.id as string,
            testBenchNumber: 999,
            startDate: new Date(),
            endDate: new Date(),
            projectType: "dummy-type",
            plannedBudget: 1000,
            calculateTargetFromSubProjectSpecifications: false,
            description: "dummy-description",
          };
          addProjectItemMutation.mutate(payload, {
            onError: (error) => {
              console.error("Mutation Error:", error);
              if (error instanceof Error) {
                console.error("Error Message:", error.message);
                console.error("Error Stack:", error.stack);
              }
            },
          });
        }}
        style={{ padding: 0, margin: 0 }}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            <DialogContent>
              <Tabs value={index} onChange={(_, index) => setIndex(index)}>
                <Tab label="Projekt Details" />
                <Tab label="Zeit und Finanzplanung" />
                <Tab label="Zusatz-Information (optional)" />
              </Tabs>
              <CustomTabPanel index={0} value={index}>
                <Grid2 container spacing={2}>
                  <Grid2 size={12}>
                    <FormControl fullWidth>
                      <TextField
                        required
                        value={props.values.projectName}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        name="projectName"
                        label="Projekt Name"
                        variant="filled"
                      />
                    </FormControl>
                  </Grid2>
                  <Grid2 size={6}>
                    <FormControl fullWidth>
                      <TextField
                        name="number"
                        label="Prüfstand-Nr."
                        variant="filled"
                        disabled
                      />
                    </FormControl>
                  </Grid2>
                  <Grid2 size={6}>
                    <FormControl fullWidth>
                      <TextField
                        name="building"
                        label="Gebäude"
                        variant="filled"
                        disabled
                      />
                    </FormControl>
                  </Grid2>
                  <Grid2 size={6}>
                    <FormControl fullWidth>
                      <TextField name="room" label="Raum" variant="filled"
                        disabled
                      />
                    </FormControl>
                  </Grid2>
                  <Grid2 size={6}>
                    <FormControl fullWidth>
                      <TextField name="abc" label="Etage" variant="filled"
                        disabled
                      />
                    </FormControl>
                  </Grid2>
                  <Grid2 size={12}>
                    <FormControl fullWidth>
                      <InputLabel>Projekt Kategorie</InputLabel>
                      <Select
                        name="productCategory"
                        label="Projekt Kategorie"
                        variant="filled"
                        disabled

                      />
                    </FormControl>
                  </Grid2>
                  <Grid2 size={12}>
                    <FormControl fullWidth>
                      <InputLabel>Ansprechpartner</InputLabel>
                      <Select
                        name="partner"
                        label="Ansprechpartner"
                        variant="filled"
                        disabled
                      />
                    </FormControl>
                  </Grid2>
                  <Grid2 size={12}>
                    <FormControl fullWidth>
                      <InputLabel>Projekt Kategorie</InputLabel>
                      <Select
                        name="leader"
                        label="Projektleiter"
                        variant="filled"
                        disabled

                      />
                    </FormControl>
                  </Grid2>
                </Grid2>
              </CustomTabPanel>
              <CustomTabPanel index={1} value={index}>
                <Grid2 container spacing={2}>
                  <Grid2 size={6}>
                    <FormControl fullWidth>
                      <TextField
                        required
                        value={props.values.projectName}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        name="startDate"
                        label="Startdatum"
                        variant="filled"
                        type="date"
                        disabled

                      />
                    </FormControl>
                  </Grid2>
                  <Grid2 size={6}>
                    <FormControl fullWidth>
                      <TextField
                        required
                        value={props.values.projectName}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        name="endDate"
                        label="Enddatum"
                        variant="filled"
                        type="date"
                        disabled

                      />
                    </FormControl>
                  </Grid2>
                  <Grid2 size={12}>
                    <FormControl fullWidth>
                      <InputLabel>Projekt-Art</InputLabel>
                      <Select
                        name="projectType"
                        label="Projekt-Art"
                        variant="filled"
                        disabled

                      />
                    </FormControl>
                  </Grid2>
                  <Grid2 size={12}>
                    <FormControl fullWidth>
                      <InputLabel>Kostenstelle</InputLabel>
                      <Select
                        name="costCenter"
                        label="Kostenstelle"
                        variant="filled"
                        disabled

                      />
                    </FormControl>
                  </Grid2>
                  <Grid2 size={6}>
                    <FormControl fullWidth>
                      <TextField
                        required
                        value={props.values.projectName}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        name="plannedHours"
                        label="Geplante Stunden"
                        variant="filled"
                        disabled

                      />
                    </FormControl>
                  </Grid2>
                  <Grid2 size={6}>
                    <FormControl fullWidth>
                      <TextField
                        required
                        value={props.values.projectName}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        name="plannedBudget"
                        label="Geplantes Budget"
                        variant="filled"
                        disabled

                      />
                    </FormControl>
                  </Grid2>
                  <Grid2 size={12}>
                    <FormControlLabel
                      control={<Switch />}
                      label="Soll aus Teilprojektvorgaben berechnen"
                      disabled

                    />
                  </Grid2>
                </Grid2>
              </CustomTabPanel>
              <CustomTabPanel index={2} value={index}>
                <Grid2 container spacing={2}>
                  <Grid2 size={12}>
                    <FormControl fullWidth>
                      <TextField
                        multiline
                        rows={4}
                        maxRows={6}
                        required
                        value={props.values.projectName}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        name="endDate"
                        label="Beschreibung"
                        variant="filled"
                        disabled

                      />
                    </FormControl>
                  </Grid2>
                  <Grid2 size={12}>
                    <FormControl fullWidth>
                      <TextField
                        multiline
                        minRows={4}
                        maxRows={6}
                        required
                        value={props.values.projectName}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        name="endDate"
                        label="Zusätzliche Informationen"
                        variant="filled"
                        disabled

                      />
                    </FormControl>
                  </Grid2>
                </Grid2>
              </CustomTabPanel>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" color="inherit" onClick={close}>
                Abbrechen
              </Button>
              <Button variant="outlined" type="submit">
                Speichern
              </Button>
            </DialogActions>
          </form>
        )}
      </Formik>
    </Dialog >
  );
}
