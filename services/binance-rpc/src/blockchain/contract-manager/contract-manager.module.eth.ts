import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ContractManagerControllerEth } from "./contract-manager.controller.eth";
import { ContractManagerServiceEth } from "./contract-manager.service.eth";

import { ContractManagerHistoryModule } from "../contract-manager-history/contract-manager-history.module";
import { Erc20VestingModule } from "../../vesting/vesting/vesting.module";
import { Erc20TokenModule } from "../../erc20/token/token.module";
import { Erc721CollectionModule } from "../../erc721/collection/collection.module";
import { Erc1155CollectionModule } from "../../erc1155/collection/collection.module";
import { Erc20LogModule } from "../../erc20/erc20-log/erc20.log.module";
import { Erc721LogModule } from "../../erc721/eth-log/erc721-log/erc721.log.module";
import { Erc1155LogModule } from "../../erc1155/eth-log/erc1155-log/erc1155.log.module";
import { VestingLogModule } from "../../vesting/vesting-log/vesting.log.module";
import { ContractManagerModule } from "./contract-manager.module";
import { ContractManagerLogModule } from "../contract-manager-log/contract-manager.log.module";

@Module({
  imports: [
    ConfigModule,
    Erc20LogModule,
    Erc721LogModule,
    Erc1155LogModule,
    VestingLogModule,
    ContractManagerLogModule,
    ContractManagerHistoryModule,
    ContractManagerModule,
    Erc20VestingModule,
    Erc20TokenModule,
    Erc721CollectionModule,
    Erc1155CollectionModule,
  ],
  providers: [Logger, ContractManagerServiceEth],
  controllers: [ContractManagerControllerEth],
  exports: [ContractManagerServiceEth],
})
export class ContractManagerModuleEth {}
