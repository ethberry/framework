import { FC, Fragment } from "react";
import { Typography } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

export const Whitelist: FC = () => {
  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "whitelist"]} />

      <PageHeader message="pages.whitelist.title" />

      <Typography>Here be dragons</Typography>
    </Fragment>
  );
};
