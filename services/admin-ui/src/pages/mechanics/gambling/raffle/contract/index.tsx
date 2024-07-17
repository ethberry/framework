import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Create, Delete, FilterList } from "@mui/icons-material";
import { useWeb3React } from "@web3-react/core";

import { emptyStateString } from "@gemunion/draft-js-utils";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { CollectionActions, useCollection } from "@gemunion/react-hooks";
import {
  ListAction,
  ListActions,
  ListWrapperProvider,
  StyledListItem,
  StyledListWrapper,
  StyledPagination,
} from "@framework/styled";
import type { IContract, IContractSearchDto } from "@framework/types";
import { ContractStatus, IAccessControl } from "@framework/types";

import {
  ChainLinkSetSubscriptionButton,
  EthListenerAddButton,
  EthListenerRemoveButton,
  GrantRoleButton,
  PauseButton,
  RaffleContractDeployButton,
  RaffleRoundEndButton,
  RaffleRoundStartButton,
  RaffleScheduleButton,
  RenounceRoleButton,
  RevokeRoleButton,
  UnPauseButton,
} from "../../../../../components/buttons";
import { ContractSearchForm } from "../../../../../components/forms/contract-search";
import { RaffleEditDialog } from "./edit";
import { useCheckPermissions } from "../../../../../shared";

export const RaffleContracts: FC = () => {
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

  const { checkPermissions } = useCheckPermissions();
  const { account = "" } = useWeb3React();

  return (
    <ListWrapperProvider<IAccessControl> callback={checkPermissions}>
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
          <StyledListWrapper count={rows.length} isLoading={isLoading} rows={rows} account={account} path={"address"}>
            {rows.map(contract => (
              <StyledListItem key={contract.id}>
                <ListItemText sx={{ width: 0.6 }}>{contract.title}</ListItemText>
                <ListActions dataTestId="RaffleActionsMenuButton">
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
                  <GrantRoleButton contract={contract} />
                  <RevokeRoleButton contract={contract} />
                  <RenounceRoleButton contract={contract} />
                  <PauseButton contract={contract} />
                  <UnPauseButton contract={contract} />
                  <RaffleRoundStartButton contract={contract} />
                  <RaffleRoundEndButton contract={contract} />
                  <RaffleScheduleButton contract={contract} refreshPage={handleRefreshPage} />
                  <ChainLinkSetSubscriptionButton contract={contract} />
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
          open={action === CollectionActions.delete}
          initialValues={selected}
        />

        <RaffleEditDialog
          onCancel={handleEditCancel}
          onConfirm={handleEditConfirm}
          open={action === CollectionActions.edit}
          initialValues={selected}
        />
      </Grid>
    </ListWrapperProvider>
  );
};
