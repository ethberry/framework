import { FC, Fragment, useEffect, useState } from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { useParams } from "react-router";
import { Skeleton } from "@mui/lab";

import { StyledAvatar } from "@framework/styled";
import type { IMerchant } from "@framework/types";
import { emptyStateString } from "@ethberry/draft-js-utils";
import { Breadcrumbs, PageHeader, Spinner } from "@ethberry/mui-page-layout";
import { RichTextDisplay } from "@ethberry/mui-rte";
import { useApiCall } from "@ethberry/react-hooks";

import { ContractList } from "../contract-list";

export const Merchant: FC = () => {
  const { id } = useParams<{ id: string }>();

  const [selected, setSelected] = useState<IMerchant>({
    title: "",
    description: emptyStateString,
  } as IMerchant);

  const { fn: getMerchantFn, isLoading } = useApiCall(
    api =>
      api.fetchJson({
        url: `/merchants/${id}`,
      }),
    { success: false, error: false },
  );

  const getMerchant = async () => {
    const merchant = await getMerchantFn();
    setSelected(merchant);
  };

  useEffect(() => {
    void getMerchant();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "marketplace", "marketplace.merchant"]} data={[{}, {}, selected]} />

      <PageHeader message="pages.marketplace.merchant.title" data={selected} />

      <Box display="flex">
        <Box margin={1}>
          {isLoading ? (
            <Skeleton variant="circular">
              <Avatar />
            </Skeleton>
          ) : (
            <StyledAvatar src={selected.imageUrl} />
          )}
        </Box>
        <Box width="100%">
          {isLoading ? (
            <Skeleton width="100%">
              <Typography>.</Typography>
            </Skeleton>
          ) : (
            <Typography variant="body2" color="textSecondary" component="div">
              <RichTextDisplay data={selected.description} />
            </Typography>
          )}
        </Box>
      </Box>

      <ContractList embedded />
    </Fragment>
  );
};
