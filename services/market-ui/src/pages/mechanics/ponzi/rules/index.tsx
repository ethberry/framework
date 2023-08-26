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
import { FilterList, Visibility } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { emptyPrice } from "@gemunion/mui-inputs-asset";
import type { IPonziRule, IPonziRuleItemSearchDto, IPonziRuleSearchDto } from "@framework/types";
import { DurationUnit, TokenType } from "@framework/types";

import { PonziAllowanceButton, PonziDepositButton } from "../../../../components/buttons";

import { PonziRuleSearchForm } from "./form";
import { PonziViewDialog } from "./view";

export const PonziRules: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    isViewDialogOpen,
    handleView,
    handleViewCancel,
    handleViewConfirm,
    handleToggleFilters,
    handleSearch,
    handleChangePage,
  } = useCollection<IPonziRule, IPonziRuleSearchDto>({
    baseUrl: "/ponzi/rules",
    empty: {
      title: "",
      description: emptyStateString,
      deposit: emptyPrice,
      reward: emptyPrice,
      durationAmount: 2592000,
      durationUnit: DurationUnit.DAY,
      penalty: 100,
    },
    search: {
      query: "",
      deposit: {
        tokenType: [] as Array<TokenType>,
      } as IPonziRuleItemSearchDto,
      reward: {
        tokenType: [] as Array<TokenType>,
      } as IPonziRuleItemSearchDto,
    },
    filter: ({ id, title, description, ...rest }) => (id ? { title, description } : { title, description, ...rest }),
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "ponzi", "ponzi.rules"]} />

      <PageHeader message="pages.ponzi.rules.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters}>
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>

      <PonziRuleSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((rule, i) => (
            <ListItem key={i}>
              <ListItemText>{rule.title}</ListItemText>
              <ListItemSecondaryAction>
                <PonziAllowanceButton rule={rule} />
                <PonziDepositButton rule={rule} />
                <IconButton onClick={handleView(rule)}>
                  <Visibility />
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

      <PonziViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={isViewDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
