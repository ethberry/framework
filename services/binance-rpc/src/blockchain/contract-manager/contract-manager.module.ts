import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { web3Provider, web3WsProvider } from "@gemunion/nestjs-web3";

import { ContractManagerServiceWs } from "./contract-manager.service.ws";
import { ContractManagerControllerWs } from "./contract-manager.controller.ws";
import { ContractManagerHistoryModule } from "../contract-manager-history/contract-manager-history.module";
import { Erc20TokenModule } from "../../erc20/token/token.module";
import { Erc20VestingModule } from "../../erc20/vesting/vesting.module";
import { Erc721CollectionModule } from "../../erc721/collection/collection.module";
import { Erc1155CollectionModule } from "../../erc1155/collection/collection.module";
import { Erc721LogModule } from "../../erc721/logs/log.module";
import { Erc20LogModule } from "../../erc20/logs/log.module";
import { Erc1155LogModule } from "../../erc1155/logs/log.module";

@Module({
  imports: [
    ConfigModule,
    ContractManagerHistoryModule,
    Erc20VestingModule,
    Erc20TokenModule,
    Erc721CollectionModule,
    Erc1155CollectionModule,
    Erc1155LogModule,
    Erc721LogModule,
    Erc20LogModule,
  ],
  providers: [Logger, web3Provider, web3WsProvider, ContractManagerServiceWs],
  controllers: [ContractManagerControllerWs],
  exports: [ContractManagerServiceWs],
})
export class ContractManagerModule {}
