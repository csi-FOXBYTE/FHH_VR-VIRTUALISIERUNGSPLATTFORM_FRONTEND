"use client";

import ListWithPagination from "@/components/common/ListWithPagination";
import { TabPanel } from "@/components/common/TabPanel";
import { Link as NextLink } from "@/server/i18n/routing";
import { trpc } from "@/server/trpc/client";
import { MoreVert } from "@mui/icons-material";
import {
  Button,
  Grid,
  IconButton,
  Link,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
  Typography
} from "@mui/material";
import { keepPreviousData } from "@tanstack/react-query";
import { parseAsInteger, useQueryState } from "nuqs";

export default function ProjectManagementPage() {
  const [selectedTab, setSelectedTab] = useQueryState(
    "tab",
    parseAsInteger.withDefault(0)
  );
  const [page, setSelectedPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(0)
  );
  const [rowsPerPage, setRowsPerPage] = useQueryState(
    "rowsPerPage",
    parseAsInteger.withDefault(10)
  );

  const { data: { data, count } = { data: [], count: 0 } } =
    trpc.projectManagementRouter.list.useQuery(
      {
        page,
        rowsPerPage,
      },
      {
        placeholderData: keepPreviousData,
      }
    );

  return (
    <Grid
      container
      flexDirection="column"
      overflow="hidden"
      flex="1"
      flexWrap="nowrap"
    >
      <Typography variant="h4" marginBottom={4}>
        Projektverwaltung
      </Typography>
      <Tabs value={selectedTab}>
        <Tab
          onClick={() => setSelectedTab(0)}
          label="Meine Projekte"
          value={0}
        />
        <Tab
          disabled
          onClick={() => setSelectedTab(1)}
          label="Mit mir geteilte Projekte"
          value={1}
        />
      </Tabs>
      <TabPanel
        flex="1"
        visible
        overflow="hidden"
        container
        flexDirection="column"
        flexWrap="nowrap"
        index={0}
        value={selectedTab}
      >
        <Grid container justifyContent="flex-end">
          <Button
            LinkComponent={NextLink}
            href={"/project-management/new"}
            variant="contained"
          >
            Projekt anlegen
          </Button>
        </Grid>
        <ListWithPagination
          rowsPerPage={rowsPerPage}
          totalRows={count}
          page={page}
          sx={{ height: "100%", overflow: "hidden", flex: 1 }}
          onPageChange={setSelectedPage}
          onRowsPerPageChange={setRowsPerPage}
          data={data}
          getId={({ row }) => row.id}
          renderRow={({ row }) => (
            <>
              <ListItemText
                slotProps={{
                  secondary: {
                    sx: {
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                  },
                }}
                primary={
                  <Link
                    component={NextLink}
                    color="textPrimary"
                    underline="none"
                    href={`/project-management/${row.id}`}
                  >
                    {row.title}
                  </Link>
                }
                secondary={row.description}
              />
              <ListItemIcon>
                <IconButton>
                  <MoreVert />
                </IconButton>
              </ListItemIcon>
            </>
          )}
        />
      </TabPanel>
      <TabPanel visible index={1} value={selectedTab}>
        Not implemented yet!
      </TabPanel>
    </Grid>
  );
}
