import { FC, Fragment } from "react";
import { Typography } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

export const Auction: FC = () => {
  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "auction"]} />

      <PageHeader message="pages.auction.title" />

      <Typography>Here be dragon</Typography>
    </Fragment>
  );
};
