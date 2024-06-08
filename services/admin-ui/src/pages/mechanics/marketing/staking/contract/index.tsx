import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Create, Delete, FilterList } from "@mui/icons-material";

import { emptyStateString } from "@gemunion/draft-js-utils";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection, CollectionActions } from "@gemunion/react-hooks";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IContract, IContractSearchDto } from "@framework/types";
import { ContractStatus, StakingContractFeatures } from "@framework/types";

import { StakingDeployButton } from "../../../../../components/buttons";
import { ContractSearchForm } from "../../../../../components/forms/contract-search";
import { GrantRoleButton } from "../../../../../components/buttons/extensions/grant-role";
import { RevokeRoleButton } from "../../../../../components/buttons/extensions/revoke-role";
import { RenounceRoleButton } from "../../../../../components/buttons/extensions/renounce-role";
import { PauseButton } from "../../../../../components/buttons/mechanics/common/pause";
import { UnPauseButton } from "../../../../../components/buttons/mechanics/common/unpause";
import { AllowanceButton } from "../../../../../components/buttons/mechanics/staking/allowance";
import { TopUpButton } from "../../../../../components/buttons/mechanics/common/top-up";
import { EthListenerAddButton } from "../../../../../components/buttons/common/eth-add";
import { EthListenerRemoveButton } from "../../../../../components/buttons/common/eth-remove";
import { StakingWithdrawPenaltyButton } from "../../../../../components/buttons/mechanics/staking/withdraw-penalty";
import { StakingCheckBalanceButton } from "../../../../../components/buttons/mechanics/staking/check-balances";
import { StakingEditDialog } from "./edit";

export const StakingContracts: FC = () => {
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
    baseUrl: "/staking/contracts",
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
      <Breadcrumbs path={["dashboard", "staking", "staking.contracts"]} />

      <PageHeader message="pages.staking.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <StakingDeployButton />
      </PageHeader>

      <ContractSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractFeaturesOptions={StakingContractFeatures}
        onRefreshPage={handleRefreshPage}
      />

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(contract => (
            <StyledListItem key={contract.id}>
              <ListItemText sx={{ width: 0.6 }}>{contract.title}</ListItemText>
              <ListActions dataTestId="StakingActionsMenuButton">
                <ListAction onClick={handleEdit(contract)} message="form.buttons.edit" icon={Create} />
                <ListAction
                  onClick={handleDelete(contract)}
                  icon={Delete}
                  message="form.buttons.delete"
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
                />
                <GrantRoleButton contract={contract} />
                <RevokeRoleButton contract={contract} />
                <RenounceRoleButton contract={contract} />
                <PauseButton contract={contract} />
                <UnPauseButton contract={contract} />
                <AllowanceButton contract={contract} />
                <TopUpButton contract={contract} />
                <StakingWithdrawPenaltyButton contract={contract} />
                <StakingCheckBalanceButton contract={contract} />
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

      <StakingEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Grid>
  );
};
