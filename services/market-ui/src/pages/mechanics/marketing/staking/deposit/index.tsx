import { FC } from "react";
import { Button, Grid, ListItemText } from "@mui/material";
import { FilterList, Visibility } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { addSeconds, formatDistance } from "date-fns";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IStakingDeposit, IStakingDepositSearchDto } from "@framework/types";
import { StakingDepositStatus, TokenType } from "@framework/types";

import { StakingRewardButton } from "../../../../../components/buttons";
import { StakingDepositSearchForm } from "./form";
import { StakesViewDialog } from "./view";

export const StakingDeposit: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    handleToggleFilters,
    isViewDialogOpen,
    handleView,
    handleViewConfirm,
    handleViewCancel,
    handleSearch,
    handleChangePage,
  } = useCollection<IStakingDeposit, IStakingDepositSearchDto>({
    baseUrl: "/staking/deposits",
    search: {
      stakingDepositStatus: [StakingDepositStatus.ACTIVE],
      contractIds: [],
      deposit: {
        tokenType: [] as Array<TokenType>,
        contractIds: [],
      },
      reward: {
        tokenType: [] as Array<TokenType>,
        contractIds: [],
      },
    },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "staking", "staking.deposit"]} />

      <PageHeader message="pages.staking.deposit.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <StakingDepositSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(deposit => (
            <StyledListItem key={deposit.id}>
              <ListItemText sx={{ width: 0.6 }}>{deposit.stakingRule?.title}</ListItemText>
              <ListItemText sx={{ width: 0.4 }}>
                {deposit.startTimestamp
                  ? formatDistance(
                      addSeconds(new Date(deposit.startTimestamp), deposit.stakingRule?.durationAmount || 0),
                      Date.now(),
                      { addSuffix: true },
                    )
                  : ""}
              </ListItemText>
              <ListActions>
                <StakingRewardButton stake={deposit} />
                <ListAction onClick={handleView(deposit)} message="form.tips.view" icon={Visibility} />
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

      <StakesViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={isViewDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
