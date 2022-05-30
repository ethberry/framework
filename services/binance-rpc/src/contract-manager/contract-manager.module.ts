import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractManagerControllerEth } from "./contract-manager.controller.eth";
import { ContractManagerController } from "./contract-manager.controller";
import { ContractManagerServiceEth } from "./contract-manager.service.eth";
import { ContractManagerService } from "./contract-manager.service";

import { ContractManagerHistoryModule } from "../contract-manager-history/contract-manager-history.module";
import { Erc20TokenModule } from "../erc20/token/token.module";
import { BlockchainModule } from "../blockchain/blockchain.module";
import { Erc20VestingModule } from "../vesting/vesting/vesting.module";
import { Erc721CollectionModule } from "../erc721/collection/collection.module";
import { Erc1155CollectionModule } from "../erc1155/collection/collection.module";
import { ContractManagerEntity } from "./contract-manager.entity";

@Module({
  imports: [
    ConfigModule,
    BlockchainModule,
    ContractManagerHistoryModule,
    Erc20VestingModule,
    Erc20TokenModule,
    Erc721CollectionModule,
    Erc1155CollectionModule,
    TypeOrmModule.forFeature([ContractManagerEntity]),
  ],
  providers: [Logger, ContractManagerServiceEth, ContractManagerService],
  controllers: [ContractManagerControllerEth, ContractManagerController],
  exports: [ContractManagerServiceEth, ContractManagerService],
})
export class ContractManagerModule {}
