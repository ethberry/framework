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
import { getEmptyTemplate } from "@gemunion/mui-inputs-asset";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { ISearchDto } from "@gemunion/types-collection";

import { cleanUpAsset } from "../../../utils/money";
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
    baseUrl: "/products",
    empty: {
      title: "",
      description: emptyStateString,
      price: getEmptyTemplate(),
      amount: 0,
      categories: [],
      photos: [],
      parameters: [],
    },
    search: {
      query: "",
      productStatus: [ProductStatus.ACTIVE],
      categoryIds: [],
    },
    filter: ({ id: _id, photos, price, ...rest }: Partial<IProduct>) => ({
      ...rest,
      photos: photos!.map(({ title, imageUrl }) => ({ title, imageUrl })),
      price: cleanUpAsset(price),
    }),
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "products"]} />

      <PageHeader message="pages.products.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters}>
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate}>
          <FormattedMessage id="form.buttons.add" />
        </Button>
      </PageHeader>

      <ProductSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((row, i) => (
            <ListItem key={i}>
              <ListItemText>{row.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(row)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(row)}>
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
