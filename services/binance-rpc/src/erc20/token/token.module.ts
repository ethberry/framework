import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc20TokenControllerWs } from "./token.controller.ws";
import { Erc20TokenServiceWs } from "./token.service.ws";
import { Erc20TokenHistoryModule } from "../token-history/token-history.module";
import { Erc20TokenService } from "./token.service";
import { Erc20TokenEntity } from "./token.entity";

@Module({
  imports: [Erc20TokenHistoryModule, TypeOrmModule.forFeature([Erc20TokenEntity])],
  providers: [Logger, Erc20TokenService, Erc20TokenServiceWs],
  controllers: [Erc20TokenControllerWs],
  exports: [Erc20TokenService, Erc20TokenServiceWs],
})
export class Erc20TokenModule {}
