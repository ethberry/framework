import { Module } from "@nestjs/common";

import { ContractManagerModule } from "./contract-manager/contract-manager.module";
import { ContractManagerModuleEth } from "./contract-manager/contract-manager.module.eth";
import { AccessControlModule } from "./access-control/access-control.module";
import { ContractHistoryModule } from "./contract-history/contract-history.module";
import { RoyaltyModule } from "./rolyalty/royalty.module";
import { TokensModule } from "./tokens/tokens.module";
import { MechanicsModule } from "./mechanics/mechanics.module";

@Module({
  imports: [
    ContractManagerModule,
    ContractManagerModuleEth,
    ContractHistoryModule,
    AccessControlModule,
    RoyaltyModule,
    TokensModule,
    MechanicsModule,
  ],
})
export class BlockchainModule {}
