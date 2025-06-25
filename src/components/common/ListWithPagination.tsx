import { Search } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  Divider,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  SxProps,
  TablePagination,
  TextField,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { Fragment, Key, ReactNode } from "react";

export default function ListWithPagination<D, S extends Key>({
  sx,
  data,
  renderRow,
  getId,
  totalRows,
  rowsPerPage,
  page,
  onPageChange,
  onRowsPerPageChange,
  disableDivider = false,
  toolbarActions = null,
  selection,
  onSelectionChange,
  search,
  onSearchChange,
}: {
  sx?: SxProps;
  data: D[];
  totalRows: number;
  page: number;
  rowsPerPage: number;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onSelectionChange?: (selection: S[]) => void;
  selection?: S[];
  renderRow: ({
    row,
    index,
    data,
  }: {
    row: D;
    index: number;
    data: D[];
  }) => ReactNode;
  getId: ({ row }: { row: D }) => S;
  onPageChange: (page: number) => void;
  search?: string;
  onSearchChange?: (search: string) => void;
  disableDivider?: boolean;
  toolbarActions?: ReactNode;
}) {
  const t = useTranslations();

  const internalSelection = new Set(selection);

  return (
    <Grid
      sx={sx}
      container
      overflow="hidden"
      flexWrap="nowrap"
      flexDirection="column"
    >
      <Grid container gap={4}>
        <Grid container>
          <TextField
            variant="standard"
            label={t("components.list-with-pagination.search")}
            placeholder={t(
              "components.list-with-pagination.search-placeholder"
            )}
            value={search}
            onChange={(event) => onSearchChange?.(event.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                sx: () => ({
                  ["&::before"]: {
                    border: "none !important",
                  },
                }),
              },
            }}
          />
        </Grid>
        <Box flex="1" />
        {toolbarActions}
      </Grid>
      <Divider />
      <List
        style={{
          flex: 1,
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {data.map((row, index) => (
          <Fragment key={getId({ row })}>
            {index !== 0 && !disableDivider ? <Divider /> : null}
            <ListItem>
              {selection ? (
                <ListItemText style={{ flexGrow: 0, marginRight: 8 }}>
                  <Checkbox
                    onClick={() => {
                      const id = getId({ row });
                      if (internalSelection.has(getId({ row }))) {
                        internalSelection.delete(id);
                        return onSelectionChange?.(
                          Array.from(internalSelection)
                        );
                      }
                      internalSelection.add(id);

                      return onSelectionChange?.(Array.from(internalSelection));
                    }}
                    checked={internalSelection.has(getId({ row }))}
                  />
                </ListItemText>
              ) : null}
              {renderRow({ row, index, data })}
            </ListItem>
          </Fragment>
        ))}
      </List>
      <TablePagination
        component="div"
        count={totalRows}
        page={page}
        onPageChange={(_, page) => onPageChange(page)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) =>
          onRowsPerPageChange(+event.target.value)
        }
      />
    </Grid>
  );
}
