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

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { emptyPrice } from "@gemunion/mui-inputs-asset";
import type { IStakingRule, IStakingRuleItemSearchDto, IStakingRuleSearchDto } from "@framework/types";
import { DurationUnit, TokenType } from "@framework/types";

import { StakingAllowanceButton, StakingDepositButton } from "../../../../components/buttons";
import { StakingRuleSearchForm } from "./form";
import { StakingViewDialog } from "./view";
import { emptyContract } from "../../../../components/common/interfaces";

export const StakingRules: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    isViewDialogOpen,
    handleView,
    handleViewCancel,
    handleViewConfirm,
    handleToggleFilters,
    handleSearch,
    handleChangePage,
  } = useCollection<IStakingRule, IStakingRuleSearchDto>({
    baseUrl: "/staking/rules",
    empty: {
      title: "",
      contract: emptyContract,
      description: emptyStateString,
      deposit: emptyPrice,
      reward: emptyPrice,
      durationAmount: 2592000,
      durationUnit: DurationUnit.DAY,
      penalty: 100,
      recurrent: false,
    },
    search: {
      query: "",
      contractIds: [],
      deposit: {
        tokenType: [] as Array<TokenType>,
      } as IStakingRuleItemSearchDto,
      reward: {
        tokenType: [] as Array<TokenType>,
      } as IStakingRuleItemSearchDto,
    },
    filter: ({ id, title, contract, description, ...rest }) =>
      id
        ? { title, description, contract }
        : {
            title,
            description,
            contract,
            ...rest,
          },
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

      <StakingRuleSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((rule, i) => (
            <ListItem key={i}>
              <ListItemText>{rule.title}</ListItemText>
              <ListItemSecondaryAction>
                <StakingAllowanceButton rule={rule} />
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

      <StakingViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={isViewDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
