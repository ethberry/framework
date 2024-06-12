import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";

import { cleanUpAsset } from "@framework/exchange";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IAchievementLevel, IAchievementLevelSearchDto, IAchievementRule } from "@framework/types";
import { AchievementRuleStatus, TokenType } from "@framework/types";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection, CollectionActions } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { getEmptyTemplate } from "@gemunion/mui-inputs-asset";

import { FormRefresher } from "../../../../../components/forms/form-refresher";
import { AchievementLevelEditDialog } from "./edit";

export const emptyAchievementRule = {
  achievementStatus: AchievementRuleStatus.ACTIVE,
} as IAchievementRule;

export const AchievementLevels: FC = () => {
  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
    isFiltersOpen,
    handleToggleFilters,
    handleCreate,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleDelete,
    handleDeleteCancel,
    handleDeleteConfirm,
    handleSearch,
    handleChangePage,
    handleRefreshPage,
  } = useCollection<IAchievementLevel, IAchievementLevelSearchDto>({
    baseUrl: "/achievements/levels",
    empty: {
      title: "",
      description: emptyStateString,
      amount: 0,
      // parameters: { [TokenMetadata.RARITY]: "0" },
      achievementLevel: 1,
      achievementRule: emptyAchievementRule,
      reward: getEmptyTemplate(TokenType.ERC20),
    },
    search: {
      query: "",
      achievementRuleIds: [],
    },
    filter: ({
      id,
      title,
      description,
      reward,
      amount,
      // parameters,
      achievementLevel,
      achievementRuleId,
      achievementRule,
    }) =>
      id
        ? {
            title,
            description,
            reward: cleanUpAsset(reward),
            amount,
            // parameters: JSON.parse(parameters),
            achievementRule,
            achievementLevel,
          }
        : {
            title,
            description,
            amount,
            // parameters: JSON.parse(parameters),
            reward: cleanUpAsset(reward),
            achievementRuleId,
            achievementLevel,
          },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "achievements", "achievements.levels"]} />

      <PageHeader message="pages.achievements.levels.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={handleCreate}
          data-testid="AchievementLevelCreateButton"
        >
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <CommonSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        testId="AchievementLevelSearchForm"
      >
        <FormRefresher onRefreshPage={handleRefreshPage} />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <EntityInput name="achievementRuleIds" controller="achievements/rules" multiple />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(level => (
            <StyledListItem key={level.id}>
              <ListItemText sx={{ width: 0.8 }}>{level.title}</ListItemText>
              <ListItemText sx={{ width: 0.1 }}>{level.amount}</ListItemText>
              <ListActions>
                <ListAction onClick={handleEdit(level)} message="form.buttons.edit" icon={Create} />
                <ListAction onClick={handleDelete(level)} message="form.buttons.delete" icon={Delete} />
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
        initialValues={selected}
      />

      <AchievementLevelEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Grid>
  );
};
