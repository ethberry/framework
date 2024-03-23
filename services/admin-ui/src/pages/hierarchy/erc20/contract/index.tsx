import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";
import { constants } from "ethers";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IContract, IContractSearchDto, ITemplate } from "@framework/types";
import { ContractStatus, Erc20ContractFeatures } from "@framework/types";

import { Erc20ContractDeployButton } from "../../../../components/buttons";
import { ContractSearchForm } from "../../../../components/forms/contract-search";
import { GrantRoleButton } from "../../../../components/buttons/extensions/grant-role";
import { RevokeRoleButton } from "../../../../components/buttons/extensions/revoke-role";
import { RenounceRoleButton } from "../../../../components/buttons/extensions/renounce-role";
import { BlacklistButton } from "../../../../components/buttons/extensions/blacklist-add";
import { UnBlacklistButton } from "../../../../components/buttons/extensions/blacklist-remove";
import { WhitelistButton } from "../../../../components/buttons/extensions/whitelist-add";
import { UnWhitelistButton } from "../../../../components/buttons/extensions/whitelist-remove";
import { MintButton } from "../../../../components/buttons/hierarchy/contract/mint";
import { AllowanceButton } from "../../../../components/buttons/hierarchy/contract/allowance";
import { TransferButton } from "../../../../components/buttons/common/transfer";
import { RoyaltyButton } from "../../../../components/buttons/common/royalty";
import { EthListenerAddButton } from "../../../../components/buttons/common/eth-add";
import { EthListenerRemoveButton } from "../../../../components/buttons/common/eth-remove";
import { Erc20ContractEditDialog } from "./edit";

export const Erc20Contract: FC = () => {
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

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc20", "erc20.contracts"]} />

      <PageHeader message="pages.erc20.contracts.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="Erc20TokenCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
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
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(contract => (
            <StyledListItem key={contract.id}>
              <ListItemText sx={{ width: 0.6 }}>{contract.title}</ListItemText>
              <ListItemText sx={{ width: 0.4 }}>{contract.symbol}</ListItemText>
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
                <MintButton contract={contract} />
                <AllowanceButton contract={contract} />
                <TransferButton contract={contract} />
                <RoyaltyButton contract={contract} />
                <EthListenerAddButton contract={contract} />
                <EthListenerRemoveButton contract={contract} />
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
        open={isDeleteDialogOpen}
        initialValues={selected}
      />

      <Erc20ContractEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
