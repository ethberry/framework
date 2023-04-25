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
import { getEmptyTemplate } from "@gemunion/mui-inputs-asset";

import type { IAchievementLevel, IAchievementLevelSearchDto, IAchievementRule } from "@framework/types";

import { AchievementLevelEditDialog } from "./edit";
import { AchievementLevelSearchForm } from "./search";
import { TokenType, AchievementType } from "@framework/types";
import { cleanUpAsset } from "../../../utils/money";

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
  } = useCollection<IAchievementLevel, IAchievementLevelSearchDto>({
    baseUrl: "/achievements/levels",
    empty: {
      title: "",
      description: emptyStateString,
      amount: 0,
      achievementRule: emptyAchievementRule,
      item: getEmptyTemplate(TokenType.ERC20),
    },
    search: {
      query: "",
      achievementRuleIds: [],
    },
    filter: ({ id, title, description, item, amount, achievementRuleId, achievementRule }) =>
      id
        ? {
            title,
            description,
            item,
            amount,
            achievementRule,
          }
        : {
            title,
            description,
            amount,
            item: cleanUpAsset(item),
            achievementRuleId,
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

      <AchievementLevelSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((level, i) => (
            <ListItem key={i}>
              <ListItemText sx={{ width: 0.8 }}>{level.title}</ListItemText>
              <ListItemText sx={{ width: 0.1 }}>{level.amount}</ListItemText>
              <ListItemText sx={{ width: 0.5 }}>{level.achievementRule.achievementType}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(level)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(level)}>
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
