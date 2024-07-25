import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";

import { ListAction, ListActions, StyledListItem, StyledPagination, StyledListWrapper } from "@framework/styled";
import type { IProduct } from "@framework/types";
import { ProductStatus } from "@framework/types";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection, CollectionActions } from "@gemunion/provider-collection";
import type { ISearchDto } from "@gemunion/types-collection";

import { EditProductDialog } from "./edit";

export interface IProductSearchDto extends ISearchDto {
  categoryIds: Array<number>;
  productStatus: Array<ProductStatus>;
}

export const Product: FC = () => {
  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
    isFiltersOpen,
    handleCreate,
    handleToggleFilters,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleDelete,
    handleDeleteCancel,
    handleSearch,
    handleChangePage,
    handleDeleteConfirm,
  } = useCollection<IProduct, IProductSearchDto>({
    baseUrl: "/ecommerce/products",
    empty: {
      title: "",
      description: emptyStateString,
      categories: [],
      photos: [],
    },
    search: {
      query: "",
      productStatus: [ProductStatus.ACTIVE],
      categoryIds: [],
    },
    filter: ({ id: _id, ...rest }: Partial<IProduct>) => rest,
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "ecommerce", "products"]} />

      <PageHeader message="pages.products.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="ProductCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} testId="ProductSearchForm">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <SelectInput multiple name="productStatus" options={ProductStatus} />
          </Grid>
          <Grid item xs={12} md={6}>
            <EntityInput multiple name="categoryIds" controller="ecommerce/categories" />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(product => (
            <StyledListItem key={product.id}>
              <ListItemText>{product.title}</ListItemText>
              <ListActions>
                <ListAction
                  onClick={handleEdit(product)}
                  message="form.buttons.edit"
                  dataTestId="ProductEditButton"
                  icon={Create}
                />
                <ListAction
                  onClick={handleDelete(product)}
                  message="form.buttons.delete"
                  dataTestId="ProductDeleteButton"
                  icon={Delete}
                  disabled={product.productStatus === ProductStatus.INACTIVE}
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

      <EditProductDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Grid>
  );
};
