import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import {
  BusinessType,
  IContract,
  IContractSearchDto,
  ContractFeatures,
  ContractStatus,
  Erc721ContractFeatures,
} from "@framework/types";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";

import { Erc721ContractDeployButton } from "../../../../components/buttons";
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
import { ChainLinkSetSubscriptionButton } from "../../../../components/buttons/integrations/chain-link/set-subscription";
import { SetBaseTokenURIButton } from "../../../../components/buttons/hierarchy/contract/set-base-token-uri";
import { Erc721ContractEditDialog } from "./edit";

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
    baseUrl: "/erc721/contracts",
    empty: {
      title: "",
      description: emptyStateString,
      parameters: {
        vrfSubId: "",
      },
      symbol: "",
      address: "",
      imageUrl: "",
      contractFeatures: [],
    },
    search: {
      query: "",
      contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
      contractFeatures: [],
    },
    filter: ({ id, title, description, imageUrl, contractStatus, symbol, address }) =>
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
            symbol,
            address,
            imageUrl,
          },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc721", "erc721.contracts"]} />

      <PageHeader message="pages.erc721.contracts.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        {process.env.BUSINESS_TYPE === BusinessType.B2B ? null : (
          <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="Erc721TokenCreateButton">
            <FormattedMessage id="form.buttons.create" />
          </Button>
        )}
        <Erc721ContractDeployButton />
      </PageHeader>

      <ContractSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractFeaturesOptions={Erc721ContractFeatures}
        onRefreshPage={handleRefreshPage}
      />

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(contract => (
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
                <MintButton contract={contract} />
                <AllowanceButton contract={contract} />
                <TransferButton contract={contract} />
                <RoyaltyButton contract={contract} />
                <SetBaseTokenURIButton contract={contract} />
                <EthListenerAddButton contract={contract} />
                <EthListenerRemoveButton contract={contract} />
                <ChainLinkSetSubscriptionButton
                  contract={contract}
                  disabled={
                    contract.contractStatus === ContractStatus.INACTIVE ||
                    contract.contractFeatures.includes(ContractFeatures.EXTERNAL) ||
                    (!contract.contractFeatures.includes(ContractFeatures.RANDOM) &&
                      !contract.contractFeatures.includes(ContractFeatures.GENES))
                  }
                />
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

      <Erc721ContractEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
