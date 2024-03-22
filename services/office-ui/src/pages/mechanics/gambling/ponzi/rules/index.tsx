import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Create, Delete, FilterList } from "@mui/icons-material";

import { SelectInput } from "@gemunion/mui-inputs-core";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { emptyPrice } from "@gemunion/mui-inputs-asset";
import { cleanUpAsset } from "@framework/exchange";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IPonziRule, IPonziRuleSearchDto } from "@framework/types";
import { DurationUnit, IPonziRuleItemSearchDto, PonziRuleStatus, TokenType } from "@framework/types";

import { PonziRuleCreateButton } from "../../../../../components/buttons";
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
    handleDelete,
    handleDeleteCancel,
    handleSearch,
    handleChangePage,
    handleDeleteConfirm,
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
      contractId: 1,
      maxCycles: 1,
    },
    filter: ({ deposit, reward, contractId, ...rest }) => ({
      ...rest,
      contractId,
      deposit: cleanUpAsset(deposit),
      reward: cleanUpAsset(reward),
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
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
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
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(rule => (
            <StyledListItem key={rule.id}>
              <ListItemText sx={{ width: 0.6 }}>{rule.title}</ListItemText>
              <div></div>
              <ListItemText>{rule.contract ? (rule.contract.title ? rule.contract.title : "") : ""}</ListItemText>
              <ListActions>
                <ListAction onClick={handleEdit(rule)} message="form.buttons.edit" icon={Create} />
                <ListAction onClick={handleDelete(rule)} message="form.buttons.delete" icon={Delete} />
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
        open={isDeleteDialogOpen}
        initialValues={{ ...selected, title: `${selected.title}` }}
      />

      <PonziEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
        readOnly={selected.ponziRuleStatus === PonziRuleStatus.ACTIVE}
      />
    </Grid>
  );
};
