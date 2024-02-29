import { Module } from "@nestjs/common";

import { GamblingMechanicsModule } from "./gambling/gambling.module";
import { MetaMechanicsModule } from "./meta/meta.module";
import { MarketingMechanicsModule } from "./marketing/marketing.module";
import { GamingMechanicsModule } from "./gaming/gaming.module";

@Module({
  imports: [GamblingMechanicsModule, GamingMechanicsModule, MarketingMechanicsModule, MetaMechanicsModule],
})
export class MechanicsModule {}
