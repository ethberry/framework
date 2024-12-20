import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Create, FilterList } from "@mui/icons-material";

import { SelectInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { CollectionActions, useCollection } from "@gemunion/provider-collection";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type {
  IStakingRule,
  IStakingRuleDepositSearchDto,
  IStakingRuleRewardSearchDto,
  IStakingRuleSearchDto,
} from "@framework/types";
import { ModuleType, StakingDepositTokenType, StakingRewardTokenType, StakingRuleStatus } from "@framework/types";

import { StakingRuleCreateButton, StakingToggleRuleButton } from "../../../../../components/buttons";
import { StakingRuleEditDialog } from "./edit";

export const StakingRules: FC = () => {
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
    handleDeleteCancel,
    handleSearch,
    handleChangePage,
    handleDeleteConfirm,
  } = useCollection<IStakingRule, IStakingRuleSearchDto>({
    baseUrl: "/staking/rules",
    filter: ({ title, description, imageUrl }) => ({
      title,
      description,
      imageUrl,
    }),
    search: {
      query: "",
      contractIds: [],
      stakingRuleStatus: [StakingRuleStatus.ACTIVE, StakingRuleStatus.NEW],
      deposit: {
        tokenType: [] as Array<StakingDepositTokenType>,
      } as IStakingRuleDepositSearchDto,
      reward: {
        tokenType: [] as Array<StakingRewardTokenType>,
      } as IStakingRuleRewardSearchDto,
    },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "staking", "staking.rules"]} />

      <PageHeader message="pages.staking.rules.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <StakingRuleCreateButton />
      </PageHeader>

      <CommonSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        testId="StakingRuleSearchForm"
      >
        <Grid container columnSpacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <EntityInput
              name="contractIds"
              controller="contracts"
              multiple
              data={{ contractModule: [ModuleType.STAKING] }}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="stakingRuleStatus" options={StakingRuleStatus} />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="deposit.tokenType" options={StakingDepositTokenType} />
          </Grid>
          <Grid item xs={6}>
            <SelectInput displayEmpty multiple name="reward.tokenType" options={StakingRewardTokenType} />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(rule => (
            <StyledListItem key={rule.id}>
              <ListItemText sx={{ width: 0.4 }}>{`${rule.title} #${rule.externalId}`}</ListItemText>
              <ListItemText sx={{ width: 0.2 }}>{rule.contract!.title}</ListItemText>
              <ListActions>
                <StakingToggleRuleButton rule={rule} />
                <ListAction
                  onClick={handleEdit(rule)}
                  message="form.buttons.edit"
                  dataTestId="RuleEditButton"
                  icon={Create}
                />
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
        initialValues={{ ...selected, title: `${selected.title}` }}
      />

      <StakingRuleEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
        readOnly={true}
      />
    </Grid>
  );
};
