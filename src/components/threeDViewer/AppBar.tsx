import { Redo, Save, Undo, Upload } from "@mui/icons-material";
import {
  Autocomplete,
  Grid,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { useTranslations } from "next-intl";
import BreadCrumbs from "../navbar/BreadCrumbs";
import ImportProjectObjectDialog from "./ImportProjectObjectDialog";
import TimePicker from "./TimePicker";
import { useViewerStore } from "./ViewerProvider";

export default function AppBar() {
  const history = useViewerStore((state) => state.history);

  const t = useTranslations();

  const toggleImport = useViewerStore(
    (state) => state.projectObjects.toggleImport
  );

  const updateProject = useViewerStore((state) => state.updateProject);

  const project = useViewerStore((state) => state.project);
  const saveProject = useViewerStore((state) => state.saveProject);

  return (
    <Grid
      width="100%"
      zIndex={5}
      boxShadow={2}
      container
      flexDirection="column"
    >
      <ImportProjectObjectDialog />
      <Grid
        container
        padding="8px 32px"
        alignItems="center"
        justifyContent="space-between"
        flexDirection="row"
      >
        <BreadCrumbs style={{ marginBottom: 0 }} />
        <Grid container spacing={1}>
          <Tooltip arrow title={t("editor.import-model")}>
            <IconButton onClick={() => toggleImport()}>
              <Upload />
            </IconButton>
          </Tooltip>
          <Tooltip arrow title={t("editor.save-project")}>
            <IconButton
              disabled={history.index === 0}
              onClick={() => saveProject()}
            >
              <Save />
            </IconButton>
          </Tooltip>
          <Tooltip arrow title={t("editor.undo")}>
            <IconButton disabled={history.index === 0} onClick={history.undo}>
              <Undo />
            </IconButton>
          </Tooltip>
          <Tooltip arrow title={t("editor.redo")}>
            <IconButton
              disabled={history.value.length === history.index + 1}
              onClick={history.redo}
            >
              <Redo />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
      <Grid
        padding="8px 32px"
        boxShadow={2}
        spacing={2}
        container
        sx={{ backgroundColor: "#eee" }}
      >
        <TextField
          defaultValue={project.title}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;

            updateProject({
              title: (event.target as HTMLInputElement).value,
            });
          }}
          onBlur={(event) => {
            updateProject({ title: (event.target as HTMLInputElement).value });
          }}
          label={t("editor.project-name")}
        />

        <TextField
          sx={{ flex: 1 }}
          defaultValue={project.description}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;

            updateProject({
              description: (event.target as HTMLInputElement).value,
            });
          }}
          onBlur={(event) => {
            updateProject({
              description: (event.target as HTMLInputElement).value,
            });
          }}
          label={t("editor.project-description")}
        />
        <TimePicker />
        <Autocomplete
          options={[]}
          renderInput={(params) => (
            <TextField
              sx={{ width: 200, minWidth: 100 }}
              label={t("editor.visual-axes")}
              {...params}
            />
          )}
        />
      </Grid>
    </Grid>
  );
}
