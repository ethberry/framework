import { FC, Fragment } from "react";
import { Typography } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

export const Dragons: FC = () => {
  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "dragons"]} />

      <PageHeader message="pages.dragons.title" />

      <Typography>Here be dragons</Typography>
    </Fragment>
  );
};
