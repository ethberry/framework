import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, List, ListItem, ListItemText } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { useUser } from "@gemunion/provider-user";
import { ListAction, ListActions } from "@framework/mui-lists";
import { StyledPagination } from "@framework/styled";
import type { IContract, IContractSearchDto, IUser } from "@framework/types";
import { ContractStatus, NativeContractFeatures } from "@framework/types";

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
import { SnapshotButton } from "../../../../components/buttons/hierarchy/contract/snapshot";
import { RoyaltyButton } from "../../../../components/buttons/common/royalty";
import { EthListenerAddButton } from "../../../../components/buttons/common/eth-add";
import { EthListenerRemoveButton } from "../../../../components/buttons/common/eth-remove";
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
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
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
            <ListItem key={contract.id} disableGutters>
              <ListItemText>{contract.title}</ListItemText>
              <ListActions dataTestId="ContractActionsMenuButton">
                <ListAction onClick={handleEdit(contract)} message="form.buttons.edit" icon={Create} />
                <ListAction
                  onClick={handleDelete(contract)}
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
                  icon={Delete}
                  message="form.buttons.delete"
                />
                <GrantRoleButton contract={contract} disabled={true} />
                <RevokeRoleButton contract={contract} disabled={true} />
                <RenounceRoleButton contract={contract} disabled={true} />
                <BlacklistButton contract={contract} disabled={true} />
                <UnBlacklistButton contract={contract} disabled={true} />
                <WhitelistButton contract={contract} disabled={true} />
                <UnWhitelistButton contract={contract} disabled={true} />
                <MintButton contract={contract} disabled={true} />
                <AllowanceButton contract={contract} disabled={true} />
                <TransferButton contract={contract} disabled={true} />
                <SnapshotButton contract={contract} disabled={true} />
                <RoyaltyButton contract={contract} disabled={true} />
                <EthListenerAddButton contract={contract} disabled={true} />
                <EthListenerRemoveButton contract={contract} disabled={true} />
              </ListActions>
            </ListItem>
          ))}
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

      <NativeTokenEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
