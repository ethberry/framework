import { FC } from "react";
import { FormattedMessage } from "react-intl";

import {
  Grid,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Pagination,
} from "@mui/material";
import { Add, Create } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import type { IAchievementRule, IAchievementRuleSearchDto } from "@framework/types";

import { AchievementRuleEditDialog } from "./edit";
import { AchievementRuleStatus, AchievementType, ContractEventType } from "@framework/types";

export const AchievementRules: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isEditDialogOpen,
    isDeleteDialogOpen,
    handleCreate,
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
      achievementType: AchievementType.MARKETPLACE,
      achievementStatus: AchievementRuleStatus.NEW,
      eventType: ContractEventType.Purchase,
      contractId: 0,
    },
    search: {
      query: "",
      achievementType: [],
    },
    filter: ({ title, description, contractId, achievementStatus, achievementType, eventType }) => ({
      title,
      description,
      contractId,
      achievementStatus,
      achievementType,
      eventType,
    }),
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "achievements", "achievements.rules"]} />

      <PageHeader message="pages.achievements.rules.title">
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="Erc721TemplateCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

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
