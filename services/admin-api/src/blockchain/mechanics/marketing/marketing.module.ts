import { Module } from "@nestjs/common";

import { ClaimModule } from "./claim/claim.module";
import { CollectionModule } from "./collection/collection.module";
import { LootModule } from "./loot/loot.module";
import { MysteryModule } from "./mystery/mystery.module";
import { StakingModule } from "./staking/staking.module";
import { LegacyVestingModule } from "./legacy-vesting/legacy-vesting.module";
import { WaitListModule } from "./wait-list/wait-list.module";
import { VestingModule } from "./vesting/vesting.module";

@Module({
  imports: [ClaimModule, CollectionModule, LootModule, MysteryModule, StakingModule, LegacyVestingModule, VestingModule, WaitListModule],
})
export class MarketingMechanicsModule {}
