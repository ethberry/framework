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
import { Create, Delete, FilterList } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { UniContractStatus, IErc721Collection, IErc721ContractSearchDto } from "@framework/types";

import { Erc721CollectionEditDialog } from "./edit";
import { Erc721CollectionSearchForm } from "./form";
import { Erc721TokenDeployButton } from "../../../components/buttons";
import { ContractActions, ContractActionsMenu } from "../../../components/menu";

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
    handleToggleFilters,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleDelete,
    handleDeleteCancel,
    handleSearch,
    handleChangePage,
    handleDeleteConfirm,
  } = useCollection<IErc721Collection, IErc721ContractSearchDto>({
    baseUrl: "/erc721-collections",
    empty: {
      title: "",
      description: emptyStateString,
    },
    search: {
      query: "",
      contractStatus: [UniContractStatus.ACTIVE],
      collectionType: [],
    },
    filter: ({ title, description, imageUrl, contractStatus }) => ({
      title,
      description,
      imageUrl,
      contractStatus,
    }),
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc721-collections"]} />

      <PageHeader message="pages.erc721-collections.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Erc721TokenDeployButton />
      </PageHeader>

      <Erc721CollectionSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((collection, i) => (
            <ListItem key={i}>
              <ListItemText>{collection.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(collection)}>
                  <Create />
                </IconButton>
                <IconButton
                  onClick={handleDelete(collection)}
                  disabled={collection.contractStatus === UniContractStatus.INACTIVE}
                >
                  <Delete />
                </IconButton>
                <ContractActionsMenu contract={collection} actions={[ContractActions.ROYALTY]} />
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
