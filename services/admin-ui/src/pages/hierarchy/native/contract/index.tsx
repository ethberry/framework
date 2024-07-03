import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { CollectionActions, useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IContract, IContractSearchDto } from "@framework/types";
import { BusinessType, ContractStatus, NativeContractFeatures } from "@framework/types";

import {
  ContractAllowanceButton,
  BlacklistButton,
  ContractMintButton,
  EthListenerAddButton,
  EthListenerRemoveButton,
  GrantRoleButton,
  RenounceRoleButton,
  RevokeRoleButton,
  RoyaltyButton,
  TransferButton,
  UnBlacklistButton,
  UnWhitelistButton,
  WhitelistButton,
} from "../../../../components/buttons";
import { ContractSearchForm } from "../../../../components/forms/contract-search";
import { NativeTokenEditDialog } from "./edit";

export const NativeContract: FC = () => {
  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
    isFiltersOpen,
    handleToggleFilters,
    handleCreate,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleDelete,
    handleDeleteCancel,
    handleDeleteConfirm,
    handleSearch,
    handleChangePage,
    handleRefreshPage,
  } = useCollection<IContract, IContractSearchDto>({
    baseUrl: "/native/contracts",
    empty: {
      title: "",
      description: emptyStateString,
      symbol: "",
    },
    search: {
      query: "",
      contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
      contractFeatures: [],
    },
    filter: ({ title, description, contractStatus, symbol }) => ({ title, description, contractStatus, symbol }),
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "native", "native.contracts"]} />

      <PageHeader message="pages.native.contracts.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        {process.env.BUSINESS_TYPE === BusinessType.B2B ? (
          <Fragment />
        ) : (
          <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="NativeTokenCreateButton">
            <FormattedMessage id="form.buttons.create" />
          </Button>
        )}
      </PageHeader>

      <ContractSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractFeaturesOptions={NativeContractFeatures}
        onRefreshPage={handleRefreshPage}
      />

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(contract => (
            <StyledListItem key={contract.id}>
              <ListItemText>{contract.title}</ListItemText>
              <ListActions dataTestId="ContractActionsMenuButton">
                <ListAction
                  onClick={handleEdit(contract)}
                  message="form.buttons.edit"
                  dataTestId="ContractEditButton"
                  icon={Create}
                />
                <ListAction
                  onClick={handleDelete(contract)}
                  message="form.buttons.delete"
                  dataTestId="ContractDeleteButton"
                  icon={Delete}
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
                />
                <GrantRoleButton contract={contract} disabled={true} />
                <RevokeRoleButton contract={contract} disabled={true} />
                <RenounceRoleButton contract={contract} disabled={true} />
                <BlacklistButton contract={contract} disabled={true} />
                <UnBlacklistButton contract={contract} disabled={true} />
                <WhitelistButton contract={contract} disabled={true} />
                <UnWhitelistButton contract={contract} disabled={true} />
                <ContractMintButton contract={contract} disabled={true} />
                <ContractAllowanceButton contract={contract} disabled={true} />
                <TransferButton contract={contract} disabled={true} />
                <RoyaltyButton contract={contract} disabled={true} />
                <EthListenerAddButton contract={contract} disabled={true} />
                <EthListenerRemoveButton contract={contract} disabled={true} />
              </ListActions>
            </StyledListItem>
          ))}
        </StyledListWrapper>
      </ProgressOverlay>

      <StyledPagination
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />

      <DeleteDialog
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        open={action === CollectionActions.delete}
        initialValues={selected}
      />

      <NativeTokenEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Grid>
  );
};
