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
import { Erc1155CollectionStatus, IErc1155Collection, IErc1155CollectionSearchDto } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { Erc1155CollectionEditDialog } from "./edit";
import { Erc1155CollectionSearchForm } from "./form";

export const Erc1155Collection: FC = () => {
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
    handleSubmit,
    handleChangePage,
    handleDeleteConfirm,
  } = useCollection<IErc1155Collection, IErc1155CollectionSearchDto>({
    baseUrl: "/erc1155-collections",
    empty: {
      title: "",
      description: "",
    },
    search: {
      query: "",
      collectionStatus: [Erc1155CollectionStatus.ACTIVE],
    },
    filter: ({ title, description, imageUrl }) => ({ title, description, imageUrl }),
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc1155-collections"]} />

      <PageHeader message="pages.erc1155-collections.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters}>
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={handleAdd}
          disabled
          data-testid="erc721CollectionAddButton"
        >
          <FormattedMessage id="form.buttons.add" />
        </Button>
      </PageHeader>

      <Erc1155CollectionSearchForm onSubmit={handleSubmit} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((collection, i) => (
            <ListItem key={i}>
              <ListItemText>{collection.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(collection)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(collection)} disabled>
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

      <Erc1155CollectionEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
