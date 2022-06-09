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
import { constants } from "ethers";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { Erc721DropboxStatus, IErc721Dropbox, IErc721DropboxSearchDto, IErc721Template } from "@framework/types";

import { Erc721DropboxEditDialog } from "./edit";
import { Erc721DropboxSearchForm } from "./form";

export const Erc721Dropbox: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    handleAdd,
    handleToggleFilters,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleDelete,
    handleDeleteCancel,
    handleSearch,
    handleChangePage,
    handleDeleteConfirm,
  } = useCollection<IErc721Dropbox, IErc721DropboxSearchDto>({
    baseUrl: "/erc721-dropboxes",
    empty: {
      title: "",
      description: emptyStateString,
      price: constants.WeiPerEther.toString(),
      erc721Template: {} as IErc721Template,
    },
    search: {
      query: "",
      dropboxStatus: [Erc721DropboxStatus.ACTIVE],
      erc721CollectionIds: [],
    },
    filter: ({ id, title, description, imageUrl, price, dropboxStatus, erc721TemplateId, erc721CollectionId }) =>
      id
        ? { title, description, imageUrl, price, dropboxStatus, erc721TemplateId, erc721CollectionId }
        : { title, description, imageUrl, price, erc721TemplateId, erc721CollectionId },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc721-dropboxes"]} />

      <PageHeader message="pages.erc721-dropboxes.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters}>
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleAdd} data-testid="Erc721TemplateCreateButton">
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
                <IconButton
                  onClick={handleDelete(dropbox)}
                  disabled={dropbox.dropboxStatus === Erc721DropboxStatus.INACTIVE}
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

      <Erc721DropboxEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
