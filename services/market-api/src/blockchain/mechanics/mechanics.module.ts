import { Module } from "@nestjs/common";

import { GamingMechanicsModule } from "./gaming/gaming.module";
import { GamblingMechanicsModule } from "./gambling/gambling.module";
import { MarketingMechanicsModule } from "./marketing/marketing.module";
import { MetaMechanicsModule } from "./meta/meta.module";

@Module({
  imports: [GamingMechanicsModule, GamblingMechanicsModule, MarketingMechanicsModule, MetaMechanicsModule],
})
export class MechanicsModule {}
