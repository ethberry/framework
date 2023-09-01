import { FC } from "react";
import { Grid } from "@mui/material";

import { PageHeader } from "@gemunion/mui-page-layout";

import { useStyles } from "./styles";

import { MarketplaceSection } from "./exchange/marketplace";

import { NativeSection } from "./hierarchy/native";
import { Erc20Section } from "./hierarchy/erc20";
import { Erc721Section } from "./hierarchy/erc721";
import { Erc998Section } from "./hierarchy/erc998";
import { Erc1155Section } from "./hierarchy/erc1155";

import { ClaimSection } from "./mechanics/claim";
import { DropSection } from "./mechanics/drop";
import { GradeSection } from "./mechanics/grade";
import { AdminSection } from "./infrastructure";
import { PonziSection } from "./mechanics/ponzi";
import { StakingSection } from "./mechanics/staking";
import { DispenserSection } from "./mechanics/dispenser";
import { VestingSection } from "./mechanics/vesting";

export const Dashboard: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <PageHeader message="pages.dashboard.title" />

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <NativeSection />
          <Erc20Section />
          <Erc721Section />
          <Erc998Section />
          <Erc1155Section />
        </Grid>
        <Grid item xs={12} md={4}>
          <DispenserSection />
          <ClaimSection />
          <VestingSection />
          <GradeSection />
          <DropSection />
          <StakingSection />
          <PonziSection />
        </Grid>
        <Grid item xs={12} md={4}>
          <MarketplaceSection />
          <AdminSection />
        </Grid>
      </Grid>
    </div>
  );
};
