import { FC } from "react";
import { Grid, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { BulkCancelOrdersButton } from "../../../components/buttons/seaport/increment-nonce";

export const MyAuctions: FC = () => {
  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "my-auctions"]} />

      <PageHeader message="pages.my-auctions.title">
        <BulkCancelOrdersButton />
      </PageHeader>

      <Typography>Here be dragons!</Typography>
    </Grid>
  );
};
