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
import { BreedModule } from "./breed/breed.module";
import { WaitlistModule } from "./waitlist/waitlist.module";
import { PyramidModule } from "./pyramid/pyramid.module";

@Module({
  imports: [
    ClaimModule,
    MysteryModule,
    CraftModule,
    StakingModule,
    VestingModule,
    MarketplaceModule,
    GradeModule,
    BreedModule,
    DropModule,
    ReferralModule,
    LotteryModule,
    WrapperModule,
    WaitlistModule,
    PyramidModule,
  ],
})
export class MechanicsModule {}
