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
import { Create, FilterList } from "@mui/icons-material";

import { SelectInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import type {
  IStakingRule,
  IStakingRuleDepositSearchDto,
  IStakingRuleRewardSearchDto,
  IStakingRuleSearchDto,
} from "@framework/types";
import { ModuleType, StakingDepositTokenType, StakingRewardTokenType, StakingRuleStatus } from "@framework/types";

import { StakingRuleCreateButton, StakingToggleRuleButton } from "../../../../components/buttons";
import { StakingRuleEditDialog } from "./edit";

export const StakingRules: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
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
    filter: ({ title, description }) => ({
      title,
      description,
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
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
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
        <List>
          {rows.map(rule => (
            <ListItem key={rule.id} disableGutters>
              <ListItemText sx={{ width: 0.4 }}>{rule.title}</ListItemText>
              <ListItemText sx={{ width: 0.2 }}>{rule.contract!.title}</ListItemText>
              <ListItemSecondaryAction>
                <StakingToggleRuleButton rule={rule} />
                <IconButton onClick={handleEdit(rule)}>
                  <Create />
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

      <DeleteDialog
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        open={isDeleteDialogOpen}
        initialValues={{ ...selected, title: `${selected.title}` }}
      />

      <StakingRuleEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
        readOnly={true}
      />
    </Grid>
  );
};
