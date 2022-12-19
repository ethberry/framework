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

import { Add, Create, Delete, FilterList } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { emptyPrice } from "@gemunion/mui-inputs-asset";
import type { IStakingRule, IStakingRuleSearchDto } from "@framework/types";
import { DurationUnit, IStakingRuleItemSearchDto, StakingRuleStatus, TokenType } from "@framework/types";

import { PauseToggleButton, StakingUploadButton } from "../../../../components/buttons";
import { cleanUpAsset } from "../../../../utils/money";
import { StakingEditDialog } from "./edit";
import { StakingRuleSearchForm } from "./form";

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
    handleCreate,
    handleToggleFilters,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleDelete,
    handleDeleteCancel,
    handleSearch,
    handleChangePage,
    handleDeleteConfirm,
  } = useCollection<IStakingRule, IStakingRuleSearchDto>({
    baseUrl: "/staking/rules",
    empty: {
      title: "",
      description: emptyStateString,
      deposit: emptyPrice as any,
      reward: emptyPrice as any,
      durationAmount: 2592000,
      durationUnit: DurationUnit.DAY,
      penalty: 100,
      recurrent: false,
    },
    filter: ({ deposit, reward, ...rest }) => ({
      ...rest,
      deposit: cleanUpAsset(deposit),
      reward: cleanUpAsset(reward),
    }),
    search: {
      query: "",
      stakingRuleStatus: [StakingRuleStatus.ACTIVE, StakingRuleStatus.NEW],
      deposit: {
        tokenType: [] as Array<TokenType>,
      } as IStakingRuleItemSearchDto,
      reward: {
        tokenType: [] as Array<TokenType>,
      } as IStakingRuleItemSearchDto,
    },
  });

  // TODO - disable editing for ACTIVE rules, only View!!!
  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "staking", "staking.rules"]} />

      <PageHeader message="pages.staking.rules.title">
        <PauseToggleButton />
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="StakingCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <StakingRuleSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((rule, i) => (
            <ListItem key={i} disableGutters>
              <ListItemText>{rule.title}</ListItemText>
              <ListItemSecondaryAction>
                <StakingUploadButton rule={rule} />
                <IconButton onClick={handleEdit(rule)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(rule)} disabled={rule.stakingRuleStatus !== StakingRuleStatus.NEW}>
                  <Delete />
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

      <StakingEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
        readOnly={selected.stakingRuleStatus === StakingRuleStatus.ACTIVE}
      />
    </Grid>
  );
};
