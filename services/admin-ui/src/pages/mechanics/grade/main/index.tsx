import { FC } from "react";
import { Button, Grid, List, ListItem, ListItemText } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { SelectInput } from "@gemunion/mui-inputs-core";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { emptyPrice } from "@gemunion/mui-inputs-asset";
import { ListAction, ListActions } from "@framework/mui-lists";
import { StyledPagination } from "@framework/styled";
import type { IGrade, IGradeSearchDto } from "@framework/types";
import { GradeStatus, GradeStrategy } from "@framework/types";

import { cleanUpAsset } from "../../../../utils/money";
import { GradeEditDialog } from "./edit";

export const Grade: FC = () => {
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
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="GradeCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} testId="ExchangeSearchForm">
        <Grid item xs={12}>
          <SelectInput multiple name="gradeStatus" options={GradeStatus} />
        </Grid>
      </CommonSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(grade => (
            <ListItem key={grade.id}>
              <ListItemText>
                {grade.contract?.title} ({grade.attribute})
              </ListItemText>
              <ListActions>
                <ListAction onClick={handleEdit(grade)} icon={Create} message="form.buttons.edit" />
                <ListAction onClick={handleDelete(grade)} icon={Delete} message="form.buttons.delete" />
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
        initialValues={selected}
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
