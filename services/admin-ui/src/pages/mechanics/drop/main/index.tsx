import { FC } from "react";
import {
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Pagination,
} from "@mui/material";
import { Add, Create } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { addMonths } from "date-fns";

import { IPaginationDto } from "@gemunion/types-collection";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { IDrop } from "@framework/types";

import { DropEditDialog } from "./edit";
import { emptyItem, emptyPrice } from "../../../../components/inputs/price/empty-price";
import { cleanUpAsset } from "../../../../utils/money";

export const Drop: FC = () => {
  const now = new Date();
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isEditDialogOpen,
    handleCreate,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleChangePage,
  } = useCollection<IDrop, IPaginationDto>({
    baseUrl: "/drops",
    empty: {
      item: emptyItem,
      price: emptyPrice,
      startTimestamp: addMonths(now, 0).toISOString(),
      endTimestamp: addMonths(now, 1).toISOString(),
    },
    filter: ({ item, price, startTimestamp, endTimestamp }) => ({
      item: cleanUpAsset(item),
      price: cleanUpAsset(price),
      startTimestamp,
      endTimestamp,
    }),
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "drops"]} />

      <PageHeader message="pages.drops.title">
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="MysteryboxCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((drop, i) => (
            <ListItem key={i}>
              <ListItemText>{drop.item?.components[0].template?.title}</ListItemText>
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
