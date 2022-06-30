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
import { DropboxStatus, IDropbox, IDropboxSearchDto } from "@framework/types";

import { DropboxEditDialog } from "./edit";
import { Erc721DropboxSearchForm } from "./form";
import { emptyPrice } from "../../../components/inputs/empty-price";

export const Dropbox: FC = () => {
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
  } = useCollection<IDropbox, IDropboxSearchDto>({
    baseUrl: "/dropboxes",
    empty: {
      title: "",
      description: emptyStateString,
      price: emptyPrice,
    },
    search: {
      query: "",
      dropboxStatus: [DropboxStatus.ACTIVE],
      contractIds: [],
    },
    filter: ({ id, title, description, imageUrl, price, dropboxStatus, templateId, contractId }) =>
      id
        ? { title, description, imageUrl, price, dropboxStatus, templateId, contractId }
        : { title, description, imageUrl, price, templateId, contractId },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "dropboxes"]} />

      <PageHeader message="pages.dropboxes.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="DropboxCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <Erc721DropboxSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((dropbox, i) => (
            <ListItem key={i}>
              <ListItemText>{dropbox.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(dropbox)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(dropbox)} disabled={dropbox.dropboxStatus === DropboxStatus.INACTIVE}>
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

      <DropboxEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
