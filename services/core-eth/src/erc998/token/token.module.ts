import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc998TokenHistoryModule } from "./token-history/token-history.module";

import { Erc998TokenControllerEth } from "./token.controller.eth";
import { Erc998TokenServiceEth } from "./token.service.eth";
import { Erc998TokenLogModule } from "./token-log/token-log.module";
import { ContractManagerModule } from "../../blockchain/contract-manager/contract-manager.module";
import { AccessControlModule } from "../../blockchain/access-control/access-control.module";
import { TokenEntity } from "../../blockchain/hierarchy/token/token.entity";
import { ContractModule } from "../../blockchain/hierarchy/contract/contract.module";
import { TemplateModule } from "../../blockchain/hierarchy/template/template.module";
import { TokenModule } from "../../blockchain/hierarchy/token/token.module";

@Module({
  imports: [
    ConfigModule,
    ContractManagerModule,
    Erc998TokenHistoryModule,
    Erc998TokenLogModule,
    TemplateModule,
    AccessControlModule,
    TokenModule,
    ContractModule,
    TypeOrmModule.forFeature([TokenEntity]),
  ],
  providers: [Logger, Erc998TokenServiceEth],
  controllers: [Erc998TokenControllerEth],
  exports: [Erc998TokenServiceEth],
})
export class Erc998TokenModule {}
