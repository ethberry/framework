import { FC } from "react";
import { FormattedMessage } from "react-intl";
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

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { IMysterybox, IMysteryboxSearchDto, MysteryboxStatus } from "@framework/types";

import { MysteryboxEditDialog } from "./edit";
import { MysteryboxSearchForm } from "./form";
import { emptyItem, emptyPrice } from "../../../../components/inputs/price/empty-price";
import { cleanUpAsset } from "../../../../utils/money";

export const Mysterybox: FC = () => {
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
  } = useCollection<IMysterybox, IMysteryboxSearchDto>({
    baseUrl: "/mysteryboxes",
    empty: {
      title: "",
      description: emptyStateString,
      item: emptyItem,
      price: emptyPrice,
    },
    search: {
      query: "",
      mysteryboxStatus: [MysteryboxStatus.ACTIVE],
    },
    filter: ({ id, title, description, imageUrl, item, price, mysteryboxStatus }) =>
      id
        ? {
            title,
            description,
            imageUrl,
            item: cleanUpAsset(item),
            price: cleanUpAsset(price),
            mysteryboxStatus,
          }
        : {
            title,
            description,
            imageUrl,
            item: cleanUpAsset(item),
            price: cleanUpAsset(price),
          },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "mysteryboxes"]} />

      <PageHeader message="pages.mysteryboxes.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="MysteryboxCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <MysteryboxSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((mysterybox, i) => (
            <ListItem key={i}>
              <ListItemText>{mysterybox.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(mysterybox)}>
                  <Create />
                </IconButton>
                <IconButton
                  onClick={handleDelete(mysterybox)}
                  disabled={mysterybox.mysteryboxStatus === MysteryboxStatus.INACTIVE}
                >
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
        initialValues={selected}
      />

      <MysteryboxEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
