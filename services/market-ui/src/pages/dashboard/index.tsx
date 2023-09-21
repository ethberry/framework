import { FC } from "react";
import { Divider, Grid } from "@mui/material";

import { PageHeader } from "@gemunion/mui-page-layout";

import { Root } from "./styled";

import { Erc721Section } from "./hierarchy/erc721";
import { Erc998Section } from "./hierarchy/erc998";
import { Erc1155Section } from "./hierarchy/erc1155";
import { PersonalSection } from "./exchange/personal";
import { MarketplaceSection } from "./exchange/marketplace";
import { MysterySection } from "./mechanics/mystery";
import { PagesSection } from "./infrastructure/pages";
import { StakingSection } from "./mechanics/staking";
import { RaffleSection } from "./mechanics/raffle";
import { LotterySection } from "./mechanics/lottery";
import { VestingSection } from "./mechanics/vesting";
import { ClaimSection } from "./mechanics/claim";
import { RecipesSection } from "./mechanics/recipes";
import { AssetPromoSection } from "./mechanics/promo";
import { ReferralSection } from "./exchange/referral";
import { EcommerceSection } from "./ecommerce";
import { IpfsSection } from "./integrations/ipfs";
import { WrapperSection } from "./mechanics/wrapper";
import { BreedSection } from "./mechanics/breed";
import { PonziSection } from "./mechanics/ponzi";
import { CoinGeckoSection } from "./integrations/coin-gecko";
import { WaitListSection } from "./mechanics/waitlist";
import { FeedbackSection } from "./infrastructure/feedback";
import { RentSection } from "./mechanics/rent";
import { AchievementsSection } from "./achievements";
import { DexSection } from "./integrations/dex";

export const Dashboard: FC = () => {
  return (
    <Root>
      <PageHeader message="pages.dashboard.title" />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <PersonalSection />
          <MarketplaceSection />
          <ReferralSection />
          <Erc721Section />
          <Erc998Section />
          <Erc1155Section />
          <MysterySection />
          <WrapperSection />
        </Grid>
        <Grid item xs={12} sm={4}>
          <WaitListSection />
          <ClaimSection />
          <VestingSection />
          <RecipesSection />
          <AssetPromoSection />
          <RentSection />
          <BreedSection />
          <Divider sx={{ m: 2 }} />
          <LotterySection />
          <RaffleSection />
          <StakingSection />
          <PonziSection />
        </Grid>
        <Grid item xs={12} sm={4}>
          <EcommerceSection />
          <DexSection />
          <CoinGeckoSection />
          <IpfsSection />
          <PagesSection />
          <AchievementsSection />
          <FeedbackSection />
        </Grid>
      </Grid>
    </Root>
  );
};
