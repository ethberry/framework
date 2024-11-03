import { FC } from "react";
import { Divider, Grid } from "@mui/material";

import { PageHeader } from "@ethberry/mui-page-layout";

import { Root, StyledDivider } from "./styled";

import { Erc20Section } from "./hierarchy/erc20";
import { Erc721Section } from "./hierarchy/erc721";
import { Erc998Section } from "./hierarchy/erc998";
import { Erc1155Section } from "./hierarchy/erc1155";
import { PersonalSection } from "./mechanics/personal";
import { MarketplaceSection } from "./mechanics/marketplace";
import { MysterySection } from "./mechanics/mystery";
import { LootSection } from "./mechanics/loot";
import { PagesSection } from "./infrastructure/pages";
import { StakingSection } from "./mechanics/staking";
import { RaffleSection } from "./mechanics/raffle";
import { LotterySection } from "./mechanics/lottery";
import { LegacyVestingSection } from "./mechanics/legacy-vesting";
import { ClaimSection } from "./mechanics/claim";
import { RecipesSection } from "./mechanics/recipes";
import { AssetPromoSection } from "./mechanics/promo";
import { EcommerceSection } from "./ecommerce";
import { IpfsSection } from "./integrations/ipfs";
import { WrapperSection } from "./mechanics/wrapper";
import { BreedSection } from "./mechanics/breed";
import { PonziSection } from "./mechanics/ponzi";
import { CoinGeckoSection } from "./integrations/coin-gecko";
import { WaitListSection } from "./mechanics/waitlist";
import { FeedbackSection } from "./infrastructure/feedback";
import { RentSection } from "./mechanics/rent";
import { AchievementsSection } from "./mechanics/achievements";
import { DexSection } from "./integrations/dex";
import { ReferralSection } from "./mechanics/referral";
import { PredictionSection } from "./mechanics/prediction";
import { VestingSection } from "./mechanics/vesting";

export const Dashboard: FC = () => {
  return (
    <Root>
      <PageHeader message="pages.dashboard.title" />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <PersonalSection />
          <MarketplaceSection />
          <Erc20Section />
          <Erc721Section />
          <Erc998Section />
          <Erc1155Section />
          <Divider sx={{ m: 2 }} />
          <MysterySection />
          <LootSection />
          <WrapperSection />
        </Grid>
        <Grid item xs={12} sm={4}>
          <WaitListSection />
          <ClaimSection />
          <LegacyVestingSection />
          <VestingSection />
          <RecipesSection />
          <AssetPromoSection />
          <RentSection />
          <BreedSection />
          <StyledDivider />
          <LotterySection />
          <RaffleSection />
          <PredictionSection />
          <StakingSection />
          <PonziSection />
        </Grid>
        <Grid item xs={12} sm={4}>
          <ReferralSection />
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
