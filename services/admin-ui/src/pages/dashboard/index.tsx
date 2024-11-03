import { FC } from "react";
import { Divider, Grid } from "@mui/material";

import { PageHeader } from "@ethberry/mui-page-layout";

import { Root } from "./styled";

import { AchievementsSection } from "./mechanics/achievements";

import { EcommerceSection } from "./ecommerce";

import { MarketplaceSection } from "./mechanics/marketplace";

import { ChainLinkSection } from "./integrations/chain-link";
import { CoinGeckoSection } from "./integrations/coin-gecko";
import { CoinMarketCapSection } from "./integrations/coin-market-cap";

import { NativeSection } from "./hierarchy/native";
import { Erc20Section } from "./hierarchy/erc20";
import { Erc721Section } from "./hierarchy/erc721";
import { Erc998Section } from "./hierarchy/erc998";
import { Erc1155Section } from "./hierarchy/erc1155";

import { AssetPromoSection } from "./mechanics/promo";
import { BreedSection } from "./mechanics/breed";
import { ClaimSection } from "./mechanics/claim";
import { CollectionSection } from "./mechanics/collection";
import { DispenserSection } from "./mechanics/dispenser";
import { DiscreteSection } from "./mechanics/discrete";
import { LootSection } from "./mechanics/loot";
import { LotterySection } from "./mechanics/lottery";
import { MysterySection } from "./mechanics/mystery";
import { RaffleSection } from "./mechanics/raffle";
import { RentSection } from "./mechanics/rent";
import { PonziSection } from "./mechanics/ponzi";
import { PaymentSplitterSection } from "./mechanics/payment-splitter";
import { PredictionSection } from "./mechanics/prediction";
import { RecipesSection } from "./mechanics/recipes";
import { ReferralSection } from "./mechanics/referral";
import { StakingSection } from "./mechanics/staking";
import { LegacyVestingSection } from "./mechanics/legacy-vesting";
import { VestingSection } from "./mechanics/vesting";
import { WaitListSection } from "./mechanics/wait-list";

export const Dashboard: FC = () => {
  return (
    <Root>
      <PageHeader message="pages.dashboard.title" />

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <NativeSection />
          <Erc20Section />
          <Erc721Section />
          <Erc998Section />
          <Erc1155Section />
          <Divider sx={{ m: 2 }} />
          <CollectionSection />
          <MysterySection />
          <LootSection />
        </Grid>
        <Grid item xs={12} md={4}>
          <DispenserSection />
          <WaitListSection />
          <ClaimSection />
          <LegacyVestingSection />
          <VestingSection />
          <DiscreteSection />
          <RecipesSection />
          <AssetPromoSection />
          <RentSection />
          <BreedSection />
          <Divider sx={{ m: 2 }} />
          <RaffleSection />
          <LotterySection />
          <StakingSection />
          <PonziSection />
          <PredictionSection />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReferralSection />
          <ChainLinkSection />
          <CoinGeckoSection />
          <CoinMarketCapSection />
          <MarketplaceSection />
          <EcommerceSection />
          <AchievementsSection />
          <PaymentSplitterSection />
        </Grid>
      </Grid>
    </Root>
  );
};
