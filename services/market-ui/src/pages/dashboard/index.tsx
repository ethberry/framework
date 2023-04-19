import { FC } from "react";
import { Grid } from "@mui/material";

import { PageHeader } from "@gemunion/mui-page-layout";

import { useStyles } from "./styles";
import { Erc721Section } from "./hierarchy/erc721";
import { Erc998Section } from "./hierarchy/erc998";
import { Erc1155Section } from "./hierarchy/erc1155";
import { OneInchSection } from "./integrations/1inch";
import { PersonalSection } from "./exchange/personal";
import { MarketplaceSection } from "./exchange/marketplace";
import { MysterySection } from "./mechanics/mystery";
import { PagesSection } from "./infrastructure/pages";
import { StakingSection } from "./mechanics/staking";
import { LotterySection } from "./mechanics/lottery";
import { VestingSection } from "./mechanics/vesting";
import { ClaimSection } from "./mechanics/claim";
import { CraftSection } from "./mechanics/craft";
import { DropSection } from "./mechanics/drop";
import { ReferralSection } from "./exchange/referral";
import { IpfsSection } from "./integrations/ipfs";
import { WrapperSection } from "./mechanics/wrapper";
import { BreedSection } from "./mechanics/breed";
import { PyramidSection } from "./mechanics/pyramid";
import { CoinGeckoSection } from "./integrations/coin-gecko";
import { WaitlistSection } from "./mechanics/waitlist";
import { FeedbackSection } from "./infrastructure/feedback";
import { RentSection } from "./mechanics/rent";
import { AchievementsSection } from "./achievements";

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
          <MysterySection />
          <WrapperSection />
        </Grid>
        <Grid item xs={12} sm={4}>
          <VestingSection />
          <WaitlistSection />
          <ClaimSection />
          <DropSection />
          <RentSection />
          <CraftSection />
          <BreedSection />
          <LotterySection />
          <StakingSection />
          <PyramidSection />
        </Grid>
        <Grid item xs={12} sm={4}>
          <PersonalSection />
          <MarketplaceSection />
          <ReferralSection />
          <OneInchSection />
          <CoinGeckoSection />
          <IpfsSection />
          <PagesSection />
          <AchievementsSection />
          <FeedbackSection />
        </Grid>
      </Grid>
    </div>
  );
};
