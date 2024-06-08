import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Create, FilterList } from "@mui/icons-material";

import { SelectInput } from "@gemunion/mui-inputs-core";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection, CollectionActions } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { emptyPrice } from "@gemunion/mui-inputs-asset";
import { useUser } from "@gemunion/provider-user";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type {
  IStakingRule,
  IStakingRuleDepositSearchDto,
  IStakingRuleRewardSearchDto,
  IStakingRuleSearchDto,
  IUser,
} from "@framework/types";
import {
  DurationUnit,
  ModuleType,
  StakingDepositTokenType,
  StakingRewardTokenType,
  StakingRuleStatus,
} from "@framework/types";

import { StakingRuleCreateButton, StakingToggleRuleButton } from "../../../../../components/buttons";
import { SearchMerchantContractsInput } from "../../../../../components/inputs/search-merchant-contracts";
import { SearchMerchantInput } from "../../../../../components/inputs/search-merchant";
import { StakingRuleEditDialog } from "./edit";

export const StakingRules: FC = () => {
  const { profile } = useUser<IUser>();

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
    empty: {
      title: "new STAKING rule",
      imageUrl: "",
      description: emptyStateString,
      deposit: emptyPrice,
      reward: emptyPrice,
      durationAmount: 2592000,
      durationUnit: DurationUnit.DAY,
      penalty: 100,
      recurrent: false,
    },
    filter: ({ title, description, imageUrl }) => ({
      title,
      description,
      imageUrl,
    }),
    search: {
      query: "",
      merchantId: profile.merchantId,
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
          <Grid item xs={12}>
            <SearchMerchantInput disableClear />
          </Grid>
          <Grid item xs={6}>
            <SearchMerchantContractsInput
              name="contractIds"
              multiple
              data={{
                contractModule: [ModuleType.STAKING],
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="stakingRuleStatus" options={StakingRuleStatus} />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="deposit.tokenType" options={StakingDepositTokenType} />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="reward.tokenType" options={StakingRewardTokenType} />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(rule => (
            <StyledListItem key={rule.id}>
              <ListItemText>{rule.title}</ListItemText>
              <ListActions>
                <StakingToggleRuleButton rule={rule} />
                <ListAction onClick={handleEdit(rule)} message="form.buttons.edit" icon={Create} />
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
