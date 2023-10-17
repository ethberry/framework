import { FC, Fragment, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";
import { Box, Grid, Hidden, Typography } from "@mui/material";
import { useParams } from "react-router";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { ApiError, useApi } from "@gemunion/provider-api-firebase";
import { IProduct } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { formatPrice } from "../../../utils/money";
import { Carousel } from "./carousel";
import { StyledPaper } from "./styled";

export const Product: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<IProduct>({} as IProduct);

  const api = useApi();

  const fetchProduct = async (): Promise<void> => {
    return api
      .fetchJson({
        url: `/products/${id as string}`,
      })
      .then((json: IProduct) => {
        setProduct(json);
      })
      .catch((e: ApiError) => {
        if (e.status === 400) {
          const errors = e.getLocalizedValidationErrors();

          Object.keys(errors).forEach(key => {
            enqueueSnackbar(formatMessage({ id: errors[key] }, { label: key }), { variant: "error" });
          });
        } else if (e.status) {
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

  useEffect(() => {
    void fetchProduct();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "ecommerce", "products"]} />

      <PageHeader message="pages.product.title" data={product} />

      <Grid container>
        <Grid item xs={12} md={9}>
          <Carousel product={product} />
          <Hidden mdUp>
            <Box py={2}>
              <StyledPaper>
                <Typography variant="body2" color="textSecondary" component="p">
                  {formatPrice(product.productItems[0].price)}
                </Typography>
              </StyledPaper>
            </Box>
          </Hidden>
          <Typography variant="body2" color="textSecondary" component="div">
            <RichTextDisplay data={product.description} />
          </Typography>
        </Grid>
        <Hidden mdDown>
          <Grid item xs={12} md={3}>
            <StyledPaper>
              <Typography variant="body2" color="textSecondary" component="p">
                {formatPrice(product.productItems[0].price)}
              </Typography>
            </StyledPaper>
          </Grid>
        </Hidden>
      </Grid>
    </Fragment>
  );
};
