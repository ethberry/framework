import { Module } from "@nestjs/common";

import { AirdropModule } from "./airdrop/airdrop.module";
import { LootboxModule } from "./lootbox/lootbox.module";
import { CraftModule } from "./craft/craft.module";
import { StakingModule } from "./staking/staking.module";
import { VestingModule } from "./vesting/vesting.module";
import { GradeModule } from "./grade/grade.module";

@Module({
  imports: [AirdropModule, LootboxModule, CraftModule, StakingModule, VestingModule, GradeModule],
})
export class MechanicsModule {}
