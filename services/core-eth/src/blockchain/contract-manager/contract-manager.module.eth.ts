import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ContractManagerControllerEth } from "./contract-manager.controller.eth";
import { ContractManagerServiceEth } from "./contract-manager.service.eth";

import { ContractManagerHistoryModule } from "./history/history.module";
import { VestingModule } from "../mechanics/vesting/vesting.module";
import { Erc20TokenLogModule } from "../tokens/erc20/token/log/log.module";
import { Erc721TokenLogModule } from "../tokens/erc721/token/log/log.module";
import { Erc998TokenLogModule } from "../tokens/erc998/token/log/log.module";
import { Erc1155TokenLogModule } from "../tokens/erc1155/token/log/log.module";
import { VestingLogModule } from "../mechanics/vesting/log/vesting.log.module";
import { ContractManagerLogModule } from "./log/log.module";
import { ContractModule } from "../hierarchy/contract/contract.module";
import { TemplateModule } from "../hierarchy/template/template.module";
import { TokenModule } from "../hierarchy/token/token.module";
import { GradeModule } from "../mechanics/grade/grade.module";
import { MysteryLogModule } from "../mechanics/mystery/box/log/log.module";

@Module({
  imports: [
    ConfigModule,
    Erc20TokenLogModule,
    Erc721TokenLogModule,
    Erc998TokenLogModule,
    Erc1155TokenLogModule,
    MysteryLogModule,
    VestingLogModule,
    ContractManagerLogModule,
    ContractManagerHistoryModule,
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
