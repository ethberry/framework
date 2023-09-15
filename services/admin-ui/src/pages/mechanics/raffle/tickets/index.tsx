import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, List, ListItem, ListItemText, Pagination } from "@mui/material";
import { Create, Delete, FilterList } from "@mui/icons-material";

import { emptyStateString } from "@gemunion/draft-js-utils";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import type { IContract, IContractSearchDto } from "@framework/types";
import { ContractStatus, Erc721ContractTemplates } from "@framework/types";

import { Erc721ContractDeployButton } from "../../../../components/buttons";
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
import { RaffleEditDialog } from "./edit";

export const RaffleTickets: FC = () => {
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
    baseUrl: "/raffle/tickets",
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

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "raffle", "raffle.tickets"]} />

      <PageHeader message="pages.raffle.tickets.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Erc721ContractDeployButton contractTemplate={Erc721ContractTemplates.RAFFLE} />
      </PageHeader>

      <ContractSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractFeaturesOptions={{}}
        onRefreshPage={handleRefreshPage}
      />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(contract => {
            const itemDisabled = contract.contractStatus === ContractStatus.INACTIVE;
            return (
              <ListItem key={contract.id}>
                <ListItemText sx={{ width: 0.6 }}>{contract.title}</ListItemText>
                <ListActions>
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
                  <MintMenuItem contract={contract} disabled={itemDisabled} />
                  <AllowanceMenuItem contract={contract} disabled={itemDisabled} />
                  <TransferMenuItem contract={contract} disabled={itemDisabled} />
                  <SnapshotMenuItem contract={contract} disabled={itemDisabled} />
                  <RoyaltyMenuItem contract={contract} disabled={itemDisabled} />
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

      <RaffleEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
