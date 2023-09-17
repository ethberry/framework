import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, List, ListItem, ListItemText, Pagination } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";

import { CommonSearchForm } from "@gemunion/mui-form-search";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { getEmptyTemplate } from "@gemunion/mui-inputs-asset";

import { ListAction, ListActions } from "@framework/mui-lists";
import type { IAchievementLevel, IAchievementLevelSearchDto, IAchievementRule } from "@framework/types";
import { AchievementType, TokenMetadata, TokenType } from "@framework/types";

import { FormRefresher } from "../../../components/forms/form-refresher";
import { cleanUpAsset } from "../../../utils/money";
import { AchievementLevelEditDialog } from "./edit";

export const emptyAchievementRule = {
  achievementType: AchievementType.MARKETPLACE,
} as IAchievementRule;

export const AchievementLevels: FC = () => {
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
      parameters: { [TokenMetadata.RARITY]: "0" },
      achievementLevel: 1,
      achievementRule: emptyAchievementRule,
      item: getEmptyTemplate(TokenType.ERC20),
      startTimestamp: new Date().toISOString(),
      endTimestamp: new Date().toISOString(),
    },
    search: {
      query: "",
      achievementRuleIds: [],
    },
    filter: ({
      id,
      title,
      description,
      item,
      amount,
      parameters,
      achievementLevel,
      achievementRuleId,
      achievementRule,
      startTimestamp,
      endTimestamp,
    }) =>
      id
        ? {
            title,
            description,
            item: cleanUpAsset(item),
            amount,
            parameters: JSON.parse(parameters),
            achievementRule,
            achievementLevel,
            startTimestamp,
            endTimestamp,
          }
        : {
            title,
            description,
            amount,
            parameters: JSON.parse(parameters),
            item: cleanUpAsset(item),
            achievementRuleId,
            achievementLevel,
            startTimestamp,
            endTimestamp,
          },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "achievements", "achievements.levels"]} />

      <PageHeader message="pages.achievements.levels.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
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
        <List>
          {rows.map(level => (
            <ListItem key={level.id}>
              <ListItemText sx={{ width: 0.8 }}>{level.title}</ListItemText>
              <ListItemText sx={{ width: 0.1 }}>{level.amount}</ListItemText>
              <ListItemText sx={{ width: 0.5 }}>{level.achievementRule.achievementType}</ListItemText>
              <ListActions>
                <ListAction onClick={handleEdit(level)} message="form.buttons.edit" icon={Create} />
                <ListAction onClick={handleDelete(level)} message="form.buttons.delete" icon={Delete} />
              </ListActions>
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
        initialValues={selected}
      />

      <AchievementLevelEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
