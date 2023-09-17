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
import { ContractStatus, NativeContractFeatures } from "@framework/types";

import { ContractSearchForm } from "../../../../components/forms/contract-search";
import { ListAction, ListActions } from "../../../../components/common/lists";
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
import { NativeTokenEditDialog } from "./edit";

export const NativeContract: FC = () => {
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
    baseUrl: "/native/contracts",
    empty: {
      title: "",
      description: emptyStateString,
      symbol: "",
      merchantId: profile.merchantId,
    },
    search: {
      query: "",
      contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
      contractFeatures: [],
      merchantId: profile.merchantId,
    },
    filter: ({ title, description, contractStatus, symbol, merchantId }) => ({
      title,
      description,
      contractStatus,
      symbol,
      merchantId,
    }),
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "native", "native.contracts"]} />

      <PageHeader message="pages.native.contracts.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="NativeTokenCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <ContractSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractFeaturesOptions={NativeContractFeatures}
      />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(contract => (
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
                <GrantRoleMenuItem contract={contract} disabled={true} />
                <RevokeRoleMenuItem contract={contract} disabled={true} />
                <RenounceRoleMenuItem contract={contract} disabled={true} />
                <BlacklistMenuItem contract={contract} disabled={true} />
                <UnBlacklistMenuItem contract={contract} disabled={true} />
                <WhitelistMenuItem contract={contract} disabled={true} />
                <UnWhitelistMenuItem contract={contract} disabled={true} />
                <MintMenuItem contract={contract} disabled={true} />
                <AllowanceMenuItem contract={contract} disabled={true} />
                <TransferMenuItem contract={contract} disabled={true} />
                <SnapshotMenuItem contract={contract} disabled={true} />
                <RoyaltyMenuItem contract={contract} disabled={true} />
                <EthListenerAddMenuItem contract={contract} disabled={true} />
                <EthListenerRemoveMenuItem contract={contract} disabled={true} />
              </ListActions>
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

      <NativeTokenEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
