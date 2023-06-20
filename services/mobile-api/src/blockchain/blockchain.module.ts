import { Module } from "@nestjs/common";

import { ExchangeModule } from "./exchange/exchange.module";
import { MechanicsModule } from "./mechanics/mechanics.module";

@Module({
  imports: [ExchangeModule, MechanicsModule],
})
export class BlockchainModule {}
