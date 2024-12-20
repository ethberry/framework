import { Module } from "@nestjs/common";

import { ClaimModule } from "./claim/claim.module";
import { CollectionModule } from "./collection/collection.module";
import { LootModule } from "./loot/loot.module";
import { MysteryModule } from "./mystery/mystery.module";
import { StakingModule } from "./staking/staking.module";
import { VestingModule } from "./vesting/vesting.module";
import { WaitListModule } from "./wait-list/wait-list.module";

@Module({
  imports: [ClaimModule, CollectionModule, LootModule, MysteryModule, StakingModule, VestingModule, WaitListModule],
})
export class MarketingMechanicsModule {}
