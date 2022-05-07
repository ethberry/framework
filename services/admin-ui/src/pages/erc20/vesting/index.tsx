import { FC } from "react";
import { Grid, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

export const Erc20Vesting: FC = () => {
  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc20-vesting"]} />

      <PageHeader message="pages.erc20-vesting.title" />

      <Typography>Here be dragons!</Typography>
    </Grid>
  );
};
