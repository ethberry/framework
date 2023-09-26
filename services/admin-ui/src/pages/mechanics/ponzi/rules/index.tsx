import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, List, ListItem, ListItemText } from "@mui/material";
import { Create, FilterList } from "@mui/icons-material";

import { SelectInput } from "@gemunion/mui-inputs-core";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { ListAction, ListActions } from "@framework/mui-lists";
import { StyledPagination } from "@framework/styled";
import type { IPonziRule, IPonziRuleItemSearchDto, IPonziRuleSearchDto } from "@framework/types";
import { PonziRuleStatus, TokenType } from "@framework/types";

import { PonziRuleCreateButton, PonziToggleRuleButton } from "../../../../components/buttons";
import { PonziEditDialog } from "./edit";

export const PonziRules: FC = () => {
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
  } = useCollection<IPonziRule, IPonziRuleSearchDto>({
    baseUrl: "/ponzi/rules",
    filter: ({ title, description }) => ({
      title,
      description,
    }),
    search: {
      query: "",
      ponziRuleStatus: [PonziRuleStatus.ACTIVE, PonziRuleStatus.NEW],
      deposit: {
        tokenType: [] as Array<TokenType>,
      } as IPonziRuleItemSearchDto,
      reward: {
        tokenType: [] as Array<TokenType>,
      } as IPonziRuleItemSearchDto,
    },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "ponzi", "ponzi.rules"]} />

      <PageHeader message="pages.ponzi.rules.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <PonziRuleCreateButton />
      </PageHeader>

      <CommonSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        testId="PonziRuleSearchForm"
      >
        <Grid container columnSpacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <SelectInput multiple name="ponziRuleStatus" options={PonziRuleStatus} />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="deposit.tokenType" options={TokenType} />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="reward.tokenType" options={TokenType} />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(rule => (
            <ListItem key={rule.id} disableGutters>
              <ListItemText>{rule.title}</ListItemText>
              <ListActions>
                <PonziToggleRuleButton rule={rule} />
                <ListAction onClick={handleEdit(rule)} message="form.buttons.edit" icon={Create} />
              </ListActions>
            </ListItem>
          ))}
        </List>
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
        open={isDeleteDialogOpen}
        initialValues={{ ...selected, title: `${selected.title}` }}
      />

      <PonziEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
        readOnly={true}
      />
    </Grid>
  );
};
