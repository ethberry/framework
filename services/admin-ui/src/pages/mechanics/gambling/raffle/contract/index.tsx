import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, List, ListItemText } from "@mui/material";
import { Create, Delete, FilterList } from "@mui/icons-material";

import { emptyStateString } from "@gemunion/draft-js-utils";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { ListAction, ListActions, StyledListItem, StyledPagination } from "@framework/styled";
import type { IContract, IContractSearchDto } from "@framework/types";
import { ContractStatus } from "@framework/types";

import { RaffleContractDeployButton } from "../../../../../components/buttons";
import { ContractSearchForm } from "../../../../../components/forms/contract-search";
import { GrantRoleButton } from "../../../../../components/buttons/extensions/grant-role";
import { RevokeRoleButton } from "../../../../../components/buttons/extensions/revoke-role";
import { RenounceRoleButton } from "../../../../../components/buttons/extensions/renounce-role";
import { PauseButton } from "../../../../../components/buttons/mechanics/common/pause";
import { UnPauseButton } from "../../../../../components/buttons/mechanics/common/unpause";
import { RaffleRoundStartButton } from "../../../../../components/buttons/mechanics/raffle/contract/round-start";
import { RaffleRoundEndButton } from "../../../../../components/buttons/mechanics/raffle/contract/round-end";
import { RaffleScheduleButton } from "../../../../../components/buttons/mechanics/raffle/contract/schedule";
import { EthListenerAddButton } from "../../../../../components/buttons/common/eth-add";
import { EthListenerRemoveButton } from "../../../../../components/buttons/common/eth-remove";
import { RaffleEditDialog } from "./edit";
import { ChainLinkSetSubscriptionButton } from "../../../../../components/buttons/integrations/chain-link/set-subscription";

export const RaffleContracts: FC = () => {
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
    baseUrl: "/raffle/contracts",
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
      <Breadcrumbs path={["dashboard", "raffle", "raffle.contracts"]} />

      <PageHeader message="pages.raffle.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <RaffleContractDeployButton />
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
              <StyledListItem key={contract.id}>
                <ListItemText sx={{ width: 0.6 }}>{contract.title}</ListItemText>
                <ListActions dataTestId="RaffleActionsMenuButton">
                  <ListAction onClick={handleEdit(contract)} message="form.buttons.edit" icon={Create} />
                  <ListAction
                    onClick={handleDelete(contract)}
                    icon={Delete}
                    message="form.buttons.delete"
                    disabled={itemDisabled}
                  />
                  <GrantRoleButton contract={contract} disabled={itemDisabled} />
                  <RevokeRoleButton contract={contract} disabled={itemDisabled} />
                  <RenounceRoleButton contract={contract} disabled={itemDisabled} />
                  <PauseButton contract={contract} disabled={itemDisabled} />
                  <UnPauseButton contract={contract} disabled={itemDisabled} />
                  <RaffleRoundStartButton contract={contract} disabled={itemDisabled} />
                  <RaffleRoundEndButton contract={contract} disabled={itemDisabled} />
                  <RaffleScheduleButton contract={contract} disabled={itemDisabled} refreshPage={handleRefreshPage} />
                  <EthListenerAddButton contract={contract} disabled={itemDisabled} />
                  <EthListenerRemoveButton contract={contract} disabled={itemDisabled} />
                  <ChainLinkSetSubscriptionButton contract={contract} />
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

      <RaffleEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};