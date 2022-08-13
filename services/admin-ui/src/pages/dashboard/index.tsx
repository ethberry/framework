import { FC } from "react";
import { Grid } from "@mui/material";

import { PageHeader } from "@gemunion/mui-page-layout";

import { useStyles } from "./styles";
import { Erc20Sections } from "./hierarchy/erc20";
import { Erc1155Section } from "./hierarchy/erc1155";
import { Erc721Section } from "./hierarchy/erc721";
import { Erc998Section } from "./hierarchy/erc998";
import { Admin } from "./integrations/admin";
import { Mechanics } from "./mechanics/mechanics";
import { Staking } from "./mechanics/staking";
import { ChainLink } from "./integrations/chain-link";
import { NativeSections } from "./hierarchy/native";
import { Lottery } from "./mechanics/lottery";
import { Vesting } from "./mechanics/vesting";
import { Claim } from "./mechanics/claim";
import { Grade } from "./mechanics/grade";
import { Craft } from "./mechanics/craft";
import { Drop } from "./mechanics/drop";

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
        </Grid>
        <Grid item xs={4}>
          <Vesting />
          <Claim />
          <Craft />
          <Drop />
          <Grade />
          <Mechanics />
          <Lottery />
          <Staking />
        </Grid>
        <Grid item xs={4}>
          <ChainLink />
          <Admin />
        </Grid>
      </Grid>
    </div>
  );
};
