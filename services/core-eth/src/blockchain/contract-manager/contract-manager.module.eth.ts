import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ContractManagerControllerEth } from "./contract-manager.controller.eth";
import { ContractManagerServiceEth } from "./contract-manager.service.eth";

import { ContractManagerHistoryModule } from "./contract-manager-history/contract-manager-history.module";
import { VestingModule } from "../../mechanics/vesting/vesting.module";
import { Erc20TokenLogModule } from "../../erc20/token/token-log/token-log.module";
import { Erc721TokenLogModule } from "../../erc721/token/token-log/token-log.module";
import { Erc998TokenLogModule } from "../../erc998/token/token-log/token-log.module";
import { Erc1155TokenLogModule } from "../../erc1155/token/token-log/token-log.module";
import { VestingLogModule } from "../../mechanics/vesting/vesting-log/vesting.log.module";
import { ContractManagerModule } from "./contract-manager.module";
import { ContractManagerLogModule } from "./contract-manager-log/contract-manager.log.module";
import { ContractModule } from "../hierarchy/contract/contract.module";
import { TemplateModule } from "../hierarchy/template/template.module";
import { TokenModule } from "../hierarchy/token/token.module";
import { GradeModule } from "../../mechanics/grade/grade.module";

@Module({
  imports: [
    ConfigModule,
    Erc20TokenLogModule,
    Erc721TokenLogModule,
    Erc998TokenLogModule,
    Erc1155TokenLogModule,
    VestingLogModule,
    ContractManagerLogModule,
    ContractManagerHistoryModule,
    ContractManagerModule,
    VestingModule,
    ContractModule,
    TemplateModule,
    TokenModule,
    GradeModule,
  ],
  providers: [Logger, ContractManagerServiceEth],
  controllers: [ContractManagerControllerEth],
  exports: [ContractManagerServiceEth],
})
export class ContractManagerModuleEth {}
