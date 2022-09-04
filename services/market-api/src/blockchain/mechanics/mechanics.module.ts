import { Module } from "@nestjs/common";

import { ClaimModule } from "./claim/claim.module";
import { MysteryModule } from "./mystery/mystery.module";
import { StakingModule } from "./staking/staking.module";
import { VestingModule } from "./vesting/vesting.module";
import { CraftModule } from "./craft/craft.module";
import { MarketplaceModule } from "./marketplace/marketplace.module";
import { GradeModule } from "./grade/grade.module";
import { DropModule } from "./drop/drop.module";
import { ReferralModule } from "./referral/referral.module";
import { LotteryModule } from "./lottery/lottery.module";
import { WrapperModule } from "./wrapper/wrapper.module";

@Module({
  imports: [
    ClaimModule,
    MysteryModule,
    CraftModule,
    StakingModule,
    VestingModule,
    MarketplaceModule,
    GradeModule,
    DropModule,
    ReferralModule,
    LotteryModule,
    WrapperModule,
  ],
})
export class MechanicsModule {}
