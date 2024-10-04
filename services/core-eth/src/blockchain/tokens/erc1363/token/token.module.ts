import { Module } from "@nestjs/common";

import { EventHistoryModule } from "../../../event-history/event-history.module";
import { Erc1363TokenControllerEth } from "./token.controller.eth";
import { Erc1363TokenServiceEth } from "./token.service.eth";

@Module({
  imports: [EventHistoryModule],
  providers: [Erc1363TokenServiceEth],
  controllers: [Erc1363TokenControllerEth],
  exports: [Erc1363TokenServiceEth],
})
export class Erc1363TokenModule {}
