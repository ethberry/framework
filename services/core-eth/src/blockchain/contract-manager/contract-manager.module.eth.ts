import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ContractManagerControllerEth } from "./contract-manager.controller.eth";
import { ContractManagerServiceEth } from "./contract-manager.service.eth";

import { ContractManagerHistoryModule } from "./contract-manager-history/contract-manager-history.module";
import { VestingModule } from "../../mechanics/vesting/vesting/vesting.module";
import { Erc721ContractModule } from "../../erc721/contract/contract.module";
import { Erc1155CollectionModule } from "../../erc1155/contract/contract.module";
import { Erc20TokenLogModule } from "../../erc20/token/token-log/token-log.module";
import { Erc721TokenLogModule } from "../../erc721/token/token-log/token-log.module";
import { Erc1155TokenLogModule } from "../../erc1155/token/token-log/token-log.module";
import { VestingLogModule } from "../../mechanics/vesting/vesting-log/vesting.log.module";
import { ContractManagerModule } from "./contract-manager.module";
import { ContractManagerLogModule } from "./contract-manager-log/contract-manager.log.module";
import { Erc20ContractModule } from "../../erc20/contract/contract.module";

@Module({
  imports: [
    ConfigModule,
    Erc20TokenLogModule,
    Erc721TokenLogModule,
    Erc1155TokenLogModule,
    VestingLogModule,
    ContractManagerLogModule,
    ContractManagerHistoryModule,
    ContractManagerModule,
    VestingModule,
    Erc20ContractModule,
    Erc721ContractModule,
    Erc1155CollectionModule,
  ],
  providers: [Logger, ContractManagerServiceEth],
  controllers: [ContractManagerControllerEth],
  exports: [ContractManagerServiceEth],
})
export class ContractManagerModuleEth {}
