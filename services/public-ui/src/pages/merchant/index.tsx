import { FC, Fragment, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";
import { Avatar, Box, Typography } from "@mui/material";
import { useParams } from "react-router";
import { Skeleton } from "@mui/lab";

import { Spinner } from "@gemunion/mui-progress";
import { PageHeader } from "@gemunion/mui-page-header";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { ApiError, useApi } from "@gemunion/provider-api";
import { IMerchant } from "@gemunion/framework-types";

import { ProductList } from "../product-list";
import { useStyles } from "./styles";

export const Merchant: FC = () => {
  const { merchantId } = useParams<{ merchantId: string }>();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(true);
  const [merchant, setMerchant] = useState<IMerchant>({} as IMerchant);

  const api = useApi();

  const fetchMerchant = async (): Promise<void> => {
    return api
      .fetchJson({
        url: `/merchants/${merchantId as string}`,
      })
      .then((json: IMerchant) => {
        setMerchant(json);
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
    void fetchMerchant();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <PageHeader message="pages.merchant.title" data={merchant} />

      <Box display="flex">
        <Box margin={1}>
          {isLoading ? (
            <Skeleton variant="circular">
              <Avatar />
            </Skeleton>
          ) : (
            <Avatar className={classes.avatar} src={merchant.imageUrl} />
          )}
        </Box>
        <Box width="100%">
          {isLoading ? (
            <Skeleton width="100%">
              <Typography>.</Typography>
            </Skeleton>
          ) : (
            <RichTextDisplay data={merchant.description} />
          )}
        </Box>
      </Box>

      <ProductList hideMerchantsInSearch />
    </Fragment>
  );
};
