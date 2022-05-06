import { FC, Fragment } from "react";
import { Typography } from "@mui/material";

import { PageHeader } from "@gemunion/mui-page-header";
import { Breadcrumbs } from "@gemunion/mui-breadcrumbs";

export const Auction: FC = () => {
  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "auction"]} />

      <PageHeader message="pages.auction.title" />

      <Typography>Here be dragon</Typography>
    </Fragment>
  );
};
