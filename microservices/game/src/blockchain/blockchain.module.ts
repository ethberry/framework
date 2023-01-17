import { Module } from "@nestjs/common";

import { MechanicsModule } from "./mechanics/mechanics.module";
import { ExchangeModule } from "./exchange/exchange.module";

@Module({
  imports: [MechanicsModule, ExchangeModule],
})
export class BlockchainModule {}
