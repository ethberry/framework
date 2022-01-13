import { FC, useContext, useState } from "react";
import { useSnackbar } from "notistack";
import { FormattedMessage, useIntl } from "react-intl";
import { Typography } from "@mui/material";
import useDeepCompareEffect from "use-deep-compare-effect";

import { ProgressOverlay } from "@gemunion/mui-progress";
import { ApiContext, ApiError } from "@gemunion/provider-api";
import { IProduct } from "@gemunion/framework-types";
import { IPaginationResult } from "@gemunion/types-collection";

import { MultiCarousel } from "../multi-carousel";
import { useStyles } from "./styles";

export const NewProducts: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Array<IProduct>>([]);

  const api = useContext(ApiContext);

  const fetchProducts = async (): Promise<void> => {
    setIsLoading(true);
    return api
      .fetchJson({
        url: "/products/new",
      })
      .then((json: IPaginationResult<IProduct>) => {
        setProducts(json.rows);
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

  useDeepCompareEffect(() => {
    void fetchProducts();
  }, []);

  return (
    <ProgressOverlay isLoading={isLoading}>
      <Typography variant="h4" className={classes.title}>
        <FormattedMessage id="pages.landing.new" />
      </Typography>
      <MultiCarousel products={products} />
    </ProgressOverlay>
  );
};
