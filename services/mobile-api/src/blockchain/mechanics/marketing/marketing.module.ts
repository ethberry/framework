import { Module } from "@nestjs/common";

import { WaitListModule } from "./wait-list/wait-list.module";

@Module({
  imports: [WaitListModule],
})
export class MarketingMechanicsModule {}
