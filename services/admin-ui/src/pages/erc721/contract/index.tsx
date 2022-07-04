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
import { ContractStatus, Erc721ContractTemplate, IContract, IContractSearchDto } from "@framework/types";

import { Erc721CollectionEditDialog } from "./edit";
import { Erc721TokenDeployButton } from "../../../components/buttons";
import { ContractActions, ContractActionsMenu } from "../../../components/menu";
import { ContractSearchForm } from "../../../components/forms/contract-search";

export const Erc721Contract: FC = () => {
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
  } = useCollection<IContract, IContractSearchDto>({
    baseUrl: "/erc721-contracts",
    empty: {
      title: "",
      description: emptyStateString,
    },
    search: {
      query: "",
      contractStatus: [ContractStatus.ACTIVE],
      contractTemplate: [],
      contractRole: [],
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
      <Breadcrumbs path={["dashboard", "erc721-contracts"]} />

      <PageHeader message="pages.erc721-contracts.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Erc721TokenDeployButton />
      </PageHeader>

      <ContractSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractTemplateOptions={Erc721ContractTemplate}
      />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((contract, i) => (
            <ListItem key={i}>
              <ListItemText>{contract.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(contract)}>
                  <Create />
                </IconButton>
                <IconButton
                  onClick={handleDelete(contract)}
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
                >
                  <Delete />
                </IconButton>
                <ContractActionsMenu contract={contract} actions={[ContractActions.ROYALTY]} />
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
