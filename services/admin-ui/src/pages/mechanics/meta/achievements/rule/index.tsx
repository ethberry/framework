import { FC } from "react";
import { FormattedMessage } from "react-intl";

import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Create } from "@mui/icons-material";

import { getEmptyTemplate } from "@ethberry/mui-inputs-asset";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@ethberry/mui-page-layout";
import { DeleteDialog } from "@ethberry/mui-dialog-delete";
import { useCollection, CollectionActions } from "@ethberry/provider-collection";
import { emptyStateString } from "@ethberry/draft-js-utils";
import { InputType } from "@ethberry/types-collection";
import { cleanUpAsset } from "@framework/exchange";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IAchievementRule, IAchievementRuleSearchDto } from "@framework/types";
import { AchievementRuleStatus, TokenType } from "@framework/types";

import { AchievementRuleEditDialog } from "./edit";

export const AchievementRules: FC = () => {
  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
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
      achievementStatus: AchievementRuleStatus.ACTIVE,
      contractId: InputType.awaited,
      item: getEmptyTemplate(TokenType.ERC20),
      startTimestamp: new Date().toISOString(),
      endTimestamp: new Date().toISOString(),
    },
    search: {
      query: "",
      achievementStatus: [],
    },
    filter: ({ title, description, contractId, item, achievementStatus, eventType, startTimestamp, endTimestamp }) => ({
      title,
      description,
      contractId: contractId === 0 ? null : contractId,
      item: item ? cleanUpAsset(item) : { components: [] },
      achievementStatus,
      eventType,
      startTimestamp,
      endTimestamp,
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
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(rule => (
            <StyledListItem key={rule.id}>
              <ListItemText sx={{ width: 0.4 }}>{rule.title}</ListItemText>
              <ListItemText sx={{ width: 0.4 }}>{rule.contract ? rule.contract.title : "-"}</ListItemText>
              <ListItemText sx={{ width: 0.2 }}>{rule.eventType || "-"}</ListItemText>
              <ListActions>
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
        initialValues={selected}
      />

      <AchievementRuleEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Grid>
  );
};
