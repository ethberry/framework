import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { CollectionActions, useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { useUser } from "@gemunion/provider-user";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import {
  BusinessType,
  ContractStatus,
  Erc1155ContractFeatures,
  IContract,
  IContractSearchDto,
  IUser,
} from "@framework/types";

import {
  AllowanceButton,
  BlacklistButton,
  Erc1155ContractDeployButton,
  EthListenerAddButton,
  EthListenerRemoveButton,
  GrantRoleButton,
  ContractMintButton,
  RenounceRoleButton,
  RevokeRoleButton,
  RoyaltyButton,
  TransferButton,
  UnBlacklistButton,
  UnWhitelistButton,
  WhitelistButton,
} from "../../../../components/buttons";
import { ContractSearchForm } from "../../../../components/forms/contract-search";
import { Erc1155ContractEditDialog } from "./edit";

export const Erc1155Contract: FC = () => {
  const { profile } = useUser<IUser>();

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
    handleSearch,
    handleChangePage,
    handleDeleteConfirm,
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
      merchantId: profile.merchantId,
    },
    filter: ({ id, title, description, imageUrl, merchantId, contractStatus, address }) =>
      id
        ? {
            title,
            description,
            imageUrl,
            merchantId,
            contractStatus,
          }
        : {
            title,
            description,
            address,
            imageUrl,
            merchantId,
          },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc1155", "erc1155.contracts"]} />

      <PageHeader message="pages.erc1155.contracts.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        {process.env.BUSINESS_TYPE === BusinessType.B2B ? (
          <Fragment />
        ) : (
          <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="Erc1155TokenCreateButton">
            <FormattedMessage id="form.buttons.create" />
          </Button>
        )}
        <Erc1155ContractDeployButton />
      </PageHeader>

      <ContractSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractFeaturesOptions={Erc1155ContractFeatures}
      />

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(contract => {
            return (
              <StyledListItem key={contract.id}>
                <ListItemText>{contract.title}</ListItemText>
                <ListActions dataTestId="ContractActionsMenuButton">
                  <ListAction onClick={handleEdit(contract)} message="form.buttons.edit" icon={Create} />
                  <ListAction
                    onClick={handleDelete(contract)}
                    disabled={contract.contractStatus === ContractStatus.INACTIVE}
                    icon={Delete}
                    message="form.buttons.delete"
                  />
                  <GrantRoleButton contract={contract} />
                  <RevokeRoleButton contract={contract} />
                  <RenounceRoleButton contract={contract} />
                  <BlacklistButton contract={contract} />
                  <UnBlacklistButton contract={contract} />
                  <WhitelistButton contract={contract} />
                  <UnWhitelistButton contract={contract} />
                  <ContractMintButton contract={contract} />
                  <AllowanceButton contract={contract} />
                  <TransferButton contract={contract} />
                  <RoyaltyButton contract={contract} />
                  <EthListenerAddButton contract={contract} />
                  <EthListenerRemoveButton contract={contract} />
                </ListActions>
              </StyledListItem>
            );
          })}
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

      <Erc1155ContractEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Grid>
  );
};
