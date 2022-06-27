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
import { UniContractStatus, IErc1155Collection, IErc1155CollectionSearchDto } from "@framework/types";

import { Erc1155CollectionEditDialog } from "./edit";
import { Erc1155CollectionSearchForm } from "./form";
import { Erc1155TokenDeployButton } from "../../../components/buttons";
import { ContractActionsMenu } from "../../../components/menu";

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
    handleToggleFilters,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleDelete,
    handleDeleteCancel,
    handleSearch,
    handleChangePage,
    handleDeleteConfirm,
  } = useCollection<IErc1155Collection, IErc1155CollectionSearchDto>({
    baseUrl: "/erc1155-collections",
    empty: {
      title: "",
      description: emptyStateString,
    },
    search: {
      query: "",
      contractStatus: [UniContractStatus.ACTIVE],
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
      <Breadcrumbs path={["dashboard", "erc1155-collections"]} />

      <PageHeader message="pages.erc1155-collections.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Erc1155TokenDeployButton />
      </PageHeader>

      <Erc1155CollectionSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

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
                <ContractActionsMenu contract={collection} />
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
