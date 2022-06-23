import { forwardRef, Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc998TokenHistoryModule } from "./token-history/token-history.module";
import { Erc998CollectionModule } from "../collection/collection.module";
import { Erc998TemplateModule } from "../template/template.module";

import { Erc998TokenControllerEth } from "./token.controller.eth";
import { Erc998TokenServiceEth } from "./token.service.eth";
import { Erc998TokenService } from "./token.service";
import { Erc998TokenEntity } from "./token.entity";
import { Erc998TokenLogModule } from "./token-log/token-log.module";
import { ContractManagerModule } from "../../blockchain/contract-manager/contract-manager.module";
import { AccessControlModule } from "../../blockchain/access-control/access-control.module";

@Module({
  imports: [
    ConfigModule,
    ContractManagerModule,
    Erc998TokenHistoryModule,
    Erc998TokenLogModule,
    Erc998TemplateModule,
    AccessControlModule,
    forwardRef(() => Erc998CollectionModule),
    TypeOrmModule.forFeature([Erc998TokenEntity]),
  ],
  providers: [Logger, Erc998TokenService, Erc998TokenServiceEth],
  controllers: [Erc998TokenControllerEth],
  exports: [Erc998TokenService, Erc998TokenServiceEth],
})
export class Erc998TokenModule {}
