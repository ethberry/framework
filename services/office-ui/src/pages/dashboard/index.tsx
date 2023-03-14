import { FC } from "react";
import { Grid } from "@mui/material";

import { PageHeader } from "@gemunion/mui-page-layout";

import { useStyles } from "./styles";
import { Erc20Sections } from "./hierarchy/erc20";
import { Erc1155Section } from "./hierarchy/erc1155";
import { Erc721Section } from "./hierarchy/erc721";
import { NativeSections } from "./hierarchy/native";
import { Claim } from "./mechanics/claim";
import { Drop } from "./mechanics/drop";
import { Admin } from "./infrastructure";
import { Marketplace } from "./exchange/marketplace";
import { Wallet } from "./exchange/wallet";
import { Pyramid } from "./mechanics/pyramid";
import { Staking } from "./mechanics/staking";

export const Dashboard: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <PageHeader message="pages.dashboard.title" />

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <NativeSections />
          <Erc20Sections />
          <Erc721Section />
          <Erc1155Section />
        </Grid>
        <Grid item xs={12} md={4}>
          <Claim />
          <Drop />
          <Staking />
          <Pyramid />
        </Grid>
        <Grid item xs={12} md={4}>
          <Marketplace />
          <Wallet />
          <Admin />
        </Grid>
      </Grid>
    </div>
  );
};
