import { FC } from "react";
import { Grid } from "@mui/material";

import { PageHeader } from "@gemunion/mui-page-layout";

import { useStyles } from "./styles";
import { Erc721Section } from "./hierarchy/erc721";
import { Erc998Section } from "./hierarchy/erc998";
import { Erc1155Section } from "./hierarchy/erc1155";
import { Personal } from "./integrations/personal";
import { Marketplace } from "./integrations/marketplace";
import { Mysterybox } from "./mechanics/mysterybox";
import { Pages } from "./integrations/pages";
import { Staking } from "./mechanics/staking";
import { Lottery } from "./mechanics/lottery";
import { Vesting } from "./mechanics/vesting";
import { Claim } from "./mechanics/claim";
import { Craft } from "./mechanics/craft";
import { Drop } from "./mechanics/drop";
import { Referral } from "./integrations/referral";
import { Ipfs } from "./integrations/ipfs";
import { Wrapper } from "./mechanics/wrapper";

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
          <Mysterybox />
          <Wrapper />
        </Grid>
        <Grid item xs={4}>
          <Vesting />
          <Claim />
          <Drop />
          <Craft />
          <Lottery />
          <Staking />
        </Grid>
        <Grid item xs={4}>
          <Personal />
          <Marketplace />
          <Referral />
          <Ipfs />
          <Pages />
        </Grid>
      </Grid>
    </div>
  );
};
