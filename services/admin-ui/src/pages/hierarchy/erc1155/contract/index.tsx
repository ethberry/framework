import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, List, ListItem, ListItemText, Pagination } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import type { IContract, IContractSearchDto } from "@framework/types";
import { ContractFeatures, ContractStatus, Erc1155ContractFeatures } from "@framework/types";

import { Erc1155ContractDeployButton } from "../../../../components/buttons";
import { ContractActionsMenu } from "../../../../components/menu/hierarchy/contract";
import { ContractSearchForm } from "../../../../components/forms/contract-search";
import { Erc1155ContractEditDialog } from "./edit";
import { StyledListActions } from "../../../../components/common/lists/list-actions";
import { StyledListAction } from "../../../../components/common/lists/list-action";
import { RoyaltyMenuItem } from "../../../../components/menu/common/royalty";
import { AllowanceMenuItem } from "../../../../components/menu/hierarchy/contract/allowance";

export const Erc1155Contract: FC = () => {
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
    handleCreate,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleDelete,
    handleDeleteCancel,
    handleSearch,
    handleChangePage,
    handleDeleteConfirm,
    handleRefreshPage,
  } = useCollection<IContract, IContractSearchDto>({
    baseUrl: "/erc1155/contracts",
    empty: {
      title: "",
      description: emptyStateString,
      address: "",
      imageUrl: "",
    },
    search: {
      query: "",
      contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
      contractFeatures: [],
    },
    filter: ({ id, title, description, imageUrl, contractStatus, address }) =>
      id
        ? {
            title,
            description,
            imageUrl,
            contractStatus,
          }
        : {
            title,
            description,
            address,
            imageUrl,
          },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc1155", "erc1155.contracts"]} />

      <PageHeader message="pages.erc1155.contracts.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="Erc1155TokenCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
        <Erc1155ContractDeployButton />
      </PageHeader>

      <ContractSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractFeaturesOptions={Erc1155ContractFeatures}
        onRefreshPage={handleRefreshPage}
      />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(contract => (
            <ListItem key={contract.id}>
              <ListItemText>{contract.title}</ListItemText>
              <StyledListActions
                itemsVisibleOnMobile={3}
                disabled={
                  contract.contractStatus === ContractStatus.INACTIVE ||
                  contract.contractFeatures.includes(ContractFeatures.EXTERNAL)
                }
              >
                <StyledListAction onClick={handleEdit(contract)} icon={Create} message="form.buttons.edit" />
                <StyledListAction
                  onClick={handleDelete(contract)}
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
                  icon={Delete}
                  message="form.buttons.delete"
                />
                <RoyaltyMenuItem contract={contract} />
                <AllowanceMenuItem contract={contract} />
              </StyledListActions>
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

      <Erc1155ContractEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
