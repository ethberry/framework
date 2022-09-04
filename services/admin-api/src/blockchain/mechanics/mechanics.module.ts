import { Module } from "@nestjs/common";

import { ClaimModule } from "./claim/claim.module";
import { MysteryModule } from "./mystery/mystery.module";
import { CraftModule } from "./craft/craft.module";
import { StakingModule } from "./staking/staking.module";
import { VestingModule } from "./vesting/vesting.module";
import { GradeModule } from "./grade/grade.module";
import { DropModule } from "./drop/drop.module";
import { LotteryModule } from "./lottery/lottery.module";

@Module({
  imports: [
    ClaimModule,
    MysteryModule,
    CraftModule,
    StakingModule,
    VestingModule,
    GradeModule,
    DropModule,
    LotteryModule,
  ],
})
export class MechanicsModule {}
