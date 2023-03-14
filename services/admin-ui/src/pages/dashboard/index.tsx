import { FC } from "react";
import { Divider, Grid } from "@mui/material";

import { PageHeader } from "@gemunion/mui-page-layout";

import { useStyles } from "./styles";
import { Erc20Sections } from "./hierarchy/erc20";
import { Erc1155Section } from "./hierarchy/erc1155";
import { Erc721Section } from "./hierarchy/erc721";
import { Erc998Section } from "./hierarchy/erc998";
import { Mystery } from "./mechanics/mystery";
import { Staking } from "./mechanics/staking";
import { NativeSections } from "./hierarchy/native";
import { Lottery } from "./mechanics/lottery";
import { Vesting } from "./mechanics/vesting";
import { Claim } from "./mechanics/claim";
import { Grade } from "./mechanics/grade";
import { Craft } from "./mechanics/craft";
import { Drop } from "./mechanics/drop";
import { Admin } from "./infrastructure";
import { ChainLink } from "./integrations/chain-link";
import { CoinGecko } from "./integrations/coin-gecko";
import { CoinMarketCap } from "./integrations/coin-market-cap";
import { Marketplace } from "./exchange/marketplace";
import { Pyramid } from "./mechanics/pyramid";
import { Breed } from "./mechanics/breed";
import { Waitlist } from "./mechanics/waitlist";
import { Wallet } from "./exchange/wallet";
import { Collections } from "./mechanics/collection";
import { Ecommerce } from "./ecommerce";

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
          <Erc998Section />
          <Erc1155Section />
          <Divider sx={{ m: 2 }} />
          <Mystery />
          <Collections />
        </Grid>
        <Grid item xs={12} md={4}>
          <Vesting />
          <Waitlist />
          <Claim />
          <Drop />
          <Craft />
          <Grade />
          <Breed />
          <Lottery />
          <Staking />
          <Pyramid />
        </Grid>
        <Grid item xs={12} md={4}>
          <ChainLink />
          <CoinGecko />
          <CoinMarketCap />
          <Marketplace />
          <Wallet />
          <Ecommerce />
          <Admin />
        </Grid>
      </Grid>
    </div>
  );
};
