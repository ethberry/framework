import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc20TokenControllerEth } from "./token.controller.eth";
import { Erc20TokenServiceEth } from "./token.service.eth";
import { Erc20TokenHistoryModule } from "../token-history/token-history.module";
import { Erc20TokenService } from "./token.service";
import { Erc20TokenEntity } from "./token.entity";

@Module({
  imports: [Erc20TokenHistoryModule, TypeOrmModule.forFeature([Erc20TokenEntity])],
  providers: [Logger, Erc20TokenService, Erc20TokenServiceEth],
  controllers: [Erc20TokenControllerEth],
  exports: [Erc20TokenService, Erc20TokenServiceEth],
})
export class Erc20TokenModule {}
