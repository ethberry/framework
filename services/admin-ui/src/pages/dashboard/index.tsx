import { FC } from "react";
import { Grid } from "@mui/material";

import { PageHeader } from "@gemunion/mui-page-layout";

import { useStyles } from "./styles";
import { Erc20Sections } from "./hierarchy/erc20";
import { Erc1155Section } from "./hierarchy/erc1155";
import { Erc721Section } from "./hierarchy/erc721";
import { Erc998Section } from "./hierarchy/erc998";
import { Mysterybox } from "./mechanics/mysterybox";
import { Staking } from "./mechanics/staking";
import { NativeSections } from "./hierarchy/native";
import { Lottery } from "./mechanics/lottery";
import { Vesting } from "./mechanics/vesting";
import { Claim } from "./mechanics/claim";
import { Grade } from "./mechanics/grade";
import { Craft } from "./mechanics/craft";
import { Drop } from "./mechanics/drop";
import { Admin } from "./integrations/admin";
import { ChainLink } from "./integrations/chain-link";
import { CoinGecko } from "./integrations/coin-gecko";
import { CoinMarketCap } from "./integrations/coin-market-cap";
import { Marketplace } from "./integrations/marketplace";

export const Dashboard: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <PageHeader message="pages.dashboard.title" />

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <NativeSections />
          <Erc20Sections />
          <Erc721Section />
          <Erc998Section />
          <Erc1155Section />
          <Mysterybox />
        </Grid>
        <Grid item xs={4}>
          <Vesting />
          <Claim />
          <Craft />
          <Drop />
          <Grade />
          <Lottery />
          <Staking />
        </Grid>
        <Grid item xs={4}>
          <ChainLink />
          <CoinGecko />
          <CoinMarketCap />
          <Marketplace />
          <Admin />
        </Grid>
      </Grid>
    </div>
  );
};
