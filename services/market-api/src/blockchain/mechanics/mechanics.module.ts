import { Module } from "@nestjs/common";

import { ClaimModule } from "./claim/claim.module";
import { MysteryboxModule } from "./mysterybox/mysterybox.module";
import { StakingModule } from "./staking/staking.module";
import { VestingModule } from "./vesting/vesting.module";
import { CraftModule } from "./craft/craft.module";
import { MarketplaceModule } from "./marketplace/marketplace.module";
import { GradeModule } from "./grade/grade.module";
import { DropModule } from "./drop/drop.module";
import { ReferralModule } from "./referral/referral.module";

@Module({
  imports: [
    ClaimModule,
    MysteryboxModule,
    CraftModule,
    StakingModule,
    VestingModule,
    MarketplaceModule,
    GradeModule,
    DropModule,
    ReferralModule,
  ],
})
export class MechanicsModule {}
