import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Create, Delete, FilterList } from "@mui/icons-material";

import { SelectInput } from "@gemunion/mui-inputs-core";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { CollectionActions, useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { emptyPrice } from "@gemunion/mui-inputs-asset";
import { cleanUpAsset } from "@framework/exchange";
import { useUser } from "@gemunion/provider-user";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IPonziRule, IPonziRuleItemSearchDto, IPonziRuleSearchDto } from "@framework/types";
import { DurationUnit, IUser, ModuleType, PonziRuleStatus, TokenType } from "@framework/types";

import { PonziRuleCreateButton } from "../../../../../components/buttons";
import { PonziEditDialog } from "./edit";
import { SearchMerchantInput } from "../../../../../components/inputs/search-merchant";
import { SearchMerchantContractsInput } from "../../../../../components/inputs/search-merchant-contracts";

export const PonziRules: FC = () => {
  const { profile } = useUser<IUser>();

  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
    isFiltersOpen,
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
      merchantId: profile.merchantId,
      contractIds: [],
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
            <SearchMerchantInput disableClear />
          </Grid>
          <Grid item xs={6}>
            <SearchMerchantContractsInput
              name="contractIds"
              multiple
              data={{
                contractModule: [ModuleType.PONZI],
              }}
            />
          </Grid>
          <Grid item xs={6}>
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
                <ListAction
                  onClick={handleEdit(rule)}
                  message="form.buttons.edit"
                  dataTestId="RuleEditButton"
                  icon={Create}
                />
                <ListAction
                  onClick={handleDelete(rule)}
                  message="form.buttons.delete"
                  dataTestId="RuleDeleteButton"
                  icon={Delete}
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
        initialValues={{ ...selected, title: `${selected.title}` }}
      />

      <PonziEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
        readOnly={selected.ponziRuleStatus === PonziRuleStatus.ACTIVE}
      />
    </Grid>
  );
};
