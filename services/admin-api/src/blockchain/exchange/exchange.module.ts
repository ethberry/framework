import { Module } from "@nestjs/common";

import { PayeesModule } from "./payees/payees.module";
import { MarketplaceModule } from "./marketplace/marketplace.module";

@Module({
  imports: [PayeesModule, MarketplaceModule],
})
export class ExchangeModule {}
