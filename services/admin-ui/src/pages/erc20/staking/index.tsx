import { FC } from "react";
import { Grid, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

export const Erc20Staking: FC = () => {
  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc20-staking"]} />

      <PageHeader message="pages.erc20-staking.title" />

      <Typography>Here be dragons!</Typography>
    </Grid>
  );
};
