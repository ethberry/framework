import { ChangeEvent, FC, Fragment, useContext, useState } from "react";
import { useSnackbar } from "notistack";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Grid, Pagination } from "@mui/material";
import { parse, stringify } from "qs";
import { useNavigate, useLocation, useParams } from "react-router";
import { FilterList } from "@mui/icons-material";
import useDeepCompareEffect from "use-deep-compare-effect";

import { ProgressOverlay } from "@gemunion/mui-progress";
import { PageHeader } from "@gemunion/mui-page-header";
import { ApiContext, ApiError } from "@gemunion/provider-api";
import { IProduct } from "@gemunion/framework-types";
import { IPaginationResult, ISearchDto } from "@gemunion/types-collection";
import { defaultItemsPerPage } from "@gemunion/constants";

import { ProductItem } from "./item";
import { ProductSearchForm } from "./form";

export interface IProductSearchDto extends ISearchDto {
  merchantId: string;
  categoryIds: Array<number>;
}

export interface IProductListProps {
  hideMerchantsInSearch: boolean;
}

export const ProductList: FC<IProductListProps> = props => {
  const { hideMerchantsInSearch } = props;
  const { id = "" } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const [isFiltersOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState<number>(0);
  const [products, setProducts] = useState<Array<IProduct>>([]);

  const api = useContext(ApiContext);

  const parsedData = parse(location.search.substring(1));

  const [data, setData] = useState<IProductSearchDto>({
    skip: 0,
    take: defaultItemsPerPage,
    merchantId: id,
    query: "",
    categoryIds: [],
    ...parsedData,
  });

  const updateQS = () => {
    const { skip: _skip, take: _take, merchantId: _merchantId, ...rest } = data;
    navigate(`${location.pathname}?${stringify(rest)}`);
  };

  const fetchProducts = async (): Promise<void> => {
    setIsLoading(true);
    return api
      .fetchJson({
        url: "/products",
        data,
      })
      .then((json: IPaginationResult<IProduct>) => {
        setProducts(json.rows);
        setCount(json.count);
        updateQS();
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
        setIsLoading(false);
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
      take: defaultItemsPerPage,
    });
  };

  const toggleFilters = () => {
    setIsFilterOpen(!isFiltersOpen);
  };

  useDeepCompareEffect(() => {
    void fetchProducts();
  }, [data]);

  return (
    <Fragment>
      <PageHeader message="pages.products.title">
        <Button startIcon={<FilterList />} onClick={toggleFilters}>
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <ProductSearchForm
        onSubmit={handleSubmit}
        initialValues={data}
        open={isFiltersOpen}
        hideMerchantsInSearch={hideMerchantsInSearch}
      />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {products.map(product => (
            <Grid item lg={4} sm={6} xs={12} key={product.id}>
              <ProductItem product={product} />
            </Grid>
          ))}
        </Grid>
      </ProgressOverlay>

      <Pagination
        sx={{ mt: 2 }}
        shape="rounded"
        page={data.skip / data.take + 1}
        count={Math.ceil(count / data.take)}
        onChange={handleChangePage}
      />
    </Fragment>
  );
};
