import { FC } from "react";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { SelectInput } from "@gemunion/mui-inputs-core";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection, CollectionActions } from "@gemunion/react-hooks";
import { useUser } from "@gemunion/provider-user";
import { emptyPrice } from "@gemunion/mui-inputs-asset";
import { cleanUpAsset } from "@framework/exchange";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IDiscrete, IDiscreteSearchDto, IUser } from "@framework/types";
import { DiscreteStatus, DiscreteStrategy } from "@framework/types";

import { SearchMerchantInput } from "../../../../../components/inputs/search-merchant";
import { GradeEditDialog } from "./edit";

export const Discrete: FC = () => {
  const { profile } = useUser<IUser>();

  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
    isFiltersOpen,
    handleSearch,
    handleCreate,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleDelete,
    handleDeleteCancel,
    handleDeleteConfirm,
    handleChangePage,
    handleToggleFilters,
  } = useCollection<IDiscrete, IDiscreteSearchDto>({
    baseUrl: "/discrete",
    empty: {
      contractId: 0,
      attribute: "",
      discreteStatus: DiscreteStatus.ACTIVE,
      discreteStrategy: DiscreteStrategy.FLAT,
      growthRate: 0,
      price: emptyPrice,
    },
    search: {
      query: "",
      discreteStatus: [DiscreteStatus.ACTIVE],
      merchantId: profile.merchantId,
    },
    filter: ({ id, contractId, attribute, discreteStatus, discreteStrategy, growthRate, price }) =>
      id
        ? {
            discreteStatus,
            discreteStrategy,
            growthRate,
            price: cleanUpAsset(price),
          }
        : {
            contractId,
            attribute,
            discreteStrategy,
            growthRate,
            price: cleanUpAsset(price),
          },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "discrete"]} />

      <PageHeader message="pages.discrete.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="GradeCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} testId="ExchangeSearchForm">
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <SearchMerchantInput disableClear />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="discreteStatus" options={DiscreteStatus} />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(grade => (
            <StyledListItem key={grade.id}>
              <ListItemText>
                {grade.contract?.title} ({grade.attribute})
              </ListItemText>
              <ListActions>
                <ListAction onClick={handleEdit(grade)} message="form.buttons.edit" icon={Create} />
                <ListAction
                  onClick={handleDelete(grade)}
                  message="form.buttons.delete"
                  icon={Delete}
                  disabled={grade.discreteStatus === DiscreteStatus.INACTIVE}
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
        getTitle={({ attribute }: IDiscrete) => `Attribute ${attribute}`}
      />

      <GradeEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Grid>
  );
};
