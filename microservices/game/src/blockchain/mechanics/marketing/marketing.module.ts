import { Module } from "@nestjs/common";

import { ClaimModule } from "./claim/claim.module";
import { LootModule } from "./loot/loot.module";
import { MysteryModule } from "./mystery/mystery.module";
import { VestingModule } from "./vesting/vesting.module";
import { WaitListModule } from "./wait-list/wait-list.module";

@Module({
  imports: [ClaimModule, MysteryModule, LootModule, VestingModule, WaitListModule],
})
export class MarketingMechanicsModule {}
