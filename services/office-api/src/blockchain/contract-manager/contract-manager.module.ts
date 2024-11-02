import { Module } from "@nestjs/common";

import { ContractManagerErc20Module } from "./erc20/erc20.module";
import { ContractManagerErc721Module } from "./erc271/erc271.module";
import { ContractManagerErc998Module } from "./erc998/erc998.module";
import { ContractManagerErc1155Module } from "./erc1155/erc1155.module";
import { ContractManagerCollectionModule } from "./collection/collection.module";
import { ContractManagerMysteryModule } from "./mystery/mystery.module";
import { ContractManagerStakingModule } from "./staking/staking.module";
import { ContractManagerPonziModule } from "./ponzi/ponzi.module";
import { ContractManagerPredictionModule } from "./prediction/prediction.module";
import { ContractManagerWaitListModule } from "./wait-list/wait-list.module";
import { ContractManagerVestingModule } from "./legacy-vesting/legacy-vesting.module";

@Module({
  imports: [
    ContractManagerErc20Module,
    ContractManagerErc721Module,
    ContractManagerErc998Module,
    ContractManagerErc1155Module,
    ContractManagerCollectionModule,
    ContractManagerMysteryModule,
    ContractManagerStakingModule,
    ContractManagerPonziModule,
    ContractManagerPredictionModule,
    ContractManagerVestingModule,
    ContractManagerWaitListModule,
  ],
})
export class ContractManagerModule {}
