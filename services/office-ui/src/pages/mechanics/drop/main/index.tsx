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
import { Add, Create, Delete, FilterList } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { addMonths } from "date-fns";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { useUser } from "@gemunion/provider-user";
import { emptyItem, emptyPrice } from "@gemunion/mui-inputs-asset";
import type { IDrop, IDropSearchDto, IUser } from "@framework/types";

import { DropEditDialog } from "./edit";
import { cleanUpAsset } from "../../../../utils/money";

export const Drop: FC = () => {
  const now = new Date();
  const { profile } = useUser<IUser>();

  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    handleCreate,
    handleToggleFilters,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleDelete,
    handleDeleteCancel,
    handleSearch,
    handleChangePage,
    handleDeleteConfirm,
  } = useCollection<IDrop, IDropSearchDto>({
    baseUrl: "/drops",
    empty: {
      item: emptyItem,
      price: emptyPrice,
      merchantId: profile.merchantId,
      startTimestamp: addMonths(now, 0).toISOString(),
      endTimestamp: addMonths(now, 1).toISOString(),
    },
    search: {
      merchantId: profile.merchantId,
    },
    filter: ({ item, price, merchantId, startTimestamp, endTimestamp }) => ({
      item: cleanUpAsset(item),
      price: cleanUpAsset(price),
      merchantId,
      startTimestamp,
      endTimestamp,
    }),
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "drop"]} />

      <PageHeader message="pages.drop.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="DropCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} testId="DropSearchForm">
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <EntityInput name="merchantId" controller="merchants" disableClear />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(drop => (
            <ListItem key={drop.id}>
              <ListItemText>{drop.item?.components[0].template?.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(drop)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(drop)}>
                  <Delete />
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

      <DeleteDialog
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        open={isDeleteDialogOpen}
        initialValues={{ ...selected, title: selected.item?.components[0]?.template?.title }}
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
