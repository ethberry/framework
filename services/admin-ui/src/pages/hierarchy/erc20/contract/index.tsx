import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";
import { useWeb3React } from "@web3-react/core";
import { constants } from "ethers";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { CollectionActions, useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import {
  ListAction,
  ListActions,
  ListWrapperProvider,
  StyledListItem,
  StyledListWrapper,
  StyledPagination,
} from "@framework/styled";
import type { IAccessControl, IContract, IContractSearchDto, ITemplate } from "@framework/types";
import { BusinessType, ContractStatus, Erc20ContractFeatures, IPermission, IPermissionControl } from "@framework/types";

import { Erc20ContractDeployButton, GrantRoleButton } from "../../../../components/buttons";
import { ContractSearchForm } from "../../../../components/forms/contract-search";
import { Erc20ContractEditDialog } from "./edit";
import { useCheckPermissions } from "../../../../utils/use-check-permissions";

export const Erc20Contract: FC = () => {
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
    },
    search: {
      query: "",
      contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
      contractFeatures: [],
    },
    filter: ({ id, title, description, contractStatus, symbol, address, decimals }) =>
      id
        ? {
            title,
            description,
            contractStatus,
          }
        : {
            title,
            description,
            symbol,
            address,
            decimals,
          },
  });

  const { checkPermissions } = useCheckPermissions();
  const { account = "" } = useWeb3React();
  return (
    <ListWrapperProvider<IAccessControl> callback={checkPermissions}>
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
          onRefreshPage={handleRefreshPage}
        />

        <ProgressOverlay isLoading={isLoading}>
          <StyledListWrapper<IPermissionControl, Array<IPermission>>
            count={rows.length}
            isLoading={isLoading}
            rows={rows}
            account={account}
          >
            {rows.map(contract => (
              <StyledListItem key={contract.id}>
                <ListItemText sx={{ width: 0.6 }}>{contract.title}</ListItemText>
                <ListItemText sx={{ width: 0.4 }}>{contract.symbol}</ListItemText>
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
                  {/* default admin role */}
                  <GrantRoleButton contract={contract} />
                  {/* <RevokeRoleButton contract={contract} /> */}
                  {/* <RenounceRoleButton contract={contract} /> */}
                  {/* <BlacklistButton contract={contract} /> */}
                  {/* <UnBlacklistButton contract={contract} /> */}
                  {/* <WhitelistButton contract={contract} /> */}
                  {/* <UnWhitelistButton contract={contract} /> */}
                  {/* <RoyaltyButton contract={contract} /> */}
                  {/* minter role */}
                  {/* <ContractMintButton contract={contract} /> */}
                  {/* always active */}
                  {/* <ContractAllowanceButton contract={contract} /> */}
                  {/* <TransferButton contract={contract} /> */}
                  {/* <EthListenerAddButton contract={contract} /> */}
                  {/* <EthListenerRemoveButton contract={contract} /> */}
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

        <Erc20ContractEditDialog
          onCancel={handleEditCancel}
          onConfirm={handleEditConfirm}
          open={action === CollectionActions.edit}
          initialValues={selected}
        />
      </Grid>
    </ListWrapperProvider>
  );
};
