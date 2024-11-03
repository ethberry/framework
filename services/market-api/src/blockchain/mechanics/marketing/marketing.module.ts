import { Module } from "@nestjs/common";

import { ClaimModule } from "./claim/claim.module";
import { MysteryModule } from "./mystery/mystery.module";
import { StakingModule } from "./staking/staking.module";
import { LegacyVestingModule } from "./legacy-vesting/legacy-vesting.module";
import { LootModule } from "./loot/loot.module";
import { WaitListModule } from "./wait-list/wait-list.module";
import { VestingModule } from "./vesting/vesting.module";
import { WrapperModule } from "./wrapper/wrapper.module";

@Module({
  imports: [ClaimModule, MysteryModule, LootModule, StakingModule, LegacyVestingModule, VestingModule, WaitListModule, WrapperModule],
})
export class MarketingMechanicsModule {}
