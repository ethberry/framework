import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, List, ListItem, ListItemText } from "@mui/material";
import { Create, Delete, FilterList } from "@mui/icons-material";

import { emptyStateString } from "@gemunion/draft-js-utils";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { ListAction, ListActions } from "@framework/mui-lists";
import { StyledPagination } from "@framework/styled";
import type { IContract, IContractSearchDto } from "@framework/types";
import { ContractStatus } from "@framework/types";

import { RaffleContractDeployButton } from "../../../../components/buttons";
import { ContractSearchForm } from "../../../../components/forms/contract-search";
import { GrantRoleButton } from "../../../../components/buttons/extensions/grant-role";
import { RevokeRoleButton } from "../../../../components/buttons/extensions/revoke-role";
import { RenounceRoleButton } from "../../../../components/buttons/extensions/renounce-role";
import { PauseButton } from "../../../../components/buttons/mechanics/common/pause";
import { UnPauseButton } from "../../../../components/buttons/mechanics/common/unpause";
import { RaffleRoundStartButton } from "../../../../components/buttons/mechanics/raffle/contract/round-start";
import { RaffleRoundEndButton } from "../../../../components/buttons/mechanics/raffle/contract/round-end";
import { RaffleScheduleButton } from "../../../../components/buttons/mechanics/raffle/contract/schedule";
import { EthListenerAddButton } from "../../../../components/buttons/common/eth-add";
import { EthListenerRemoveButton } from "../../../../components/buttons/common/eth-remove";
import { RaffleEditDialog } from "./edit";
import { ChainLinkSetSubscriptionButton } from "../../../../components/buttons/integrations/chain-link/set-subscription";

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
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
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
          {rows.map(contract => (
            <ListItem key={contract.id}>
              <ListItemText sx={{ width: 0.6 }}>{contract.title}</ListItemText>
              <ListActions dataTestId="RaffleActionsMenuButton">
                <ListAction onClick={handleEdit(contract)} message="form.buttons.edit" icon={Create} />
                <ListAction
                  onClick={handleDelete(contract)}
                  icon={Delete}
                  message="form.buttons.delete"
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
                />
                <GrantRoleButton contract={contract} disabled={contract.contractStatus === ContractStatus.INACTIVE} />
                <RevokeRoleButton contract={contract} disabled={contract.contractStatus === ContractStatus.INACTIVE} />
                <RenounceRoleButton
                  contract={contract}
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
                />
                <PauseButton contract={contract} disabled={contract.contractStatus === ContractStatus.INACTIVE} />
                <UnPauseButton contract={contract} disabled={contract.contractStatus === ContractStatus.INACTIVE} />
                <RaffleRoundStartButton
                  contract={contract}
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
                />
                <RaffleRoundEndButton
                  contract={contract}
                  disabled={
                    contract.contractStatus === ContractStatus.INACTIVE ||
                    !contract.parameters.vrfSubId ||
                    !contract.parameters.isConsumer
                  }
                />
                <RaffleScheduleButton
                  contract={contract}
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
                  refreshPage={handleRefreshPage}
                />
                <EthListenerAddButton
                  contract={contract}
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
                />
                <EthListenerRemoveButton
                  contract={contract}
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
                />
                <ChainLinkSetSubscriptionButton address={contract.address} />
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

      <RaffleEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
