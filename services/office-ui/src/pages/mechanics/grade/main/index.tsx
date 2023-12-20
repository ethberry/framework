import { FC } from "react";
import { Button, Grid, List, ListItemText } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { useUser } from "@gemunion/provider-user";
import { emptyPrice } from "@gemunion/mui-inputs-asset";
import { cleanUpAsset } from "@framework/exchange";
import { ListAction, ListActions, StyledListItem, StyledPagination } from "@framework/styled";
import type { IGrade, IGradeSearchDto, IUser } from "@framework/types";
import { GradeStatus, GradeStrategy } from "@framework/types";

import { GradeEditDialog } from "./edit";

export const Grade: FC = () => {
  const { profile } = useUser<IUser>();

  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
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
  } = useCollection<IGrade, IGradeSearchDto>({
    baseUrl: "/grades",
    empty: {
      contractId: 0,
      attribute: "",
      gradeStatus: GradeStatus.ACTIVE,
      gradeStrategy: GradeStrategy.FLAT,
      growthRate: 0,
      price: emptyPrice,
    },
    search: {
      query: "",
      gradeStatus: [GradeStatus.ACTIVE],
      merchantId: profile.merchantId,
    },
    filter: ({ id, contractId, attribute, gradeStatus, gradeStrategy, growthRate, price }) =>
      id
        ? {
            gradeStatus,
            gradeStrategy,
            growthRate,
            price: cleanUpAsset(price),
          }
        : {
            contractId,
            attribute,
            gradeStrategy,
            growthRate,
            price: cleanUpAsset(price),
          },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "grade"]} />

      <PageHeader message="pages.grade.title">
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
            <SelectInput multiple name="gradeStatus" options={GradeStatus} />
          </Grid>
          <Grid item xs={6}>
            <EntityInput name="merchantId" controller="merchants" disableClear />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <List>
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
                  disabled={grade.gradeStatus === GradeStatus.INACTIVE}
                />
              </ListActions>
            </StyledListItem>
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
        initialValues={selected}
        getTitle={(grade: IGrade) => `Attribute ${grade.attribute}`}
      />

      <GradeEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
