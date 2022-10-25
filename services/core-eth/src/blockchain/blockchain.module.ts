import { Module } from "@nestjs/common";

import { ContractManagerModuleEth } from "./contract-manager/contract-manager.module.eth";
import { AccessControlModule } from "./access-control/access-control.module";
import { ContractHistoryModule } from "./contract-history/contract-history.module";
import { RoyaltyModule } from "./royalty/royalty.module";
import { TokensModule } from "./tokens/tokens.module";
import { MechanicsModule } from "./mechanics/mechanics.module";
import { PauseModule } from "./pause/pause.module";
import { WalletModule } from "./wallet/wallet.module";

@Module({
  imports: [
    ContractManagerModuleEth,
    ContractHistoryModule,
    AccessControlModule,
    PauseModule,
    RoyaltyModule,
    TokensModule,
    MechanicsModule,
    WalletModule,
  ],
})
export class BlockchainModule {}
