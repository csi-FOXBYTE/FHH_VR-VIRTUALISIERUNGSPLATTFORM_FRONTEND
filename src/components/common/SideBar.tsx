import { Grid2, IconButton, Paper } from "@mui/material";
import { Dashboard } from "@mui/icons-material";

export default function SideBar() {
    return (
        <Paper elevation={3}>
            <Grid2 container>
                <IconButton  style={{ padding: 16, borderRadius: 0 }}>
                    <Dashboard />
                </IconButton>
            </Grid2>
        </Paper>
    )
};