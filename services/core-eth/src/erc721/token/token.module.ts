import { forwardRef, Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721TokenHistoryModule } from "./token-history/token-history.module";
import { Erc721ContractModule } from "../contract/contract.module";
import { Erc721TemplateModule } from "../template/template.module";

import { Erc721TokenControllerEth } from "./token.controller.eth";
import { Erc721TokenServiceEth } from "./token.service.eth";
import { Erc721TokenService } from "./token.service";
import { Erc721TokenLogModule } from "./token-log/token-log.module";
import { ContractManagerModule } from "../../blockchain/contract-manager/contract-manager.module";
import { AccessControlModule } from "../../blockchain/access-control/access-control.module";
import { UniTokenEntity } from "../../blockchain/uni-token/uni-token.entity";

@Module({
  imports: [
    ConfigModule,
    ContractManagerModule,
    Erc721TokenHistoryModule,
    Erc721TokenLogModule,
    Erc721TemplateModule,
    AccessControlModule,
    forwardRef(() => Erc721ContractModule),
    TypeOrmModule.forFeature([UniTokenEntity]),
  ],
  providers: [Logger, Erc721TokenService, Erc721TokenServiceEth],
  controllers: [Erc721TokenControllerEth],
  exports: [Erc721TokenService, Erc721TokenServiceEth],
})
export class Erc721TokenModule {}
