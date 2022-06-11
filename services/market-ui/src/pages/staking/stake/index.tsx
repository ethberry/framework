import { FC } from "react";
import { FormattedMessage } from "react-intl";
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
import { FilterList, Casino } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { IStaking, IStakingItem, IStakingSearchDto, StakingStatus, TokenType } from "@framework/types";

import { StakingSearchForm } from "./form";

export const Stake: FC = () => {
  const { rows, count, search, isLoading, isFiltersOpen, handleToggleFilters, handleSearch, handleChangePage } =
    useCollection<IStaking, IStakingSearchDto>({
      baseUrl: "/staking",
      empty: {
        title: "",
        description: emptyStateString,
        deposit: {
          tokenType: TokenType.NATIVE,
          collection: 0,
        } as IStakingItem,
        reward: {
          tokenType: TokenType.NATIVE,
          collection: 0,
        } as IStakingItem,
        duration: 30,
        penalty: 100,
        recurrent: false,
      },
      search: {
        query: "",
        stakingStatus: [StakingStatus.ACTIVE, StakingStatus.NEW],
        deposit: {
          tokenType: [] as Array<TokenType>,
        },
        reward: {
          tokenType: [] as Array<TokenType>,
        },
      },
      filter: ({ id, title, description, ...rest }) => (id ? { title, description } : { title, description, ...rest }),
    });

  const handleStake = (_rule: IStaking) => {
    return () => {
      alert("Not implemented");
    };
  };

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "staking", "staking.stake"]} />

      <PageHeader message="pages.staking.stake.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters}>
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>

      <StakingSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((rule, i) => (
            <ListItem key={i}>
              <ListItemText>{rule.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleStake(rule)}>
                  <Casino />
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
    </Grid>
  );
};
