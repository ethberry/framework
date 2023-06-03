import { FC } from "react";
import { Divider, Grid } from "@mui/material";

import { PageHeader } from "@gemunion/mui-page-layout";

import { useStyles } from "./styles";

import { AchievementsSection } from "./achievements";

import { EcommerceSection } from "./ecommerce";

import { MarketplaceSection } from "./exchange/marketplace";
import { WalletSection } from "./exchange/wallet";

import { AdminSection } from "./infrastructure";

import { ChainLinkSection } from "./integrations/chain-link";
import { CoinGeckoSection } from "./integrations/coin-gecko";
import { CoinMarketCapSection } from "./integrations/coin-market-cap";

import { NativeSection } from "./hierarchy/native";
import { Erc20Section } from "./hierarchy/erc20";
import { Erc721Section } from "./hierarchy/erc721";
import { Erc998Section } from "./hierarchy/erc998";
import { Erc1155Section } from "./hierarchy/erc1155";

import { BreedSection } from "./mechanics/breed";
import { ClaimSection } from "./mechanics/claim";
import { Collections } from "./mechanics/collection";
import { CraftSection } from "./mechanics/craft";
import { DisperseSection } from "./mechanics/disperse";
import { DropSection } from "./mechanics/drop";
import { GradeSection } from "./mechanics/grade";
import { LotterySection } from "./mechanics/lottery";
import { MysterySection } from "./mechanics/mystery";
import { PyramidSection } from "./mechanics/pyramid";
import { RentSection } from "./mechanics/rent";
import { StakingSection } from "./mechanics/staking";
import { VestingSection } from "./mechanics/vesting";
import { WaitlistSection } from "./mechanics/waitlist";

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
          <Divider sx={{ m: 2 }} />
          <MysterySection />
          <Collections />
        </Grid>
        <Grid item xs={12} md={4}>
          <DisperseSection />
          <VestingSection />
          <WaitlistSection />
          <ClaimSection />
          <DropSection />
          <RentSection />
          <CraftSection />
          <GradeSection />
          <BreedSection />
          <Divider sx={{ m: 2 }} />
          <LotterySection />
          <StakingSection />
          <PyramidSection />
        </Grid>
        <Grid item xs={12} md={4}>
          <ChainLinkSection />
          <CoinGeckoSection />
          <CoinMarketCapSection />
          <MarketplaceSection />
          <WalletSection />
          <EcommerceSection />
          <AchievementsSection />
          <AdminSection />
        </Grid>
      </Grid>
    </div>
  );
};
