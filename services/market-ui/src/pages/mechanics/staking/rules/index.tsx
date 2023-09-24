import { FC } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Grid, List, ListItem, ListItemText } from "@mui/material";
import { FilterList, Visibility } from "@mui/icons-material";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { emptyPrice } from "@gemunion/mui-inputs-asset";
import { ListAction, ListActions } from "@framework/mui-lists";
import { StyledPagination } from "@framework/styled";
import type { IStakingRule, IStakingRuleDepositSearchDto, IStakingRuleSearchDto } from "@framework/types";
import {
  DurationUnit,
  IStakingRuleRewardSearchDto,
  ModuleType,
  StakingDepositTokenType,
  StakingRewardTokenType,
} from "@framework/types";

import { StakingAllowanceButton, StakingDepositButton } from "../../../../components/buttons";
import { emptyContract } from "../../../../components/common/interfaces";
import { StakingViewDialog } from "./view";

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
        tokenType: [] as Array<StakingDepositTokenType>,
      } as IStakingRuleDepositSearchDto,
      reward: {
        tokenType: [] as Array<StakingRewardTokenType>,
      } as IStakingRuleRewardSearchDto,
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

  const { formatMessage } = useIntl();

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

      <CommonSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        testId="StakingRuleSearchForm"
      >
        <Grid container columnSpacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <EntityInput
              name="contractIds"
              controller="contracts"
              multiple
              data={{ contractModule: [ModuleType.STAKING] }}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectInput
              multiple
              name="deposit.tokenType"
              options={StakingDepositTokenType}
              label={formatMessage({ id: "form.labels.deposit" })}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectInput
              multiple
              name="reward.tokenType"
              options={StakingRewardTokenType}
              label={formatMessage({ id: "form.labels.reward" })}
            />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(rule => (
            <ListItem key={rule.id}>
              <ListItemText>{rule.title}</ListItemText>
              <ListActions>
                <StakingAllowanceButton rule={rule} />
                <StakingDepositButton rule={rule} />
                <ListAction onClick={handleView(rule)} icon={Visibility} message="form.tips.view" />
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

      <StakingViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={isViewDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
