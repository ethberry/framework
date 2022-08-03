import { Module } from "@nestjs/common";

import { ClaimModule } from "./claim/claim.module";
import { LootboxModule } from "./lootbox/lootbox.module";
import { CraftModule } from "./craft/craft.module";
import { StakingModule } from "./staking/staking.module";
import { VestingModule } from "./vesting/vesting.module";
import { GradeModule } from "./grade/grade.module";
import { DropModule } from "./drop/drop.module";

@Module({
  imports: [ClaimModule, LootboxModule, CraftModule, StakingModule, VestingModule, GradeModule, DropModule],
})
export class MechanicsModule {}
