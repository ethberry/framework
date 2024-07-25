import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";
import { useWeb3React } from "@web3-react/core";
import { constants } from "ethers";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { CollectionActions, useCollection } from "@gemunion/provider-collection";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { useUser } from "@gemunion/provider-user";
import { ListAction, ListActions, ListItem, StyledPagination } from "@framework/styled";
import type { IContract, IContractSearchDto, ITemplate, IUser } from "@framework/types";
import { BusinessType, ContractStatus, Erc20ContractFeatures } from "@framework/types";

import {
  AllowanceButton,
  BlacklistButton,
  ContractMintButton,
  Erc20ContractDeployButton,
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
import { WithCheckPermissionsListWrapper } from "../../../../components/wrappers";
import { Erc20ContractEditDialog } from "./edit";

export const Erc20Contract: FC = () => {
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
    handleDeleteConfirm,
    handleSearch,
    handleChangePage,
  } = useCollection<IContract, IContractSearchDto>({
    baseUrl: "/erc20/contracts",
    empty: {
      title: "",
      description: emptyStateString,
      symbol: "",
      address: "",
      decimals: 18,
      templates: [
        {
          cap: constants.WeiPerEther.toString(),
        } as ITemplate,
      ],
      merchantId: profile.merchantId,
    },
    search: {
      query: "",
      contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
      contractFeatures: [],
      merchantId: profile.merchantId,
    },
    filter: ({ id, title, description, merchantId, contractStatus, symbol, address, decimals }) =>
      id
        ? {
            title,
            description,
            merchantId,
            contractStatus,
          }
        : {
            title,
            description,
            merchantId,
            symbol,
            address,
            decimals,
          },
  });

  const { account = "" } = useWeb3React();

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc20", "erc20.contracts"]} />

      <PageHeader message="pages.erc20.contracts.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        {process.env.BUSINESS_TYPE === BusinessType.B2B ? (
          <Fragment />
        ) : (
          <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="Erc20TokenCreateButton">
            <FormattedMessage id="form.buttons.create" />
          </Button>
        )}
        <Erc20ContractDeployButton />
      </PageHeader>

      <ContractSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractFeaturesOptions={Erc20ContractFeatures}
      />

      <WithCheckPermissionsListWrapper isLoading={isLoading} count={rows.length}>
        {rows.map(contract => {
          return (
            <ListItem key={contract.id} account={account} contract={contract}>
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
            </ListItem>
          );
        })}
      </WithCheckPermissionsListWrapper>

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

      <Erc20ContractEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Grid>
  );
};
