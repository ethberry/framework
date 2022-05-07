import { FC } from "react";
import { Grid, Typography } from "@mui/material";
import { PageHeader } from "@gemunion/mui-page-header";
import { Breadcrumbs } from "@gemunion/mui-breadcrumbs";

export const Erc20Staking: FC = () => {
  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc20-staking"]} />

      <PageHeader message="pages.erc20-staking.title" />

      <Typography>Here be dragons!</Typography>
    </Grid>
  );
};
