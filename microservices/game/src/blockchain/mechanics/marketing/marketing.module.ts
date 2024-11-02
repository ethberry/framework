import { Module } from "@nestjs/common";

import { ClaimTemplateModule } from "./claim/template/template.module";
import { LootModule } from "./loot/loot.module";
import { MysteryModule } from "./mystery/mystery.module";
import { LegacyVestingModule } from "./legacy-vesting/legacy-vesting.module";
import { WaitListModule } from "./wait-list/wait-list.module";

@Module({
  imports: [ClaimTemplateModule, MysteryModule, LootModule, LegacyVestingModule, WaitListModule],
})
export class MarketingMechanicsModule {}
