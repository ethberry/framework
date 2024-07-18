import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Create, Delete, FilterList } from "@mui/icons-material";
import { useWeb3React } from "@web3-react/core";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { CollectionActions, useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { ListAction, ListActions, ListItem, StyledPagination } from "@framework/styled";
import type { IContract, IContractSearchDto } from "@framework/types";
import { ContractStatus, LootContractFeatures } from "@framework/types";

import {
  BlacklistButton,
  ChainLinkSetSubscriptionButton,
  ContractAllowanceButton,
  EthListenerAddButton,
  EthListenerRemoveButton,
  GrantRoleButton,
  LootContractDeployButton,
  LootContractMintButton,
  PauseButton,
  RenounceRoleButton,
  RevokeRoleButton,
  RoyaltyButton,
  SetBaseTokenURIButton,
  TopUpButton,
  TransferButton,
  UnBlacklistButton,
  UnPauseButton,
  UnWhitelistButton,
  WhitelistButton,
} from "../../../../../components/buttons";
import { ContractSearchForm } from "../../../../../components/forms/contract-search";
import { WithCheckPermissionsListWrapper } from "../../../../../components/wrappers";
import { LootContractEditDialog } from "./edit";

export const LootContract: FC = () => {
  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
    isFiltersOpen,
    handleToggleFilters,
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
    baseUrl: "/loot/contracts",
    empty: {
      title: "",
      description: emptyStateString,
      contractStatus: ContractStatus.NEW,
    },
    search: {
      query: "",
      contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
      contractFeatures: [],
    },
    filter: ({ title, description, imageUrl, contractStatus }) => ({
      title,
      description,
      imageUrl,
      contractStatus,
    }),
  });

  const { account = "" } = useWeb3React();

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "loot", "loot.contracts"]} />

      <PageHeader message="pages.loot.contracts.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <LootContractDeployButton />
      </PageHeader>

      <ContractSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractFeaturesOptions={LootContractFeatures}
        onRefreshPage={handleRefreshPage}
      />

      <WithCheckPermissionsListWrapper isLoading={isLoading} count={rows.length}>
        {rows.map(contract => (
          <ListItem key={contract.id} account={account} contract={contract}>
            <ListItemText>{contract.title}</ListItemText>
            <ListActions dataTestId="LootActionsMenuButton">
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
              <TopUpButton contract={contract} />
              <GrantRoleButton contract={contract} />
              <RevokeRoleButton contract={contract} />
              <RenounceRoleButton contract={contract} />
              <BlacklistButton contract={contract} />
              <UnBlacklistButton contract={contract} />
              <WhitelistButton contract={contract} />
              <UnWhitelistButton contract={contract} />
              <PauseButton contract={contract} />
              <UnPauseButton contract={contract} />
              <LootContractMintButton contract={contract} />
              <ContractAllowanceButton contract={contract} />
              <RoyaltyButton contract={contract} />
              <SetBaseTokenURIButton contract={contract} />
              <TransferButton contract={contract} />
              <ChainLinkSetSubscriptionButton contract={contract} />
              <EthListenerAddButton contract={contract} />
              <EthListenerRemoveButton contract={contract} />
            </ListActions>
          </ListItem>
        ))}
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

      <LootContractEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Grid>
  );
};
