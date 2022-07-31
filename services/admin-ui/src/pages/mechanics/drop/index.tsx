import { FC } from "react";
import { Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Pagination } from "@mui/material";
import { Create } from "@mui/icons-material";
import { addMonths } from "date-fns";

import { IPaginationDto } from "@gemunion/types-collection";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { IDrop } from "@framework/types";

import { DropEditDialog } from "./edit";

export const Drop: FC = () => {
  const now = new Date();
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isEditDialogOpen,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleChangePage,
  } = useCollection<IDrop, IPaginationDto>({
    baseUrl: "/drops",
    empty: {
      startTimestamp: addMonths(now, 0).toISOString(),
      endTimestamp: addMonths(now, 1).toISOString(),
    },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "drops"]} />

      <PageHeader message="pages.drops.title" />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((drop, i) => (
            <ListItem key={i}>
              <ListItemText>{drop.template?.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(drop)}>
                  <Create />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </ProgressOverlay>

      <Pagination
        sx={{ mt: 2 }}
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />

      <DropEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
