import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, Pagination } from "@mui/material";
import { FilterList } from "@mui/icons-material";

import { IProduct } from "@framework/types";
import { PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { ISearchDto } from "@gemunion/types-collection";

import { ProductItem } from "./item";
import { ProductSearchForm } from "./form";

export interface IProductSearchDto extends ISearchDto {
  categoryIds: Array<number>;
  merchantId?: string;
}

export const ProductList: FC = () => {
  const { rows, count, search, isLoading, isFiltersOpen, handleSearch, handleToggleFilters, handleChangePage } =
    useCollection<IProduct, IProductSearchDto>({
      baseUrl: "/products",
      search: {
        categoryIds: [],
        merchantId: "",
        query: "",
      },
    });

  return (
    <Fragment>
      <PageHeader message="pages.products.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters}>
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <ProductSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(product => (
            <Grid item lg={4} sm={6} xs={12} key={product.id}>
              <ProductItem product={product} />
            </Grid>
          ))}
        </Grid>
      </ProgressOverlay>

      <Pagination
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />
    </Fragment>
  );
};
