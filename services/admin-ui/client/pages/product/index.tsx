import React, { ChangeEvent, FC, useContext, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from "@material-ui/core";
import { Add, Create, Delete, FilterList } from "@material-ui/icons";
import { Pagination } from "@material-ui/lab";
import { useHistory, useLocation, useParams } from "react-router";
import { parse, stringify } from "qs";

import { ProgressOverlay } from "@gemunion/material-ui-progress";
import { PageHeader } from "@gemunion/material-ui-page-header";
import { DeleteDialog } from "@gemunion/material-ui-dialog-delete";
import { ApiContext, ApiError } from "@gemunion/provider-api";
import { IPaginationResult, ISearchDto } from "@gemunion/types-collection";
import { IProduct, ProductStatus } from "@gemunion/framework-types";
import { emptyProduct } from "@gemunion/framework-mocks";

import { EditProductDialog } from "./edit";
import { ProductSearchForm } from "./form";
import { Breadcrumbs } from "../../components/common/breadcrumbs";

export interface IProductSearchDto extends ISearchDto {
  categoryIds: Array<number>;
  productStatus: Array<ProductStatus>;
}

export const Product: FC = () => {
  const location = useLocation();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const { id } = useParams<{ id?: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [products, setProducts] = useState<Array<IProduct>>([]);
  const [count, setCount] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<IProduct>(emptyProduct);
  const [isFiltersOpen, setIsFilterOpen] = useState(false);

  const api = useContext(ApiContext);

  const parsedData = parse(location.search.substring(1));

  const [data, setData] = useState<IProductSearchDto>({
    skip: 0,
    take: 10,
    query: "",
    productStatus: [ProductStatus.ACTIVE],
    categoryIds: [],
    ...parsedData,
  });

  const updateQS = (id?: number) => {
    const { skip: _skip, take: _take, ...rest } = data;
    history.push(id ? `/products/${id}` : `/products?${stringify(rest)}`);
  };

  const handleEdit = (product: IProduct): (() => void) => {
    return (): void => {
      setSelectedProduct(product);
      setIsEditDialogOpen(true);
      updateQS(product.id);
    };
  };

  const handleDelete = (product: IProduct): (() => void) => {
    return (): void => {
      setSelectedProduct(product);
      setIsDeleteDialogOpen(true);
    };
  };

  const handleDeleteCancel = (): void => {
    setIsDeleteDialogOpen(false);
  };

  const handleEditCancel = (): void => {
    setIsEditDialogOpen(false);
    updateQS();
  };

  const fetchProductsByQuery = async (): Promise<void> => {
    return api
      .fetchJson({
        url: "/products",
        data,
      })
      .then((json: IPaginationResult<IProduct>) => {
        setProducts(json.rows);
        setCount(json.count);
        updateQS();
      });
  };

  const fetchProductsById = async (id: string): Promise<void> => {
    return api
      .fetchJson({
        url: `/products/${id}`,
      })
      .then((json: IProduct) => {
        setProducts([json]);
        setCount(1);
        handleEdit(json)();
      });
  };

  const fetchProducts = async (id?: string): Promise<void> => {
    setIsLoading(true);
    return (id ? fetchProductsById(id) : fetchProductsByQuery())
      .catch(e => {
        console.error(e);
        enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAdd = (): void => {
    setSelectedProduct(emptyProduct);
    setIsEditDialogOpen(true);
  };

  const handleDeleteConfirmed = (product: IProduct): Promise<void> => {
    return api
      .fetchJson({
        url: `/products/${product.id}`,
        method: "DELETE",
      })
      .then(() => {
        enqueueSnackbar(formatMessage({ id: "snackbar.deleted" }), { variant: "success" });
        return fetchProducts();
      })
      .catch((e: ApiError) => {
        if (e.status) {
          enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      })
      .finally(() => {
        setIsDeleteDialogOpen(false);
      });
  };

  const handleEditConfirmed = (values: Partial<IProduct>, formikBag: any): Promise<void> => {
    const { id, photos = [], ...data } = values;
    return api
      .fetchJson({
        url: id ? `/products/${id}` : "/products/",
        method: id ? "PUT" : "POST",
        data: {
          ...data,
          photos: photos.map(({ title, imageUrl }) => ({ title, imageUrl })),
        },
      })
      .then(() => {
        enqueueSnackbar(formatMessage({ id: id ? "snackbar.updated" : "snackbar.created" }), { variant: "success" });
        setIsEditDialogOpen(false);
        return fetchProducts();
      })
      .catch((e: ApiError) => {
        if (e.status === 400) {
          formikBag.setErrors(e.getLocalizedValidationErrors());
        } else if (e.status) {
          enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      });
  };

  const handleChangePage = (e: ChangeEvent<unknown>, page: number) => {
    setData({
      ...data,
      skip: (page - 1) * data.take,
    });
  };

  const handleSubmit = (values: IProductSearchDto): void => {
    setData({
      ...values,
      skip: 0,
      take: 10,
    });
  };

  const toggleFilters = () => {
    setIsFilterOpen(!isFiltersOpen);
  };

  useEffect(() => {
    void fetchProducts(id);
  }, [data]);

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "products"]} />

      <PageHeader message="pages.products.title">
        <Button startIcon={<FilterList />} onClick={toggleFilters}>
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleAdd}>
          <FormattedMessage id="form.buttons.add" />
        </Button>
      </PageHeader>

      <ProductSearchForm onSubmit={handleSubmit} initialValues={data} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {products.map((product, i) => (
            <ListItem key={i}>
              <ListItemText>{product.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(product)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(product)}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </ProgressOverlay>

      <Pagination
        shape="rounded"
        page={data.skip / data.take + 1}
        count={Math.ceil(count / data.take)}
        onChange={handleChangePage}
      />

      <DeleteDialog
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirmed}
        open={isDeleteDialogOpen}
        initialValues={selectedProduct}
      />

      <EditProductDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirmed}
        open={isEditDialogOpen}
        initialValues={selectedProduct}
      />
    </Grid>
  );
};
