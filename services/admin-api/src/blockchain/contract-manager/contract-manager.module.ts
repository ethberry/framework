import { Module } from "@nestjs/common";

import { ContractManagerErc20Module } from "./erc20/erc20.module";
import { ContractManagerErc721Module } from "./erc271/erc271.module";
import { ContractManagerErc998Module } from "./erc998/erc998.module";
import { ContractManagerErc1155Module } from "./erc1155/erc1155.module";
import { ContractManagerCollectionModule } from "./collection/collection.module";
import { ContractManagerMysteryModule } from "./mystery/mystery.module";
import { ContractManagerLootModule } from "./loot/loot.module";
import { ContractManagerLotteryModule } from "./lottery/lottery.module";
import { ContractManagerRaffleModule } from "./raffle/raffle.module";
import { ContractManagerStakingModule } from "./staking/staking.module";
import { ContractManagerPonziModule } from "./ponzi/ponzi.module";
import { ContractManagerPredictionModule } from "./prediction/prediction.module";
import { ContractManagerWaitListModule } from "./wait-list/wait-list.module";
import { ContractManagerPaymentSplitterModule } from "./payment-splitter/payment-splitter.module";
import { ContractManagerVestingModule } from "./vesting/vesting.module";

@Module({
  imports: [
    ContractManagerErc20Module,
    ContractManagerErc721Module,
    ContractManagerErc998Module,
    ContractManagerErc1155Module,
    ContractManagerCollectionModule,
    ContractManagerMysteryModule,
    ContractManagerLootModule,
    ContractManagerLotteryModule,
    ContractManagerRaffleModule,
    ContractManagerStakingModule,
    ContractManagerPonziModule,
    ContractManagerPredictionModule,
    ContractManagerVestingModule,
    ContractManagerWaitListModule,
    ContractManagerPaymentSplitterModule,
  ],
})
export class ContractManagerModule {}
