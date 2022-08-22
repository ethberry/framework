import { FC } from "react";
import {
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Pagination,
} from "@mui/material";
import { FilterList, Visibility } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { IStakingStake, IStakingStakesSearchDto, StakeStatus, TokenType } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { StakesSearchForm } from "./form";
import { StakesViewDialog } from "./view";
import { StakingRewardButton } from "../../../../components/buttons";

export const StakingStakes: FC = () => {
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
  } = useCollection<IStakingStake, IStakingStakesSearchDto>({
    baseUrl: "/staking/stakes",
    search: {
      query: "",
      stakeStatus: [StakeStatus.ACTIVE],
      deposit: {
        tokenType: [] as Array<TokenType>,
      },
      reward: {
        tokenType: [] as Array<TokenType>,
      },
    },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "staking", "staking.stakes"]} />

      <PageHeader message="pages.staking.stakes.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <StakesSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((stake, i) => (
            <ListItem key={i}>
              <ListItemText>{stake.stakingRule?.title}</ListItemText>
              <ListItemSecondaryAction>
                <StakingRewardButton stake={stake} />
                <IconButton onClick={handleView(stake)}>
                  <Visibility />
                </IconButton>
              </ListItemSecondaryAction>
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

      <StakesViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={isViewDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
