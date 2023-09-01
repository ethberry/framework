import { Module } from "@nestjs/common";

import { ClaimModule } from "./claim/claim.module";
import { DropModule } from "./drop/drop.module";
import { GradeModule } from "./grade/grade.module";
import { PonziModule } from "./ponzi/ponzi.module";
import { StakingModule } from "./staking/staking.module";
import { VestingModule } from "./vesting/vesting.module";
import { WaitListModule } from "./wait-list/waitlist.module";

@Module({
  imports: [ClaimModule, DropModule, GradeModule, StakingModule, PonziModule, VestingModule, WaitListModule],
})
export class MechanicsModule {}
