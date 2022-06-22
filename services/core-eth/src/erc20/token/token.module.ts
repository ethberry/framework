import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc20TokenControllerEth } from "./token.controller.eth";
import { Erc20TokenServiceEth } from "./token.service.eth";
import { Erc20TokenHistoryModule } from "./token-history/token-history.module";
import { Erc20TokenService } from "./token.service";
import { Erc20TokenEntity } from "./token.entity";
import { Erc20TokenLogModule } from "./token-log/token-log.module";
import { AccessControlModule } from "../../blockchain/access-control/access-control.module";
import { AccessListModule } from "../../blockchain/access-list/access-list.module";
import { ContractManagerModule } from "../../blockchain/contract-manager/contract-manager.module";

@Module({
  imports: [
    ContractManagerModule,
    Erc20TokenHistoryModule,
    Erc20TokenLogModule,
    AccessControlModule,
    AccessListModule,
    TypeOrmModule.forFeature([Erc20TokenEntity]),
  ],
  providers: [Logger, Erc20TokenService, Erc20TokenServiceEth],
  controllers: [Erc20TokenControllerEth],
  exports: [Erc20TokenService, Erc20TokenServiceEth],
})
export class Erc20TokenModule {}
