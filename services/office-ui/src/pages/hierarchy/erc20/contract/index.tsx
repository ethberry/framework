import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, List, ListItemText } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";
import { constants } from "ethers";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { useUser } from "@gemunion/provider-user";
import { ListAction, ListActions, StyledListItem, StyledPagination } from "@framework/styled";
import type { IContract, IContractSearchDto, ITemplate, IUser } from "@framework/types";
import { ContractFeatures, ContractStatus, Erc20ContractFeatures, TokenType } from "@framework/types";

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
  const { profile } = useUser<IUser>();

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
      />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(contract => {
            const itemDisabled =
              contract.contractStatus === ContractStatus.INACTIVE ||
              contract.contractFeatures.includes(ContractFeatures.EXTERNAL);
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
                  <GrantRoleButton contract={contract} disabled={itemDisabled} />
                  <RevokeRoleButton contract={contract} disabled={itemDisabled} />
                  <RenounceRoleButton contract={contract} disabled={itemDisabled} />
                  <BlacklistButton contract={contract} disabled={itemDisabled} />
                  <UnBlacklistButton contract={contract} disabled={itemDisabled} />
                  <WhitelistButton contract={contract} disabled={itemDisabled} />
                  <UnWhitelistButton contract={contract} disabled={itemDisabled} />
                  <MintButton
                    contract={contract}
                    disabled={
                      itemDisabled ||
                      contract.contractType === TokenType.NATIVE ||
                      contract.contractFeatures.includes(ContractFeatures.GENES)
                    }
                  />
                  <AllowanceButton
                    contract={contract}
                    disabled={itemDisabled || contract.contractFeatures.includes(ContractFeatures.SOULBOUND)}
                  />
                  <TransferButton
                    contract={contract}
                    disabled={itemDisabled || contract.contractFeatures.includes(ContractFeatures.SOULBOUND)}
                  />
                  <RoyaltyButton
                    contract={contract}
                    disabled={itemDisabled || contract.contractFeatures.includes(ContractFeatures.SOULBOUND)}
                  />
                  <EthListenerAddButton contract={contract} disabled={itemDisabled} />
                  <EthListenerRemoveButton contract={contract} disabled={itemDisabled} />
                </ListActions>
              </StyledListItem>
            );
          })}
        </List>
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
