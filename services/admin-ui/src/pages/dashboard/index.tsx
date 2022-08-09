import { FC } from "react";
import { Grid } from "@mui/material";

import { PageHeader } from "@gemunion/mui-page-layout";

import { useStyles } from "./styles";
import { Erc20Sections } from "./sections/erc20";
import { Erc1155Section } from "./sections/erc1155";
import { Erc721Section } from "./sections/erc721";
import { Erc998Section } from "./sections/erc998";
import { Admin } from "./sections/admin";
import { Mechanics } from "./sections/mechanics";
import { Staking } from "./sections/staking";
import { ChainLink } from "./sections/chain-link";
import { NativeSections } from "./sections/native";

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
          <Mechanics />
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
