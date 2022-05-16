import { Logger, Module } from "@nestjs/common";

import { ContractManagerServiceWs } from "./contract-manager.service.ws";
import { ContractManagerControllerWs } from "./contract-manager.controller.ws";
import { ContractManagerHistoryModule } from "../contract-manager-history/contract-manager-history.module";
import { Erc20TokenModule } from "../../erc20/token/token.module";
import { Erc20VestingModule } from "../../erc20/vesting/vesting.module";
import { Erc721CollectionModule } from "../../erc721/collection/collection.module";
import { Erc1155CollectionModule } from "../../erc1155/collection/collection.module";

@Module({
  imports: [
    ContractManagerHistoryModule,
    Erc20VestingModule,
    Erc20TokenModule,
    Erc721CollectionModule,
    Erc1155CollectionModule,
  ],
  providers: [Logger, ContractManagerServiceWs],
  controllers: [ContractManagerControllerWs],
  exports: [ContractManagerServiceWs],
})
export class ContractManagerModule {}
