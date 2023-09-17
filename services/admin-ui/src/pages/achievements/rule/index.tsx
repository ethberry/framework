import { FC } from "react";
import { FormattedMessage } from "react-intl";

import { Button, Grid, List, ListItem, ListItemText, Pagination } from "@mui/material";
import { Add, Create } from "@mui/icons-material";

import { getEmptyTemplate } from "@gemunion/mui-inputs-asset";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { ListAction, ListActions } from "@framework/mui-lists";
import type { IAchievementRule, IAchievementRuleSearchDto } from "@framework/types";
import { AchievementRuleStatus, AchievementType, TokenType } from "@framework/types";

import { cleanUpAsset } from "../../../utils/money";
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
      achievementStatus: AchievementRuleStatus.ACTIVE,
      // eventType: """,
      contractId: 0,
      item: getEmptyTemplate(TokenType.ERC20),
    },
    search: {
      query: "",
      achievementType: [],
      achievementStatus: [],
    },
    filter: ({ title, description, contractId, item, achievementStatus, achievementType, eventType }) => ({
      title,
      description,
      contractId: contractId === 0 ? null : contractId,
      item: item ? cleanUpAsset(item) : { components: [] },
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
          {rows.map(rule => (
            <ListItem key={rule.id}>
              <ListItemText sx={{ width: 0.4 }}>{rule.title}</ListItemText>
              <ListItemText sx={{ width: 0.4 }}>{rule.contract ? rule.contract.title : "-"}</ListItemText>
              <ListItemText sx={{ width: 0.2 }}>{rule.eventType || "-"}</ListItemText>
              <ListActions>
                <ListAction onClick={handleEdit(rule)} icon={Create} message="form.buttons.edit" />
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

      <AchievementRuleEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
