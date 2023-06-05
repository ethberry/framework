import { FC } from "react";
import { FormattedMessage } from "react-intl";
import {
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Pagination,
} from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";

import { IProduct, ProductStatus } from "@framework/types";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { ISearchDto } from "@gemunion/types-collection";

import { EditProductDialog } from "./edit";
import { ProductSearchForm } from "./form";

export interface IProductSearchDto extends ISearchDto {
  categoryIds: Array<number>;
  productStatus: Array<ProductStatus>;
}

export const Product: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    isDeleteDialogOpen,
    isEditDialogOpen,
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
        <Button startIcon={<FilterList />} onClick={handleToggleFilters}>
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate}>
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <ProductSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((product, i) => (
            <ListItem key={i}>
              <ListItemText>{product.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(product)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(product)} disabled={product.productStatus === ProductStatus.INACTIVE}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </ProgressOverlay>

      <Pagination
        sx={{ mt: 2 }}
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

      <EditProductDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
