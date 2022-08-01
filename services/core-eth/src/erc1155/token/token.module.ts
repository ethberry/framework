import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc1155TokenControllerEth } from "./token.controller.eth";
import { Erc1155TokenServiceEth } from "./token.service.eth";
import { ContractHistoryModule } from "../../blockchain/contract-history/contract-history.module";
import { Erc1155TokenLogModule } from "./token-log/token-log.module";
import { ContractManagerModule } from "../../blockchain/contract-manager/contract-manager.module";
import { AccessControlModule } from "../../blockchain/access-control/access-control.module";
import { TemplateEntity } from "../../blockchain/hierarchy/template/template.entity";
import { ContractModule } from "../../blockchain/hierarchy/contract/contract.module";
import { TokenModule } from "../../blockchain/hierarchy/token/token.module";
import { BalanceModule } from "../../blockchain/hierarchy/balance/balance.module";
import { TemplateModule } from "../../blockchain/hierarchy/template/template.module";

@Module({
  imports: [
    ContractManagerModule,
    ContractHistoryModule,
    Erc1155TokenLogModule,
    Erc1155TokenModule,
    ContractModule,
    TokenModule,
    TemplateModule,
    ContractModule,
    BalanceModule,
    AccessControlModule,
    TypeOrmModule.forFeature([TemplateEntity]),
  ],
  providers: [Logger, Erc1155TokenServiceEth],
  controllers: [Erc1155TokenControllerEth],
  exports: [Erc1155TokenServiceEth],
})
export class Erc1155TokenModule {}
