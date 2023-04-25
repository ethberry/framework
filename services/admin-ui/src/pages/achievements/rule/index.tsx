import { FC } from "react";
import { Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Pagination } from "@mui/material";
import { Create } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import type { IAchievementRule, IAchievementRuleSearchDto } from "@framework/types";

import { AchievementRuleEditDialog } from "./edit";

export const AchievementRules: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isEditDialogOpen,
    isDeleteDialogOpen,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleDeleteCancel,
    handleDeleteConfirm,
    handleChangePage,
  } = useCollection<IAchievementRule, IAchievementRuleSearchDto>({
    baseUrl: "/achievements/rules",
    empty: {
      title: "",
      description: emptyStateString,
    },
    search: {
      query: "",
      achievementType: [],
    },
    filter: ({ title, description }) => ({ title, description }),
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "achievements", "achievements.rules"]} />

      <PageHeader message="pages.achievements.rules.title" />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((rule, i) => (
            <ListItem key={i}>
              <ListItemText>{rule.title}</ListItemText>
              <ListItemSecondaryAction>
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
        initialValues={selected}
      />

      <AchievementRuleEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
