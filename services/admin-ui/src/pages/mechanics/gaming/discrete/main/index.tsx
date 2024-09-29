import { FC } from "react";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { SelectInput } from "@ethberry/mui-inputs-core";
import { CommonSearchForm } from "@ethberry/mui-form-search";
import { DeleteDialog } from "@ethberry/mui-dialog-delete";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@ethberry/mui-page-layout";
import { useCollection, CollectionActions } from "@ethberry/provider-collection";
import { emptyPrice } from "@ethberry/mui-inputs-asset";
import { cleanUpAsset } from "@framework/exchange";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IDiscrete, IDiscreteSearchDto } from "@framework/types";
import { DiscreteStatus, DiscreteStrategy } from "@framework/types";

import { GradeEditDialog } from "./edit";

export const Discrete: FC = () => {
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
        <Grid item xs={12}>
          <SelectInput multiple name="discreteStatus" options={DiscreteStatus} />
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
                <ListAction
                  onClick={handleEdit(grade)}
                  message="form.buttons.edit"
                  dataTestId="GradeEditButton"
                  icon={Create}
                />
                <ListAction
                  onClick={handleDelete(grade)}
                  message="form.buttons.delete"
                  dataTestId="GradeDeleteButton"
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
