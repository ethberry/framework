import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, List, ListItem, ListItemText, Pagination } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { useUser } from "@gemunion/provider-user";
import type { IContract, IContractSearchDto, IUser } from "@framework/types";
import { ContractFeatures, ContractStatus, Erc1155ContractFeatures, TokenType } from "@framework/types";

import { Erc1155ContractDeployButton } from "../../../../components/buttons";
import { ContractSearchForm } from "../../../../components/forms/contract-search";
import { GrantRoleMenuItem } from "../../../../components/menu/extensions/grant-role";
import { RevokeRoleMenuItem } from "../../../../components/menu/extensions/revoke-role";
import { RenounceRoleMenuItem } from "../../../../components/menu/extensions/renounce-role";
import { BlacklistMenuItem } from "../../../../components/menu/extensions/blacklist-add";
import { UnBlacklistMenuItem } from "../../../../components/menu/extensions/blacklist-remove";
import { WhitelistMenuItem } from "../../../../components/menu/extensions/whitelist-add";
import { UnWhitelistMenuItem } from "../../../../components/menu/extensions/whitelist-remove";
import { MintMenuItem } from "../../../../components/menu/hierarchy/contract/mint";
import { AllowanceMenuItem } from "../../../../components/menu/hierarchy/contract/allowance";
import { TransferMenuItem } from "../../../../components/menu/common/transfer";
import { SnapshotMenuItem } from "../../../../components/menu/hierarchy/contract/snapshot";
import { RoyaltyMenuItem } from "../../../../components/menu/common/royalty";
import { EthListenerAddMenuItem } from "../../../../components/menu/common/eth-add";
import { EthListenerRemoveMenuItem } from "../../../../components/menu/common/eth-remove";
import { ListAction, ListActions } from "../../../../components/common/lists";
import { Erc1155ContractEditDialog } from "./edit";

export const Erc1155Contract: FC = () => {
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
      />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(contract => {
            const itemDisabled =
              contract.contractStatus === ContractStatus.INACTIVE ||
              contract.contractFeatures.includes(ContractFeatures.EXTERNAL);
            return (
              <ListItem key={contract.id}>
                <ListItemText>{contract.title}</ListItemText>
                <ListActions dataTestId="ContractActionsMenuButton">
                  <ListAction onClick={handleEdit(contract)} icon={Create} message="form.buttons.edit" />
                  <ListAction
                    onClick={handleDelete(contract)}
                    disabled={contract.contractStatus === ContractStatus.INACTIVE}
                    icon={Delete}
                    message="form.buttons.delete"
                  />
                  <GrantRoleMenuItem contract={contract} disabled={itemDisabled} />
                  <RevokeRoleMenuItem contract={contract} disabled={itemDisabled} />
                  <RenounceRoleMenuItem contract={contract} disabled={itemDisabled} />
                  <BlacklistMenuItem contract={contract} disabled={itemDisabled} />
                  <UnBlacklistMenuItem contract={contract} disabled={itemDisabled} />
                  <WhitelistMenuItem contract={contract} disabled={itemDisabled} />
                  <UnWhitelistMenuItem contract={contract} disabled={itemDisabled} />
                  <MintMenuItem
                    contract={contract}
                    disabled={
                      itemDisabled ||
                      contract.contractType === TokenType.NATIVE ||
                      contract.contractFeatures.includes(ContractFeatures.GENES)
                    }
                  />
                  <AllowanceMenuItem
                    contract={contract}
                    disabled={itemDisabled || contract.contractFeatures.includes(ContractFeatures.SOULBOUND)}
                  />
                  <TransferMenuItem
                    contract={contract}
                    disabled={itemDisabled || contract.contractFeatures.includes(ContractFeatures.SOULBOUND)}
                  />
                  <SnapshotMenuItem contract={contract} disabled={itemDisabled} />
                  <RoyaltyMenuItem
                    contract={contract}
                    disabled={itemDisabled || contract.contractFeatures.includes(ContractFeatures.SOULBOUND)}
                  />
                  <EthListenerAddMenuItem contract={contract} disabled={itemDisabled} />
                  <EthListenerRemoveMenuItem contract={contract} disabled={itemDisabled} />
                </ListActions>
              </ListItem>
            );
          })}
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
