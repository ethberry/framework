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
import { ILootbox, ILootboxSearchDto, LootboxStatus } from "@framework/types";

import { LootboxEditDialog } from "./edit";
import { Erc721LootboxSearchForm } from "./form";
import { emptyPrice } from "../../../components/inputs/empty-price";

export const Lootbox: FC = () => {
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
  } = useCollection<ILootbox, ILootboxSearchDto>({
    baseUrl: "/lootboxes",
    empty: {
      title: "",
      description: emptyStateString,
      item: emptyPrice,
      price: emptyPrice,
    },
    search: {
      query: "",
      lootboxStatus: [LootboxStatus.ACTIVE],
      contractIds: [],
    },
    filter: ({ id, title, description, imageUrl, item, price, lootboxStatus }) =>
      id ? { title, description, imageUrl, item, price, lootboxStatus } : { title, description, imageUrl, item, price },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "lootboxes"]} />

      <PageHeader message="pages.lootboxes.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="LootboxCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <Erc721LootboxSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((lootbox, i) => (
            <ListItem key={i}>
              <ListItemText>{lootbox.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(lootbox)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(lootbox)} disabled={lootbox.lootboxStatus === LootboxStatus.INACTIVE}>
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

      <LootboxEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
