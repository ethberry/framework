import { Logger, Module } from "@nestjs/common";

import { Erc20TokenControllerWs } from "./token.controller.ws";
import { Erc20TokenServiceWs } from "./token.service.ws";
import { Erc20TokenHistoryModule } from "../token-history/token-history.module";

@Module({
  imports: [Erc20TokenHistoryModule],
  providers: [Logger, Erc20TokenServiceWs],
  controllers: [Erc20TokenControllerWs],
  exports: [Erc20TokenServiceWs],
})
export class Erc20TokenModule {}
