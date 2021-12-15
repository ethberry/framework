import React, { FC, Fragment, useContext, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useIntl, FormattedMessage } from "react-intl";
import { Typography, Grid, Paper } from "@mui/material";
import { useParams } from "react-router";

import { Spinner } from "@gemunion/mui-progress";
import { ApiContext, ApiError } from "@gemunion/provider-api";
import { PageHeader } from "@gemunion/mui-page-header";
import { IProduct } from "@gemunion/framework-types";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { formatMoney } from "../../utils/money";
import { useStyles } from "./styles";
import { Carousel } from "./carousel";

export const Product: FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<IProduct>({} as IProduct);

  const api = useContext(ApiContext);

  const fetchProduct = async (): Promise<void> => {
    return api
      .fetchJson({
        url: `/products/${productId as string}`,
      })
      .then((json: IProduct) => {
        setProduct(json);
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

  useEffect(() => {
    void fetchProduct();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <PageHeader message="pages.product.title" data={product} />

      <Grid container>
        <Grid item xs={9}>
          <Carousel product={product} />
          <Typography variant="body2" color="textSecondary" component="div">
            <RichTextDisplay data={product.description} />
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            <Typography variant="body2" color="textSecondary" component="p">
              <FormattedMessage id="pages.product.price" values={{ amount: formatMoney(product.price) }} />
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
};
