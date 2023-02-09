import { Module } from "@nestjs/common";

import { ContractManagerModuleEth } from "./contract-manager/contract-manager.module.eth";
import { ContractHistoryModule } from "./hierarchy/contract/history/history.module";
import { TokensModule } from "./tokens/tokens.module";
import { MechanicsModule } from "./mechanics/mechanics.module";
import { ExchangeModule } from "./exchange/exchange.module";
import { ExtensionsModule } from "./extensions/extensions.module";

@Module({
  imports: [
    ContractManagerModuleEth,
    ContractHistoryModule,
    TokensModule,
    MechanicsModule,
    ExchangeModule,
    ExtensionsModule,
  ],
})
export class BlockchainModule {}
