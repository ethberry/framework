import { FC } from "react";
import { Divider, Grid } from "@mui/material";

import { PageHeader } from "@ethberry/mui-page-layout";

import { Root } from "./styled";

import { MarketplaceSection } from "./mechanics/marketplace";

import { NativeSection } from "./hierarchy/native";
import { Erc20Section } from "./hierarchy/erc20";
import { Erc721Section } from "./hierarchy/erc721";
import { Erc998Section } from "./hierarchy/erc998";
import { Erc1155Section } from "./hierarchy/erc1155";

import { ClaimSection } from "./mechanics/claim";
import { AssetPromoSection } from "./mechanics/promo";
import { DiscreteSection } from "./mechanics/discrete";
import { AdminSection } from "./infrastructure";
import { PonziSection } from "./mechanics/ponzi";
import { StakingSection } from "./mechanics/staking";
import { DispenserSection } from "./mechanics/dispenser";
import { VestingSection } from "./mechanics/vesting";
import { WaitListSection } from "./mechanics/wait-list";
import { MysterySection } from "./mechanics/mystery";

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
          <MysterySection />
        </Grid>
        <Grid item xs={12} md={4}>
          <DispenserSection />
          <WaitListSection />
          <ClaimSection />
          <VestingSection />
          <DiscreteSection />
          <AssetPromoSection />
          <StakingSection />
          <PonziSection />
        </Grid>
        <Grid item xs={12} md={4}>
          <MarketplaceSection />
          <AdminSection />
        </Grid>
      </Grid>
    </Root>
  );
};
