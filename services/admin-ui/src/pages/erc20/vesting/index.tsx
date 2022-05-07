import { FC } from "react";
import { Grid, Typography } from "@mui/material";

import { PageHeader } from "@gemunion/mui-page-header";
import { Breadcrumbs } from "@gemunion/mui-breadcrumbs";

export const Erc20Vesting: FC = () => {
  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc20-vesting"]} />

      <PageHeader message="pages.erc20-vesting.title" />

      <Typography>Here be dragons!</Typography>
    </Grid>
  );
};
