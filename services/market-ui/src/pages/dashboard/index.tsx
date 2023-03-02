import { FC } from "react";
import { Grid } from "@mui/material";

import { PageHeader } from "@gemunion/mui-page-layout";

import { useStyles } from "./styles";
import { Erc721Section } from "./hierarchy/erc721";
import { Erc998Section } from "./hierarchy/erc998";
import { Erc1155Section } from "./hierarchy/erc1155";
import { OneInch } from "./integrations/1inch";
import { Personal } from "./exchange/personal";
import { Marketplace } from "./exchange/marketplace";
import { Mysterybox } from "./mechanics/mysterybox";
import { Pages } from "./infrastructure/pages";
import { Staking } from "./mechanics/staking";
import { Lottery } from "./mechanics/lottery";
import { Vesting } from "./mechanics/vesting";
import { Claim } from "./mechanics/claim";
import { Craft } from "./mechanics/craft";
import { Drop } from "./mechanics/drop";
import { Referral } from "./exchange/referral";
import { Ipfs } from "./integrations/ipfs";
import { Wrapper } from "./mechanics/wrapper";
import { Breed } from "./mechanics/breed";
import { Pyramid } from "./mechanics/pyramid";
import { CoinGecko } from "./integrations/coin-gecko";
import { Waitlist } from "./mechanics/waitlist";
import { Feedback } from "./infrastructure/feedback";

export const Dashboard: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <PageHeader message="pages.dashboard.title" />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Erc721Section />
          <Erc998Section />
          <Erc1155Section />
          <Mysterybox />
          <Wrapper />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Vesting />
          <Waitlist />
          <Claim />
          <Drop />
          <Craft />
          <Breed />
          <Lottery />
          <Staking />
          <Pyramid />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Personal />
          <Marketplace />
          <Referral />
          <OneInch />
          <CoinGecko />
          <Ipfs />
          <Pages />
          <Feedback />
        </Grid>
      </Grid>
    </div>
  );
};
