import React, {FC, Fragment, useContext, useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import {useIntl} from "react-intl";
import {Avatar, Box, Typography} from "@material-ui/core";
import {useParams} from "react-router";
import {Skeleton} from "@material-ui/lab";

import {Spinner} from "@trejgun/material-ui-progress";
import {PageHeader} from "@trejgun/material-ui-page-header";
import {ApiContext, ApiError} from "@trejgun/provider-api";
import {IMerchant} from "@trejgun/solo-types";

import {ProductList} from "../product-list";
import useStyles from "./styles";

export const Merchant: FC = () => {
  const {merchantId} = useParams<{merchantId: string}>();
  const {enqueueSnackbar} = useSnackbar();
  const {formatMessage} = useIntl();
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(true);
  const [merchant, setMerchant] = useState<IMerchant>({} as IMerchant);

  const api = useContext(ApiContext);

  const fetchMerchant = async (): Promise<void> => {
    return api
      .fetchJson({
        url: `/merchants/${merchantId}`,
      })
      .then((json: IMerchant) => {
        setMerchant(json);
      })
      .catch((e: ApiError) => {
        if (e.status) {
          enqueueSnackbar(formatMessage({id: `snackbar.${e.message}`}), {variant: "error"});
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({id: "snackbar.error"}), {variant: "error"});
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
            <Skeleton variant="circle">
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
            <Typography>{merchant.description}</Typography>
          )}
        </Box>
      </Box>

      <ProductList />
    </Fragment>
  );
};
