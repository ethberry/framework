import { Module } from "@nestjs/common";

import { ClaimModule } from "./claim/claim.module";
import { AssetPromoModule } from "./promo/promo.module";
import { GradeModule } from "./grade/grade.module";
import { MysteryModule } from "./mystery/mystery.module";
import { PonziModule } from "./ponzi/ponzi.module";
import { StakingModule } from "./staking/staking.module";
import { VestingModule } from "./vesting/vesting.module";
import { WaitListModule } from "./wait-list/waitlist.module";

@Module({
  imports: [
    ClaimModule,
    AssetPromoModule,
    GradeModule,
    StakingModule,
    MysteryModule,
    PonziModule,
    VestingModule,
    WaitListModule,
  ],
})
export class MechanicsModule {}
