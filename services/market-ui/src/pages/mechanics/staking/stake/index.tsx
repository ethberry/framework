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
import { FilterList, Visibility } from "@mui/icons-material";
import { stringify } from "qs";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { IStakingRule, IStakingSearchDto, StakingStatus, TokenType } from "@framework/types";
import { IPaginationDto } from "@gemunion/types-collection";

import { StakingDepositButton } from "../../../../components/buttons";
import { StakingSearchForm } from "./form";
import { emptyPrice } from "../../../../components/inputs/empty-price";
// import { StakingViewDialog } from "./view";

export const Stake: FC = () => {
  const {
    rows,
    count,
    search,
    isLoading,
    isFiltersOpen,
    handleView,
    handleToggleFilters,
    handleSearch,
    handleChangePage,
  } = useCollection<IStakingRule, IStakingSearchDto>({
    baseUrl: "/staking/rules",
    redirect: <S extends IPaginationDto>(baseUrl: string, search: Omit<S, "skip" | "take">, id?: number) =>
      id ? `/staking/${id}` : `/staking?${stringify(search)}`,
    empty: {
      title: "",
      description: emptyStateString,
      deposit: emptyPrice,
      reward: emptyPrice,
      duration: 30,
      penalty: 100,
      recurrent: false,
    },
    search: {
      query: "",
      stakingStatus: [StakingStatus.ACTIVE],
      deposit: {
        tokenType: [] as Array<TokenType>,
      },
      reward: {
        tokenType: [] as Array<TokenType>,
      },
    },
    filter: ({ id, title, description, ...rest }) => (id ? { title, description } : { title, description, ...rest }),
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "staking", "staking.rules"]} />

      <PageHeader message="pages.staking.rules.title">
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
                <StakingDepositButton rule={rule} />
                <IconButton onClick={handleView(rule)}>
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

      {/* <StakingViewDialog */}
      {/*  onCancel={handleViewCancel} */}
      {/*  onConfirm={handleViewConfirm} */}
      {/*  open={isViewDialogOpen} */}
      {/*  initialValues={selected} */}
      {/* /> */}
    </Grid>
  );
};
