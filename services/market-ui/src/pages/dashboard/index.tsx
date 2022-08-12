import { FC } from "react";
import { Grid } from "@mui/material";

import { PageHeader } from "@gemunion/mui-page-layout";

import { useStyles } from "./styles";
import { Erc721Section } from "./sections/erc721";
import { Erc998Section } from "./sections/erc998";
import { Erc1155Section } from "./sections/erc1155";
import { Personal } from "./sections/personal";
import { Marketplace } from "./sections/marketplace";
import { Mechanics } from "./sections/mechanics";
import { Pages } from "./sections/pages";
import { Staking } from "./sections/staking";
import { Lottery } from "./sections/lottery";

export const Dashboard: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <PageHeader message="pages.dashboard.title" />

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Erc721Section />
          <Erc998Section />
          <Erc1155Section />
        </Grid>
        <Grid item xs={4}>
          <Mechanics />
          <Staking />
          <Lottery />
        </Grid>
        <Grid item xs={4}>
          <Personal />
          <Marketplace />
          <Pages />
        </Grid>
      </Grid>
    </div>
  );
};
