import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { stringify } from "qs";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/provider-collection";
import type { ISearchDto } from "@gemunion/types-collection";
import { StyledEmptyWrapper, StyledPagination } from "@framework/styled";
import type { IProduct } from "@framework/types";

import { ProductItem } from "./item";

export interface IProductSearchDto extends ISearchDto {
  categoryIds: Array<number>;
  merchantId?: string;
}

export const ProductList: FC = () => {
  const { rows, count, search, isLoading, isFiltersOpen, handleSearch, handleToggleFilters, handleChangePage } =
    useCollection<IProduct, IProductSearchDto>({
      baseUrl: "/products",
      redirect: (_, search) => `/ecommerce/products/?${stringify(search)}`,
      search: {
        categoryIds: [],
        merchantId: "",
        query: "",
      },
    });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "ecommerce", "products"]} />

      <PageHeader message="pages.products.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} testId="ProductSearchForm">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <EntityInput multiple name="categoryIds" controller="ecommerce/categories" />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          <StyledEmptyWrapper count={rows.length} isLoading={isLoading}>
            {rows.map(product => (
              <Grid item lg={4} sm={6} xs={12} key={product.id}>
                <ProductItem product={product} />
              </Grid>
            ))}
          </StyledEmptyWrapper>
        </Grid>
      </ProgressOverlay>

      <StyledPagination
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />
    </Fragment>
  );
};
