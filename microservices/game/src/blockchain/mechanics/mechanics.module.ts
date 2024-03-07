import { Module } from "@nestjs/common";

import { GamblingMechanicsModule } from "./gambling/gambling.module";
import { MarketingMechanicsModule } from "./marketing/marketing.module";
import { GamingMechanicsModule } from "./gaming/gaming.module";

@Module({
  imports: [GamblingMechanicsModule, GamingMechanicsModule, MarketingMechanicsModule],
})
export class MechanicsModule {}
