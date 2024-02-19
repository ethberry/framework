import { Module } from "@nestjs/common";

import { MarketingMechanicsModule } from "./marketing/marketing.module";

@Module({
  imports: [MarketingMechanicsModule],
})
export class MechanicsModule {}
