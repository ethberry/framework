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
import { DropboxStatus, IErc998Dropbox, IDropboxSearchDto, IErc998Template } from "@framework/types";

import { Erc998DropboxEditDialog } from "./edit";
import { Erc998DropboxSearchForm } from "./form";

export const Erc998Dropbox: FC = () => {
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
  } = useCollection<IErc998Dropbox, IDropboxSearchDto>({
    baseUrl: "/erc998-dropboxes",
    empty: {
      title: "",
      description: emptyStateString,
      price: constants.WeiPerEther.toString(),
      erc998Template: {} as IErc998Template,
    },
    search: {
      query: "",
      dropboxStatus: [DropboxStatus.ACTIVE],
      uniContractIds: [],
    },
    filter: ({ id, title, description, imageUrl, price, dropboxStatus, erc998TemplateId, erc998CollectionId }) =>
      id
        ? { title, description, imageUrl, price, dropboxStatus, erc998TemplateId, erc998CollectionId }
        : { title, description, imageUrl, price, erc998TemplateId, erc998CollectionId },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc998-dropboxes"]} />

      <PageHeader message="pages.erc998-dropboxes.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="Erc998TemplateCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <Erc998DropboxSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

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
                  disabled={dropbox.dropboxStatus === DropboxStatus.INACTIVE}
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

      <Erc998DropboxEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
