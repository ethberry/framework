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
import { Erc721CollectionStatus, IErc721Collection, IErc721CollectionSearchDto } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { Erc721CollectionEditDialog } from "./edit";
import { Erc721CollectionSearchForm } from "./form";
import { Erc721CollectionRoyaltyButton } from "../../../components/buttons";

export const Erc721Collection: FC = () => {
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
  } = useCollection<IErc721Collection, IErc721CollectionSearchDto>({
    baseUrl: "/erc721-collections",
    empty: {
      title: "",
      description: "",
    },
    search: {
      query: "",
      collectionStatus: [Erc721CollectionStatus.ACTIVE],
      collectionType: [],
    },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc721-collections"]} />

      <PageHeader message="pages.erc721-collections.title">
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

      <Erc721CollectionSearchForm onSubmit={handleSubmit} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((collection, i) => (
            <ListItem key={i}>
              <ListItemText>{collection.title}</ListItemText>
              <ListItemSecondaryAction>
                <Erc721CollectionRoyaltyButton collection={collection} />
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

      <Erc721CollectionEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
