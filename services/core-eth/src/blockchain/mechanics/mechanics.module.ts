import { Module } from "@nestjs/common";

import { GamingMechanicsModule } from "./gaming/gaming.module";
import { GamblingMechanicsModule } from "./gambling/gambling.module";
import { MetaMechanicsModule } from "./meta/meta.module";
import { MarketingMechanicsModule } from "./marketing/marketing.module";

@Module({
  imports: [GamingMechanicsModule, GamblingMechanicsModule, MarketingMechanicsModule, MetaMechanicsModule],
})
export class MechanicsModule {}
